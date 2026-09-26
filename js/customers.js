/* =====================================================
   RR TRINETRA BILLING - CUSTOMERS
   ===================================================== */

const CUSTOMER_KEY = "rrCustomers";

let customers = [];


/* =====================================================
   LOAD CUSTOMERS
   ===================================================== */

function loadCustomers() {

    try {

        const saved =
            localStorage.getItem(CUSTOMER_KEY);

        customers = saved
            ? JSON.parse(saved)
            : [];

        if (!Array.isArray(customers)) {
            customers = [];
        }

    } catch (error) {

        console.error(
            "Customer load error:",
            error
        );

        customers = [];
    }

    renderCustomers();
}


/* =====================================================
   SAVE CUSTOMER ARRAY
   ===================================================== */

function saveCustomers() {

    localStorage.setItem(
        CUSTOMER_KEY,
        JSON.stringify(customers)
    );
}


/* =====================================================
   GENERATE CUSTOMER ID
   ===================================================== */

function generateCustomerId() {

    const lastNumber = parseInt(
        localStorage.getItem(
            "lastCustomerNumber"
        ) || "1000",
        10
    );

    const nextNumber = lastNumber + 1;

    localStorage.setItem(
        "lastCustomerNumber",
        String(nextNumber)
    );

    return `CUS-${nextNumber}`;
}


/* =====================================================
   FORM SUBMIT
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "customerForm"
            );

        const searchInput =
            document.getElementById(
                "customerSearch"
            );


        if (form) {

            form.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    saveCustomer();

                }
            );

        }


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                () => {

                    renderCustomers(
                        searchInput.value
                    );

                }
            );

        }


        loadCustomers();

    }
);


/* =====================================================
   SAVE / UPDATE CUSTOMER
   ===================================================== */

function saveCustomer() {

    const name =
        document
            .getElementById("customerName")
            .value
            .trim();


    const mobile =
        document
            .getElementById("customerMobile")
            .value
            .trim();


    const gstin =
        document
            .getElementById("customerGST")
            .value
            .trim()
            .toUpperCase();


    const address =
        document
            .getElementById("customerAddress")
            .value
            .trim();


    const editingId =
        document
            .getElementById(
                "editingCustomerId"
            )
            .value
            .trim();


    /* CUSTOMER NAME */

    if (!name) {

        alert(
            "Please enter customer name."
        );

        document
            .getElementById("customerName")
            .focus();

        return;
    }


    /* MOBILE VALIDATION */

    if (
        mobile &&
        !/^\d{10}$/.test(mobile)
    ) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        document
            .getElementById("customerMobile")
            .focus();

        return;
    }


    /* DUPLICATE MOBILE */

    if (mobile) {

        const duplicate =
            customers.find(
                customer =>
                    customer.mobile === mobile &&
                    customer.id !== editingId
            );


        if (duplicate) {

            alert(
                "This mobile number is already saved."
            );

            return;
        }

    }


    /* =================================================
       UPDATE EXISTING CUSTOMER
       ================================================= */

    if (editingId) {

        const index =
            customers.findIndex(
                customer =>
                    customer.id === editingId
            );


        if (index === -1) {

            alert(
                "Customer not found."
            );

            return;
        }


        customers[index] = {

            ...customers[index],

            name,
            mobile,
            gstin,
            address,

            updatedAt:
                new Date().toISOString()

        };


        saveCustomers();

        alert(
            "Customer updated successfully!"
        );


        cancelCustomerEdit();

        renderCustomers();

        return;
    }


    /* =================================================
       ADD NEW CUSTOMER
       ================================================= */

    const customer = {

        id:
            generateCustomerId(),

        name,

        mobile,

        gstin,

        address,

        createdAt:
            new Date().toISOString()

    };


    customers.unshift(
        customer
    );


    saveCustomers();


    alert(
        "Customer saved successfully!"
    );


    clearCustomerForm();

    renderCustomers();

}


/* =====================================================
   RENDER CUSTOMER LIST
   ===================================================== */

function renderCustomers(
    searchTerm = ""
) {

    const tbody =
        document.getElementById(
            "customerTableBody"
        );


    const emptyState =
        document.getElementById(
            "emptyCustomerState"
        );


    const countElement =
        document.getElementById(
            "customerCount"
        );


    if (!tbody) {
        return;
    }


    const search =
        searchTerm
            .trim()
            .toLowerCase();


    const filteredCustomers =
        customers.filter(
            customer => {

                const name =
                    String(
                        customer.name || ""
                    ).toLowerCase();


                const mobile =
                    String(
                        customer.mobile || ""
                    ).toLowerCase();


                const gstin =
                    String(
                        customer.gstin || ""
                    ).toLowerCase();


                const address =
                    String(
                        customer.address || ""
                    ).toLowerCase();


                return (
                    name.includes(search) ||
                    mobile.includes(search) ||
                    gstin.includes(search) ||
                    address.includes(search)
                );

            }
        );


    tbody.innerHTML = "";


    if (countElement) {

        countElement.textContent =
            customers.length;

    }


    /* EMPTY */

    if (
        filteredCustomers.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "flex";

        }

        return;
    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    /* CREATE ROWS */

    filteredCustomers.forEach(
        (customer, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td class="customer-name-cell">
                    ${escapeHTML(
                        customer.name
                    )}
                </td>

                <td class="customer-mobile-cell">
                    ${
                        escapeHTML(
                            customer.mobile
                        ) || "-"
                    }
                </td>

                <td class="customer-gst-cell">
                    ${
                        escapeHTML(
                            customer.gstin
                        ) || "-"
                    }
                </td>

                <td class="customer-address-cell">
                    ${
                        escapeHTML(
                            customer.address
                        ) || "-"
                    }
                </td>

                <td>

                    <div class="table-actions">

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editCustomer('${customer.id}')"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteCustomer('${customer.id}')"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   EDIT CUSTOMER
   ===================================================== */

function editCustomer(id) {

    const customer =
        customers.find(
            item =>
                item.id === id
        );


    if (!customer) {

        alert(
            "Customer not found."
        );

        return;
    }


    document.getElementById(
        "editingCustomerId"
    ).value =
        customer.id;


    document.getElementById(
        "customerName"
    ).value =
        customer.name || "";


    document.getElementById(
        "customerMobile"
    ).value =
        customer.mobile || "";


    document.getElementById(
        "customerGST"
    ).value =
        customer.gstin || "";


    document.getElementById(
        "customerAddress"
    ).value =
        customer.address || "";


    document.getElementById(
        "formTitle"
    ).textContent =
        "Edit Customer";


    document.getElementById(
        "saveButtonText"
    ).textContent =
        "Update Customer";


    document.getElementById(
        "cancelEditBtn"
    ).style.display =
        "inline-flex";


    document.getElementById(
        "customerName"
    ).focus();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   CANCEL EDIT
   ===================================================== */

function cancelCustomerEdit() {

    document.getElementById(
        "editingCustomerId"
    ).value = "";


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add New Customer";


    document.getElementById(
        "saveButtonText"
    ).textContent =
        "Save Customer";


    document.getElementById(
        "cancelEditBtn"
    ).style.display =
        "none";


    clearCustomerForm();

}


/* =====================================================
   DELETE CUSTOMER
   ===================================================== */

function deleteCustomer(id) {

    const customer =
        customers.find(
            item =>
                item.id === id
        );


    if (!customer) {

        return;
    }


    const confirmed =
        confirm(
            `Delete customer "${customer.name}"?`
        );


    if (!confirmed) {

        return;
    }


    customers =
        customers.filter(
            item =>
                item.id !== id
        );


    saveCustomers();

    renderCustomers();


    alert(
        "Customer deleted successfully!"
    );

}


/* =====================================================
   CLEAR FORM
   ===================================================== */

function clearCustomerForm() {

    document
        .getElementById(
            "customerName"
        )
        .value = "";


    document
        .getElementById(
            "customerMobile"
        )
        .value = "";


    document
        .getElementById(
            "customerGST"
        )
        .value = "";


    document
        .getElementById(
            "customerAddress"
        )
        .value = "";


    document
        .getElementById(
            "editingCustomerId"
        )
        .value = "";

}


/* =====================================================
   SEARCH CLEAR
   ===================================================== */

function clearCustomerSearch() {

    const search =
        document.getElementById(
            "customerSearch"
        );


    if (!search) {
        return;
    }


    search.value = "";

    renderCustomers();

}


/* =====================================================
   SEARCH FOCUS
   ===================================================== */

function focusCustomerSearch() {

    const search =
        document.getElementById(
            "customerSearch"
        );


    if (search) {

        search.focus();

    }

}


/* =====================================================
   HTML ESCAPE
   ===================================================== */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
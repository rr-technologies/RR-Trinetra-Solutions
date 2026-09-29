let quotationItemCount = 1;


// ADD ITEM
function addQuotationItem() {

    quotationItemCount++;

    const tbody =
        document.getElementById("quotationItemsBody");

    const row =
        document.createElement("tr");

    row.className = "quotation-item-row";

    row.innerHTML = `
        <td class="serial">${quotationItemCount}</td>

        <td>
            <input
                type="text"
                class="item-name"
                placeholder="Item name">
        </td>

        <td>
            <input
                type="number"
                class="item-qty"
                value="1"
                min="1"
                oninput="calculateQuotation()">
        </td>

        <td>
            <input
                type="number"
                class="item-rate"
                value="0"
                min="0"
                oninput="calculateQuotation()">
        </td>

        <td>
            <input
                type="number"
                class="item-discount"
                value="0"
                min="0"
                oninput="calculateQuotation()">
        </td>

        <td class="item-amount">
            ₹0.00
        </td>

        <td>
            <button
                type="button"
                class="delete-btn"
                onclick="removeQuotationItem(this)">
                ×
            </button>
        </td>
    `;

    tbody.appendChild(row);

    updateQuotationSerialNumbers();

    calculateQuotation();
}


// REMOVE ITEM
function removeQuotationItem(button) {

    const rows =
        document.querySelectorAll(
            ".quotation-item-row"
        );

    if (rows.length === 1) {

        alert("At least one item is required.");

        return;
    }

    button.closest("tr").remove();

    updateQuotationSerialNumbers();

    calculateQuotation();
}


// UPDATE SERIAL NUMBERS
function updateQuotationSerialNumbers() {

    const rows =
        document.querySelectorAll(
            ".quotation-item-row"
        );

    rows.forEach((row, index) => {

        row.querySelector(".serial").textContent =
            index + 1;

    });

    quotationItemCount = rows.length;
}


// CALCULATE QUOTATION
function calculateQuotation() {

    const rows =
        document.querySelectorAll(
            ".quotation-item-row"
        );

    let subtotal = 0;
    let discountTotal = 0;


    rows.forEach(row => {

        const qty =
            parseFloat(
                row.querySelector(".item-qty").value
            ) || 0;

        const rate =
            parseFloat(
                row.querySelector(".item-rate").value
            ) || 0;

        const discount =
            parseFloat(
                row.querySelector(".item-discount").value
            ) || 0;


        const grossAmount =
            qty * rate;

        const finalAmount =
            Math.max(
                grossAmount - discount,
                0
            );


        subtotal += grossAmount;

        discountTotal += discount;


        row.querySelector(".item-amount")
            .textContent =
            formatQuotationCurrency(
                finalAmount
            );

    });


    const taxableAmount =
        Math.max(
            subtotal - discountTotal,
            0
        );


    const gstPercent =
        parseFloat(
            document.getElementById(
                "gstPercent"
            ).value
        ) || 0;


    const gstAmount =
        taxableAmount *
        gstPercent /
        100;


    const grandTotal =
        taxableAmount +
        gstAmount;


    document.getElementById(
        "subtotal"
    ).textContent =
        formatQuotationCurrency(subtotal);


    document.getElementById(
        "discountTotal"
    ).textContent =
        formatQuotationCurrency(
            discountTotal
        );


    document.getElementById(
        "gstAmount"
    ).textContent =
        formatQuotationCurrency(
            gstAmount
        );


    document.getElementById(
        "grandTotal"
    ).textContent =
        formatQuotationCurrency(
            grandTotal
        );
}


// CURRENCY
function formatQuotationCurrency(amount) {

    return "₹" +
        amount.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}


// GET GRAND TOTAL
function getQuotationGrandTotal() {

    const totalText =
        document.getElementById(
            "grandTotal"
        ).textContent;

    return parseFloat(
        totalText.replace(/[₹,]/g, "")
    ) || 0;
}


// GENERATE NEXT QUOTATION NUMBER
function generateNextQuotationNumber() {

    let number =
        parseInt(
            localStorage.getItem(
                "lastQuotationNumber"
            ) || "1000"
        );

    number++;

    localStorage.setItem(
        "lastQuotationNumber",
        number
    );

    document.getElementById(
        "quotationNumber"
    ).textContent =
        "QT-" + number;
}


// SAVE QUOTATION
function saveQuotation(showMessage = true) {

    calculateQuotation();


    const customerName =
        document.getElementById(
            "customerName"
        ).value.trim();


    if (!customerName) {

        alert("Please enter customer name.");

        return null;
    }


    const rows =
        document.querySelectorAll(
            ".quotation-item-row"
        );

    const items = [];


    rows.forEach(row => {

        const name =
            row.querySelector(
                ".item-name"
            ).value.trim();

        const qty =
            parseFloat(
                row.querySelector(
                    ".item-qty"
                ).value
            ) || 0;

        const rate =
            parseFloat(
                row.querySelector(
                    ".item-rate"
                ).value
            ) || 0;

        const discount =
            parseFloat(
                row.querySelector(
                    ".item-discount"
                ).value
            ) || 0;


        if (name) {

            items.push({

                name: name,

                qty: qty,

                rate: rate,

                discount: discount,

                amount: Math.max(
                    qty * rate - discount,
                    0
                )

            });

        }

    });


    if (items.length === 0) {

        alert("Please add at least one item.");

        return null;
    }


    const quotationNumber =
        document.getElementById(
            "quotationNumber"
        ).textContent;


    const quotation = {

        quotationNumber:
            quotationNumber,

        customerName:
            customerName,

        mobile:
            document.getElementById(
                "customerMobile"
            ).value.trim(),

        gstin:
            document.getElementById(
                "customerGST"
            ).value.trim(),

        address:
            document.getElementById(
                "customerAddress"
            ).value.trim(),

        items:
            items,

        gstPercent:
            parseFloat(
                document.getElementById(
                    "gstPercent"
                ).value
            ) || 0,

        validity:
            document.getElementById(
                "quotationValidity"
            ).value,

        reference:
            document.getElementById(
                "quotationReference"
            ).value.trim(),

        notes:
            document.getElementById(
                "quotationNotes"
            ).value.trim(),

        date:
            new Date().toISOString(),

        total:
            getQuotationGrandTotal()

    };


    const quotations =
        JSON.parse(
            localStorage.getItem(
                "quotations"
            ) || "[]"
        );


    const editQuotationData =
    localStorage.getItem("editQuotationData");

if (editQuotationData) {

    try {

        const editingQuotation =
            JSON.parse(editQuotationData);

        const editIndex =
            quotations.findIndex(
                existingQuotation =>
                    existingQuotation.quotationNumber ===
                    quotation.quotationNumber
            );

        if (editIndex !== -1) {

            quotations[editIndex] = quotation;

        } else {

            quotations.push(quotation);

        }

        localStorage.removeItem(
            "editQuotationData"
        );

    } catch (error) {

        console.error(
            "Unable to update edited quotation:",
            error
        );

        quotations.push(quotation);
    }

} else {

    quotations.push(quotation);

}


    localStorage.setItem(
        "quotations",
        JSON.stringify(
            quotations
        )
    );


    if (showMessage) {

        alert(
            "Quotation saved successfully!"
        );


        resetQuotationForm();
    }

    generateNextQuotationNumber();

    return quotation;
}


// RESET FORM
function resetQuotationForm() {

    document.getElementById(
        "customerName"
    ).value = "";

    document.getElementById(
        "customerMobile"
    ).value = "";

    document.getElementById(
        "customerGST"
    ).value = "";

    document.getElementById(
        "customerAddress"
    ).value = "";

    document.getElementById(
        "quotationReference"
    ).value = "";

    document.getElementById(
        "quotationNotes"
    ).value = "";

    document.getElementById(
        "gstPercent"
    ).value = "0";


    const tbody =
        document.getElementById(
            "quotationItemsBody"
        );


    tbody.innerHTML = `
        <tr class="quotation-item-row">

            <td class="serial">1</td>

            <td>
                <input
                    type="text"
                    class="item-name"
                    placeholder="Item name">
            </td>

            <td>
                <input
                    type="number"
                    class="item-qty"
                    value="1"
                    min="1"
                    oninput="calculateQuotation()">
            </td>

            <td>
                <input
                    type="number"
                    class="item-rate"
                    value="0"
                    min="0"
                    oninput="calculateQuotation()">
            </td>

            <td>
                <input
                    type="number"
                    class="item-discount"
                    value="0"
                    min="0"
                    oninput="calculateQuotation()">
            </td>

            <td class="item-amount">
                ₹0.00
            </td>

            <td>
                <button
                    type="button"
                    class="delete-btn"
                    onclick="removeQuotationItem(this)">
                    ×
                </button>
            </td>

        </tr>
    `;


    quotationItemCount = 1;

    calculateQuotation();
}


// NEW QUOTATION
function newQuotation() {

    if (
        !confirm(
            "Start a new quotation?"
        )
    ) {
        return;
    }

    resetQuotationForm();

    generateNextQuotationNumber();
}


// SAVE & PRINT
function saveQuotationAndPrint() {

    const quotation = saveQuotation(false);

    if (!quotation) {
        return;
    }

    // Save quotation data for print page
    localStorage.setItem(
        "printQuotationData",
        JSON.stringify(quotation)
    );

    // Open quotation print page
    const printWindow = window.open(
        "print-quotation.html",
        "_blank"
    );

    if (!printWindow) {

        alert(
            "Please allow pop-ups for this billing software."
        );

        return;
    }

    // Refresh quotation page after print window closes
    const checkPrintWindow = setInterval(function () {

        if (printWindow.closed) {

            clearInterval(checkPrintWindow);

            window.location.reload();
        }

    }, 500);
}


// INITIALIZE
document.addEventListener("DOMContentLoaded", () => {

    const editQuotationData =
        localStorage.getItem("editQuotationData");

    if (editQuotationData) {

        try {

            const quotation =
                JSON.parse(editQuotationData);

            // QUOTATION NUMBER
            if (quotation.quotationNumber) {

                document.getElementById(
                    "quotationNumber"
                ).textContent =
                    quotation.quotationNumber;
            }

            // CUSTOMER DETAILS
            document.getElementById(
                "customerName"
            ).value =
                quotation.customerName || "";

            document.getElementById(
                "customerMobile"
            ).value =
                quotation.mobile || "";

            document.getElementById(
                "customerGST"
            ).value =
                quotation.gstin || "";

            document.getElementById(
                "customerAddress"
            ).value =
                quotation.address || "";

            // GST %
            document.getElementById(
                "gstPercent"
            ).value =
                quotation.gstPercent || 0;

            // VALIDITY
            document.getElementById(
                "quotationValidity"
            ).value =
                quotation.validity || "";

            // REFERENCE
            document.getElementById(
                "quotationReference"
            ).value =
                quotation.reference || "";

            // NOTES
            document.getElementById(
                "quotationNotes"
            ).value =
                quotation.notes || "";

            // ITEMS
            const itemsBody =
                document.getElementById(
                    "quotationItemsBody"
                );

            itemsBody.innerHTML = "";

            quotationItemCount = 0;

            const savedItems =
                Array.isArray(quotation.items)
                    ? quotation.items
                    : [];

            savedItems.forEach(item => {

                addQuotationItem();

                const rows =
                    document.querySelectorAll(
                        ".quotation-item-row"
                    );

                const row =
                    rows[rows.length - 1];

                row.querySelector(
                    ".item-name"
                ).value =
                    item.name || "";

                row.querySelector(
                    ".item-qty"
                ).value =
                    item.qty || 1;

                row.querySelector(
                    ".item-rate"
                ).value =
                    item.rate || "";

                row.querySelector(
                    ".item-discount"
                ).value =
                    item.discount || 0;

            });

            if (!savedItems.length) {
                addQuotationItem();
            }

            calculateQuotation();

            return;

        } catch (error) {

            console.error(
                "Unable to load edit quotation:",
                error
            );

            localStorage.removeItem(
                "editQuotationData"
            );
        }
    }

    // NEW QUOTATION
    const savedNumber =
        parseInt(
            localStorage.getItem(
                "lastQuotationNumber"
            ) || "1000"
        ) + 1;

    document.getElementById(
        "quotationNumber"
    ).textContent =
        "QT-" + savedNumber;

    calculateQuotation();

});
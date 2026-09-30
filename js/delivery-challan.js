let dcItemCount = 1;


/* ================================
   ADD ITEM
================================ */

function addDCItem() {

    dcItemCount++;

    const tbody =
        document.getElementById(
            "dcItemsBody"
        );

    const row =
        document.createElement("tr");

    row.className =
        "dc-item-row";

    row.innerHTML = `

        <td class="serial">
            ${dcItemCount}
        </td>

        <td>
            <input
                type="text"
                class="item-name"
                placeholder="Item name"
            >
        </td>

        <td>
            <input
                type="number"
                class="item-qty"
                value="1"
                min="1"
            >
        </td>

        <td>
            <input
                type="text"
                class="item-unit"
                value="Nos"
            >
        </td>

        <td>
            <input
                type="text"
                class="item-remarks"
                placeholder="Optional"
            >
        </td>

        <td>
            <button
                type="button"
                class="delete-btn"
                onclick="removeDCItem(this)"
            >
                ×
            </button>
        </td>

    `;

    tbody.appendChild(row);

    updateDCSerialNumbers();
}


/* ================================
   REMOVE ITEM
================================ */

function removeDCItem(button) {

    const rows =
        document.querySelectorAll(
            ".dc-item-row"
        );

    if (rows.length === 1) {

        alert(
            "At least one item is required."
        );

        return;
    }

    button
        .closest("tr")
        .remove();

    updateDCSerialNumbers();
}


/* ================================
   SERIAL NUMBERS
================================ */

function updateDCSerialNumbers() {

    const rows =
        document.querySelectorAll(
            ".dc-item-row"
        );

    rows.forEach(
        (row, index) => {

            row.querySelector(
                ".serial"
            ).textContent =
                index + 1;

        }
    );

    dcItemCount =
        rows.length;
}


/* ================================
   GET CURRENT DC NUMBER
================================ */

function getNextDCNumber() {

    const current =
        parseInt(
            localStorage.getItem(
                "lastDCNumber"
            ) || "1000",
            10
        );

    return "DC-" + (current + 1);
}


/* ================================
   GENERATE NEXT DC NUMBER
================================ */

function generateNextDCNumber() {

    const current =
        parseInt(
            localStorage.getItem(
                "lastDCNumber"
            ) || "1000",
            10
        );

    const next =
        current + 1;

    localStorage.setItem(
        "lastDCNumber",
        String(next)
    );

    document.getElementById(
        "dcNumber"
    ).textContent =
        "DC-" + next;
}


/* ================================
   SAVE DC
================================ */

function saveDC(
    showMessage = true
) {

    const customerName =
        document.getElementById(
            "customerName"
        ).value.trim();


    if (!customerName) {

        alert(
            "Please enter customer name."
        );

        return null;
    }


    const rows =
        document.querySelectorAll(
            ".dc-item-row"
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

        const unit =
            row.querySelector(
                ".item-unit"
            ).value.trim();

        const remarks =
            row.querySelector(
                ".item-remarks"
            ).value.trim();


        if (name) {

            items.push({

                name: name,

                qty: qty,

                unit: unit,

                remarks: remarks

            });

        }

    });


    if (items.length === 0) {

        alert(
            "Please add at least one item."
        );

        return null;
    }


    const dcNumber =
        document.getElementById(
            "dcNumber"
        ).textContent;


    const dc = {

        dcNumber: dcNumber,

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

        deliveryDate:
            document.getElementById(
                "deliveryDate"
            ).value,

        vehicleNumber:
            document.getElementById(
                "vehicleNumber"
            ).value.trim(),

        transportName:
            document.getElementById(
                "transportName"
            ).value.trim(),

        reference:
            document.getElementById(
                "dcReference"
            ).value.trim(),

        items: items,

        remarks:
            document.getElementById(
                "dcRemarks"
            ).value.trim(),

        createdAt:
            new Date().toISOString()

    };


    const dcList =
    JSON.parse(
        localStorage.getItem(
            "deliveryChallans"
        ) || "[]"
    );

const editDCData =
    localStorage.getItem("editDCData");

if (editDCData) {

    try {

        const editingDC =
            JSON.parse(editDCData);

        const editIndex =
            dcList.findIndex(
                existingDC =>
                    existingDC.dcNumber ===
                    dc.dcNumber
            );

        if (editIndex !== -1) {

            dcList[editIndex] = dc;

        } else {

            dcList.push(dc);

        }

        localStorage.removeItem(
            "editDCData"
        );

    } catch (error) {

        console.error(
            "Unable to update edited DC:",
            error
        );

        dcList.push(dc);
    }

} else {

    dcList.push(dc);

}

localStorage.setItem(
    "deliveryChallans",
    JSON.stringify(dcList)
);


    if (showMessage) {

        alert(
            "Delivery Challan saved successfully!"
        );

        generateNextDCNumber();

        window.location.reload();
    }


    return dc;
}


/* ================================
   RESET
================================ */

function resetDCForm() {

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
        "vehicleNumber"
    ).value = "";

    document.getElementById(
        "transportName"
    ).value = "";

    document.getElementById(
        "dcReference"
    ).value = "";

    document.getElementById(
        "dcRemarks"
    ).value = "";


    const tbody =
        document.getElementById(
            "dcItemsBody"
        );


    tbody.innerHTML = `

        <tr class="dc-item-row">

            <td class="serial">
                1
            </td>

            <td>
                <input
                    type="text"
                    class="item-name"
                    placeholder="Item name"
                >
            </td>

            <td>
                <input
                    type="number"
                    class="item-qty"
                    value="1"
                    min="1"
                >
            </td>

            <td>
                <input
                    type="text"
                    class="item-unit"
                    value="Nos"
                >
            </td>

            <td>
                <input
                    type="text"
                    class="item-remarks"
                    placeholder="Optional"
                >
            </td>

            <td>
                <button
                    type="button"
                    class="delete-btn"
                    onclick="removeDCItem(this)"
                >
                    ×
                </button>
            </td>

        </tr>

    `;


    dcItemCount = 1;
}


/* ================================
   NEW DC
================================ */

function newDC() {

    if (
        !confirm(
            "Start a new Delivery Challan?"
        )
    ) {
        return;
    }

    resetDCForm();

    generateNextDCNumber();
}


/* ================================
   SAVE & PRINT
================================ */

function saveDCAndPrint() {

    const dc = saveDC(false);

    if (!dc) {
        return;
    }

    // Save current DC for print page
    localStorage.setItem(
        "printDCData",
        JSON.stringify(dc)
    );

    // Move to next DC number
    generateNextDCNumber();

    // Open print page
    const printWindow = window.open(
        "print-delivery-challan.html",
        "_blank"
    );

    if (!printWindow) {

        alert(
            "Please allow pop-ups for this billing software."
        );

        return;
    }

    // Refresh DC page after print window closes
    const checkWindow = setInterval(function () {

        if (printWindow.closed) {

            clearInterval(checkWindow);

            window.location.reload();
        }

    }, 500);
}   


/* ================================
   INITIALIZE
================================ */

document.addEventListener("DOMContentLoaded", () => {

    const editDCData =
        localStorage.getItem("editDCData");

    if (editDCData) {

        try {

            const dc =
                JSON.parse(editDCData);

            // DC NUMBER
            if (dc.dcNumber) {
                document.getElementById(
                    "dcNumber"
                ).textContent = dc.dcNumber;
            }

            // CUSTOMER DETAILS
            document.getElementById(
                "customerName"
            ).value =
                dc.customerName || "";

            document.getElementById(
                "customerMobile"
            ).value =
                dc.mobile || "";

            document.getElementById(
                "customerGST"
            ).value =
                dc.gstin || "";

            document.getElementById(
                "customerAddress"
            ).value =
                dc.address || "";

            // DELIVERY DETAILS
            document.getElementById(
                "deliveryDate"
            ).value =
                dc.deliveryDate || "";

            document.getElementById(
                "vehicleNumber"
            ).value =
                dc.vehicleNumber || "";

            document.getElementById(
                "transportName"
            ).value =
                dc.transportName || "";

            document.getElementById(
                "dcReference"
            ).value =
                dc.reference || "";

            document.getElementById(
                "dcRemarks"
            ).value =
                dc.remarks || "";

            // ITEMS
            const itemsBody =
                document.getElementById(
                    "dcItemsBody"
                );

            itemsBody.innerHTML = "";

            dcItemCount = 0;

            const savedItems =
                Array.isArray(dc.items)
                    ? dc.items
                    : [];

            savedItems.forEach(item => {

                addDCItem();

                const rows =
                    document.querySelectorAll(
                        ".dc-item-row"
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
                    ".item-unit"
                ).value =
                    item.unit || "Nos";

                row.querySelector(
                    ".item-remarks"
                ).value =
                    item.remarks || "";

            });

            if (!savedItems.length) {
                addDCItem();
            }

            

            return;

        } catch (error) {

            console.error(
                "Unable to load edited DC:",
                error
            );

            localStorage.removeItem(
                "editDCData"
            );
        }
    }

    // NEW DC
    document.getElementById(
        "deliveryDate"
    ).value =
        new Date()
            .toISOString()
            .split("T")[0];

    const nextNumber =
        getNextDCNumber();

    document.getElementById(
        "dcNumber"
    ).textContent =
        nextNumber;
});
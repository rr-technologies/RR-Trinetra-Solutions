let itemCount = 1;


// ADD ITEM
function addItemRow() {

    itemCount++;

    const tbody = document.getElementById("itemsBody");

    const row = document.createElement("tr");

    row.className = "item-row";

    row.innerHTML = `
        <td class="serial">${itemCount}</td>

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
                oninput="calculateBill()">
        </td>

        <td>
            <input
                type="number"
                class="item-rate"
                placeholder="0.00"
                min="0"
                oninput="calculateBill()">
        </td>

        <td>
            <input
                type="number"
                class="item-discount"
                value="0"
                min="0"
                oninput="calculateBill()">
        </td>

        <td class="item-amount">
            ₹0.00
        </td>

        <td>
            <button
                type="button"
                class="delete-btn"
                onclick="removeItemRow(this)">
                ×
            </button>
        </td>
    `;

    tbody.appendChild(row);

    updateSerialNumbers();
}


// REMOVE ITEM
function removeItemRow(button) {

    const rows = document.querySelectorAll(".item-row");

    if (rows.length === 1) {
        alert("At least one item is required.");
        return;
    }

    button.closest("tr").remove();

    updateSerialNumbers();

    calculateBill();
}


// SERIAL NUMBERS
function updateSerialNumbers() {

    const rows = document.querySelectorAll(".item-row");

    rows.forEach((row, index) => {
        row.querySelector(".serial").textContent = index + 1;
    });

    itemCount = rows.length;
}


// CALCULATE BILL
function calculateBill() {

    const rows = document.querySelectorAll(".item-row");

    let subtotal = 0;
    let discountTotal = 0;

    rows.forEach(row => {

        const qty =
            parseFloat(row.querySelector(".item-qty").value) || 0;

        const rate =
            parseFloat(row.querySelector(".item-rate").value) || 0;

        const discount =
            parseFloat(row.querySelector(".item-discount").value) || 0;

        const grossAmount = qty * rate;

        const finalAmount =
            Math.max(grossAmount - discount, 0);

        subtotal += grossAmount;

        discountTotal += discount;

        row.querySelector(".item-amount").textContent =
            formatCurrency(finalAmount);
    });


    const taxableAmount =
        Math.max(subtotal - discountTotal, 0);


    const gstPercent =
        parseFloat(document.getElementById("gstPercent").value) || 0;


    const gstAmount =
        taxableAmount * gstPercent / 100;


    const grandTotal =
        taxableAmount + gstAmount;


    document.getElementById("subtotal").textContent =
        formatCurrency(subtotal);

    document.getElementById("discountTotal").textContent =
        formatCurrency(discountTotal);

    document.getElementById("gstAmount").textContent =
        formatCurrency(gstAmount);

    document.getElementById("grandTotal").textContent =
        formatCurrency(grandTotal);
}


// CURRENCY
function formatCurrency(amount) {

    return "₹" + amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// NEW BILL
function newBill() {

    if (!confirm("Start a new bill?")) {
        return;
    }

    location.reload();
}


// SAVE BILL
    function saveBill(showMessage = true) {

    calculateBill();

    const customerName =
        document.getElementById("customerName").value.trim();

    if (!customerName) {
        alert("Please enter customer name.");
        return null;
    }

    const rows = document.querySelectorAll(".item-row");

    const items = [];

    rows.forEach(row => {

        const name =
            row.querySelector(".item-name").value.trim();

        const qty =
            parseFloat(row.querySelector(".item-qty").value) || 0;

        const rate =
            parseFloat(row.querySelector(".item-rate").value) || 0;

        const discount =
            parseFloat(row.querySelector(".item-discount").value) || 0;

        if (name) {
            items.push({
                name,
                qty,
                rate,
                discount,
                amount: Math.max(qty * rate - discount, 0)
            });
        }
    });

    if (items.length === 0) {
        alert("Please add at least one item.");
        return null;
    }

    const paymentMode =
        document.querySelector(
            'input[name="paymentMode"]:checked'
        ).value;

    const billNumber =
        document.getElementById("billNumber").textContent;

    const bill = {

        billNumber: billNumber,

        customerName: customerName,

        mobile:
            document.getElementById("customerMobile").value.trim(),

        gstin:
            document.getElementById("customerGST").value.trim(),

        address:
            document.getElementById("customerAddress").value.trim(),

        items: items,

        gstPercent:
            parseFloat(
                document.getElementById("gstPercent").value
            ) || 0,

        paymentMode: paymentMode,

        notes:
            document.getElementById("billNotes").value.trim(),

        date: new Date().toISOString(),

        total: getGrandTotal()
    };

    const bills =
        JSON.parse(
            localStorage.getItem("posBills") || "[]"
        );

    bills.push(bill);

    localStorage.setItem(
        "posBills",
        JSON.stringify(bills)
    );

    if (showMessage) {
    alert("Bill saved successfully!");
    window.location.reload();
}

    // Save current bill number
    const currentNumber =
        parseInt(billNumber.replace("INV-", ""));

    localStorage.setItem(
        "lastBillNumber",
        currentNumber
    );

    return bill;
}


// GET TOTAL
function getGrandTotal() {

    const totalText =
        document.getElementById("grandTotal").textContent;

    return parseFloat(
        totalText.replace(/[₹,]/g, "")
    ) || 0;
}


// GENERATE NEXT BILL NUMBER
function generateNextBillNumber() {

    let number =
        parseInt(
            localStorage.getItem("lastBillNumber") || "1000"
        );

    number++;

    localStorage.setItem(
        "lastBillNumber",
        number
    );

    document.getElementById("billNumber").textContent =
        "INV-" + number;
}


// INITIALIZE
document.addEventListener("DOMContentLoaded", () => {

    const savedNumber =
        parseInt(
            localStorage.getItem("lastBillNumber") || "1000"
        ) + 1;

    document.getElementById("billNumber").textContent =
        "INV-" + savedNumber;

    calculateBill();

});

function saveAndPrint() {

    const bill = saveBill(false);

    if (!bill) {
        return;
    }

    // Save bill data for print page
    localStorage.setItem(
        "printBillData",
        JSON.stringify(bill)
    );


    // Open professional print bill
    const printWindow = window.open(
        "print-bill.html",
        "_blank"
    );

    if (!printWindow) {
        alert("Please allow pop-ups for this billing software.");
        return;
    }

    // Refresh billing page after print window is closed
    const checkPrintWindow = setInterval(function () {

        if (printWindow.closed) {

            clearInterval(checkPrintWindow);

            window.location.reload();
        }

    }, 500);
}
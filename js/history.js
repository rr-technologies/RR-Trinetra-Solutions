/* =====================================================
   RR TRINETRA BILLING
   HISTORY PAGE
===================================================== */


/* =====================================================
   GLOBAL DATA
===================================================== */

let allHistoryRecords = [];

let activeHistoryType = "all";


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupHistoryEvents();

        loadHistory();

    }
);


/* =====================================================
   SETUP EVENTS
===================================================== */

function setupHistoryEvents() {


    /* FILTER TABS */

    document
        .querySelectorAll(".history-tab")
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".history-tab"
                            )
                            .forEach(
                                (btn) => {
                                    btn.classList.remove(
                                        "active"
                                    );
                                }
                            );


                        button.classList.add(
                            "active"
                        );


                        activeHistoryType =
                            button.dataset.type ||
                            "all";


                        renderHistory();

                    }
                );

            }
        );


    /* SEARCH */

    const searchInput =
        document.getElementById(
            "historySearch"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                renderHistory();

            }
        );

    }


    /* DATE */

    const dateInput =
        document.getElementById(
            "historyDate"
        );


    if (dateInput) {

        dateInput.addEventListener(
            "change",
            () => {

                renderHistory();

            }
        );

    }


    /* CLEAR FILTERS */

    const clearButton =
        document.getElementById(
            "clearHistoryFilters"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearHistoryFilters
        );

    }

    }

/* =====================================================
   LOAD HISTORY
===================================================== */

function loadHistory() {

    const bills =
    getLocalStorageArray(
        "posBills"
    );


    const quotations =
        getFirstAvailableArray(
            [
                "rrQuotations",
                "quotations",
                "quotationHistory"
            ]
        );


    const deliveryChallans =
        getFirstAvailableArray(
            [
                "rrDeliveryChallans",
                "deliveryChallans",
                "deliveryChallanHistory"
            ]
        );


    allHistoryRecords = [];


    /* BILLS */

    bills.forEach(
        (bill) => {

            allHistoryRecords.push(

                normalizeBill(
                    bill
                )

            );

        }
    );


    /* QUOTATIONS */

    quotations.forEach(
        (quotation) => {

            allHistoryRecords.push(

                normalizeQuotation(
                    quotation
                )

            );

        }
    );


    /* DELIVERY CHALLANS */

    deliveryChallans.forEach(
        (dc) => {

            allHistoryRecords.push(

                normalizeDeliveryChallan(
                    dc
                )

            );

        }
    );


    /* SORT NEWEST FIRST */

    allHistoryRecords.sort(
        (a, b) => {

            return (
                getTimeValue(b.date) -
                getTimeValue(a.date)
            );

        }
    );


    updateSummary();

    renderHistory();

}


/* =====================================================
   LOCAL STORAGE ARRAY
===================================================== */

function getLocalStorageArray(
    key
) {

    try {

        const value =
            localStorage.getItem(
                key
            );


        if (!value) {

            return [];

        }


        const parsed =
            JSON.parse(value);


        return Array.isArray(parsed)
            ? parsed
            : [];

    }

    catch (error) {

        console.error(
            "History storage error:",
            key,
            error
        );

        return [];

    }

}


/* =====================================================
   FIRST AVAILABLE ARRAY
===================================================== */

function getFirstAvailableArray(
    keys
) {

    for (
        const key of keys
    ) {

        const value =
            localStorage.getItem(
                key
            );


        if (!value) {

            continue;

        }


        try {

            const parsed =
                JSON.parse(value);


            if (Array.isArray(parsed)) {

                return parsed;

            }

        }

        catch (error) {

            console.warn(
                "Invalid history data:",
                key
            );

        }

    }


    return [];

}


/* =====================================================
   NORMALIZE BILL
===================================================== */

function normalizeBill(
    bill
) {

    return {

        type: "bill",

        number:
            bill.billNo ||
            bill.billNumber ||
            bill.invoiceNo ||
            "—",

        customer:
            bill.customerName ||
            bill.customer ||
            "Walk-in Customer",

        date:
            bill.date ||
            bill.createdAt ||
            bill.billDate ||
            "",

        amount:
            Number(
                bill.total ??
                bill.grandTotal ??
                bill.amount ??
                0
            ),

        original:
            bill

    };

}


/* =====================================================
   NORMALIZE QUOTATION
===================================================== */

function normalizeQuotation(
    quotation
) {

    return {

        type: "quotation",

        number:
            quotation.quotationNo ||
            quotation.quotationNumber ||
            quotation.quoteNo ||
            "—",

        customer:
            quotation.customerName ||
            quotation.customer ||
            "—",

        date:
            quotation.date ||
            quotation.createdAt ||
            quotation.quotationDate ||
            "",

        amount:
            Number(
                quotation.total ??
                quotation.grandTotal ??
                quotation.amount ??
                0
            ),

        original:
            quotation

    };

   }


/* =====================================================
   NORMALIZE DELIVERY CHALLAN
===================================================== */

function normalizeDeliveryChallan(
    dc
) {

    return {

        type: "dc",

        number:
            dc.dcNumber ||
            dc.dcNo ||
            dc.deliveryChallanNo ||
            "—",

        customer:
            dc.customerName ||
            dc.customer ||
            "—",

        date:
            dc.deliveryDate ||
            dc.date ||
            dc.createdAt ||
            "",

        amount: null,

        original:
            dc

    };

}


/* =====================================================
   UPDATE SUMMARY
===================================================== */

function updateSummary() {

    const billCount =
        allHistoryRecords.filter(
            record =>
                record.type === "bill"
        ).length;


    const quotationCount =
        allHistoryRecords.filter(
            record =>
                record.type === "quotation"
        ).length;


    const dcCount =
        allHistoryRecords.filter(
            record =>
                record.type === "dc"
        ).length;


    const totalCount =
        allHistoryRecords.length;


    const billElement =
        document.getElementById(
            "billCount"
        );


    const quotationElement =
        document.getElementById(
            "quotationCount"
        );


    const dcElement =
        document.getElementById(
            "dcCount"
        );


    const totalElement =
        document.getElementById(
            "totalRecords"
        );


    if (billElement) {

        billElement.textContent =
            billCount;

    }


    if (quotationElement) {

        quotationElement.textContent =
            quotationCount;

    }


    if (dcElement) {

        dcElement.textContent =
            dcCount;

    }


    if (totalElement) {

        totalElement.textContent =
            totalCount;

    }

}


/* =====================================================
   RENDER HISTORY
===================================================== */

function renderHistory() {

    const tbody =
        document.getElementById(
            "historyTableBody"
        );


    const emptyState =
        document.getElementById(
            "emptyHistoryState"
        );


    if (!tbody) {

        return;

    }


    const searchInput =
        document.getElementById(
            "historySearch"
        );


    const dateInput =
        document.getElementById(
            "historyDate"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedDate =
        dateInput
            ? dateInput.value
            : "";


    let filteredRecords =
        allHistoryRecords.filter(
            (record) => {


                /* TYPE */

                if (
                    activeHistoryType !== "all" &&
                    record.type !== activeHistoryType
                ) {

                    return false;

                }


                /* SEARCH */

                if (search) {

                    const number =
                        String(
                            record.number || ""
                        ).toLowerCase();


                    const customer =
                        String(
                            record.customer || ""
                        ).toLowerCase();


                    if (
                        !number.includes(search) &&
                        !customer.includes(search)
                    ) {

                        return false;

                    }

                }


                /* DATE */

                if (selectedDate) {

                    const recordDate =
                        toISODate(
                            record.date
                        );


                    if (
                        recordDate !==
                        selectedDate
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    tbody.innerHTML = "";


    if (
        filteredRecords.length === 0
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


    filteredRecords.forEach(
        (record, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${getTypeBadge(
                        record.type
                    )}
                </td>

                <td class="history-document-number">
                    ${escapeHTML(
                        record.number
                    )}
                </td>

                <td class="history-customer-name">
                    ${escapeHTML(
                        record.customer
                    )}
                </td>

                <td>
                    ${formatHistoryDate(
                        record.date
                    )}
                </td>

                <td class="history-amount">
                    ${formatAmount(
                        record
                    )}
                </td>

                <td>

                    <div class="history-actions">

                        <button
                            type="button"
                            class="history-view-btn"
                            data-index="${allHistoryRecords.indexOf(record)}"
                        >
                            View
                        </button>

                        <button
                            type="button"
                            class="history-print-btn"
                            data-index="${allHistoryRecords.indexOf(record)}"
                        >
                            Print
                        </button>

                        <button
    type="button"
    class="history-edit-btn"
    data-index="${allHistoryRecords.indexOf(record)}"
>
    Edit
</button>

                    </div>

                </td>

            `;


            tbody.appendChild(
                row
            );


            const viewButton =
                row.querySelector(
                    ".history-view-btn"
                );


            const printButton =
                row.querySelector(
                    ".history-print-btn"
                );

                const editButton =
    row.querySelector(
        ".history-edit-btn"
    );

            if (viewButton) {

                viewButton.addEventListener(
                    "click",
                    () => {

                        viewHistoryRecord(
                            record
                        );

                    }
                );

            }

            if (editButton) {

    editButton.addEventListener(
        "click",
        () => {

            editHistoryRecord(
                record
            );

        }
    );

}


            if (printButton) {

                printButton.addEventListener(
                    "click",
                    () => {

                        printHistoryRecord(
                            record
                        );

                    }
                );

            }

        }
    );

}


/* =====================================================
   TYPE BADGE
===================================================== */

function getTypeBadge(
    type
) {

    if (type === "bill") {

        return `
            <span class="history-type bill">
                Bill
            </span>
        `;

    }


    if (
        type === "quotation"
    ) {

        return `
            <span class="history-type quotation">
                Quotation
            </span>
        `;

    }


    return `
        <span class="history-type dc">
            Delivery Challan
        </span>
    `;

}


/* =====================================================
   FORMAT AMOUNT
===================================================== */

function formatAmount(
    record
) {

    if (
        record.type === "dc"
    ) {

        return "—";

    }


    return (
        "₹" +
        Number(
            record.amount || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    );

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatHistoryDate(
    value
) {

    if (!value) {

        return "—";

    }


    const date =
        parseHistoryDate(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return date.toLocaleDateString(
        "en-IN"
    );

}


/* =====================================================
   PARSE DATE
===================================================== */

function parseHistoryDate(
    value
) {

    if (
        value instanceof Date
    ) {

        return value;

    }


    if (!value) {

        return new Date(
            "invalid"
        );

    }


    const text =
        String(value).trim();


    /* YYYY-MM-DD */

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            text
        )
    ) {

        const [
            year,
            month,
            day
        ] =
            text.split("-");


        return new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );

    }


    return new Date(
        text
    );

}


/* =====================================================
   ISO DATE
===================================================== */

function toISODate(
    value
) {

    const date =
        parseHistoryDate(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return (

        date.getFullYear() +
        "-" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            date.getDate()
        ).padStart(2, "0")

    );

}


/* =====================================================
   TIME VALUE
===================================================== */

function getTimeValue(
    value
) {

    const date =
        parseHistoryDate(
            value
        );


    const time =
        date.getTime();


    return Number.isNaN(time)
        ? 0
        : time;

}


/* =====================================================
   VIEW RECORD
===================================================== */

function viewHistoryRecord(
    record
) {

    if (!record) {

        return;

    }


    if (
        record.type === "bill"
    ) {

        localStorage.setItem(
            "printBillData",
            JSON.stringify(
                record.original
            )
        );


        window.open(
            "print-bill.html",
            "_blank"
        );


        return;

    }


    if (
        record.type === "quotation"
    ) {

        localStorage.setItem(
            "printQuotationData",
            JSON.stringify(
                record.original
            )
        );


        window.open(
            "print-quotation.html",
            "_blank"
        );


        return;

    }


    if (
        record.type === "dc"
    ) {

        localStorage.setItem(
            "printDCData",
            JSON.stringify(
                record.original
            )
        );


        window.open(
            "print-delivery-challan.html",
            "_blank"
        );

    }

}

/* =====================================================
   EDIT RECORD
   ===================================================== */

function editHistoryRecord(record) {

    if (!record || !record.original) {
        return;
    }

    if (record.type === "bill") {

        localStorage.setItem(
            "editBillData",
            JSON.stringify(record.original)
        );

        window.location.href =
            "pos-billing.html";

        return;
    }

    if (record.type === "quotation") {

        localStorage.setItem(
            "editQuotationData",
            JSON.stringify(record.original)
        );

        window.location.href =
            "quotation.html";

        return;
    }

    if (record.type === "dc") {

        localStorage.setItem(
            "editDCData",
            JSON.stringify(record.original)
        );

        window.location.href =
            "delivery-challan.html";

        return;
    }
}

/* =====================================================
   PRINT RECORD
===================================================== */

function printHistoryRecord(
    record
) {

    /*
       History buttons use the same professional
       print pages already created in the project.
    */

    viewHistoryRecord(
        record
    );

}


/* =====================================================
   CLEAR FILTERS
===================================================== */

function clearHistoryFilters() {

    const searchInput =
        document.getElementById(
            "historySearch"
        );


    const dateInput =
        document.getElementById(
            "historyDate"
        );


    if (searchInput) {

        searchInput.value = "";

    }


    if (dateInput) {

        dateInput.value = "";

    }


    activeHistoryType =
        "all";


    document
        .querySelectorAll(
            ".history-tab"
        )
        .forEach(
            (button) => {

                button.classList.remove(
                    "active"
                );


                if (
                    button.dataset.type ===
                    "all"
                ) {

                    button.classList.add(
                        "active"
                    );

                }

            }
        );


    renderHistory();

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
/* =========================================================
   RR TRINETRA - DASHBOARD LOGIC
   Read-only dashboard data
   Existing POS / Quotation / DC / Customer data untouched
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeDashboard();
});


/* =========================================================
   SAFE LOCAL STORAGE
   ========================================================= */

function getStorageArray(keys) {
    for (const key of keys) {
        try {
            const raw = localStorage.getItem(key);

            if (!raw) {
                continue;
            }

            const parsed = JSON.parse(raw);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (error) {
            console.warn(`Could not read localStorage key: ${key}`, error);
        }
    }

    return [];
}


/* =========================================================
   DATA SOURCES
   ========================================================= */

function getBills() {
    return getStorageArray([
        "posBills",
        "rrSales",
        "bills"
    ]);
}


function getQuotations() {
    return getStorageArray([
        "quotations",
        "rrQuotations",
        "quotationHistory"
    ]);
}


function getDeliveryChallans() {
    return getStorageArray([
        "rrDeliveryChallans",
        "deliveryChallans",
        "deliveryChallanHistory"
    ]);
}


function getCustomers() {
    return getStorageArray([
        "customers",
        "rrCustomers",
        "customerList"
    ]);
}


/* =========================================================
   SAFE NUMBER
   ========================================================= */

function toNumber(value) {

    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    if (value === null || value === undefined) {
        return 0;
    }

    const cleaned = String(value)
        .replace(/[₹,\s]/g, "")
        .replace(/[^\d.-]/g, "");

    const number = Number(cleaned);

    return Number.isFinite(number) ? number : 0;
}


/* =========================================================
   BILL TOTAL
   ========================================================= */

function getBillAmount(bill) {

    return toNumber(
        bill?.total ??
        bill?.grandTotal ??
        bill?.amount ??
        bill?.netTotal ??
        0
    );
}


/* =========================================================
   DATE HELPERS
   ========================================================= */

function getDocumentDate(document) {

    return (
        document?.date ||
        document?.createdAt ||
        document?.createdDate ||
        document?.quotationDate ||
        document?.deliveryDate ||
        document?.billDate ||
        ""
    );
}


function parseDocumentDate(value) {

    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    const text = String(value).trim();

    if (!text) {
        return null;
    }


    /* YYYY-MM-DD */

    let match = text.match(
        /^(\d{4})-(\d{1,2})-(\d{1,2})/
    );

    if (match) {

        const date = new Date(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3])
        );

        return Number.isNaN(date.getTime()) ? null : date;
    }


    /* DD-MM-YYYY */

    match = text.match(
        /^(\d{1,2})-(\d{1,2})-(\d{4})/
    );

    if (match) {

        const date = new Date(
            Number(match[3]),
            Number(match[2]) - 1,
            Number(match[1])
        );

        return Number.isNaN(date.getTime()) ? null : date;
    }


    /* DD/MM/YYYY */

    match = text.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
    );

    if (match) {

        const date = new Date(
            Number(match[3]),
            Number(match[2]) - 1,
            Number(match[1])
        );

        return Number.isNaN(date.getTime()) ? null : date;
    }


    /* Native date parser */

    const parsed = new Date(text);

    return Number.isNaN(parsed.getTime())
        ? null
        : parsed;
}


function isToday(value) {

    const date = parseDocumentDate(value);

    if (!date) {
        return false;
    }

    const today = new Date();

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}


/* =========================================================
   FORMATTERS
   ========================================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
    }).format(toNumber(amount));
}


function formatDate(value) {

    const date = parseDocumentDate(value);

    if (!date) {
        return "-";
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}


/* =========================================================
   DOCUMENT NORMALIZATION
   ========================================================= */

function normalizeDocument(
    document,
    type,
    index
) {

    let number = "-";
    let customer = "-";
    let date = getDocumentDate(document);
    let amount = 0;


    if (type === "bill") {

        number =
            document?.billNumber ||
            document?.invoiceNumber ||
            document?.invoiceNo ||
            document?.billNo ||
            "-";

        customer =
            document?.customerName ||
            document?.customer ||
            "-";

        amount = getBillAmount(document);
    }


    if (type === "quotation") {

        number =
            document?.quotationNumber ||
            document?.quotationNo ||
            document?.quoteNo ||
            "-";

        customer =
            document?.customerName ||
            document?.customer ||
            "-";

        amount = toNumber(
            document?.total ??
            document?.grandTotal ??
            document?.amount ??
            0
        );
    }


    if (type === "delivery") {

        number =
            document?.dcNumber ||
            document?.deliveryChallanNumber ||
            document?.dcNo ||
            "-";

        customer =
            document?.customerName ||
            document?.customer ||
            "-";

        amount = 0;
    }


    const parsedDate = parseDocumentDate(date);

    return {
        id: `${type}-${index}`,
        type,
        number,
        customer,
        date,
        parsedDate,
        amount,
        original: document
    };
}


/* =========================================================
   RECENT DOCUMENTS
   ========================================================= */

function getRecentDocuments() {

    const bills = getBills();
    const quotations = getQuotations();
    const deliveryChallans = getDeliveryChallans();

    const documents = [];


    bills.forEach((bill, index) => {

        documents.push(
            normalizeDocument(
                bill,
                "bill",
                index
            )
        );

    });


    quotations.forEach((quotation, index) => {

        documents.push(
            normalizeDocument(
                quotation,
                "quotation",
                index
            )
        );

    });


    deliveryChallans.forEach((dc, index) => {

        documents.push(
            normalizeDocument(
                dc,
                "delivery",
                index
            )
        );

    });


    documents.sort((a, b) => {

        const dateA = a.parsedDate
            ? a.parsedDate.getTime()
            : 0;

        const dateB = b.parsedDate
            ? b.parsedDate.getTime()
            : 0;

        return dateB - dateA;
    });


    return documents.slice(0, 8);
}


/* =========================================================
   PAGE TEXT
   ========================================================= */

function updateDashboardDateTime() {

    const dateElement =
        document.getElementById("dashboardDate");

    const timeElement =
        document.getElementById("dashboardTime");


    const now = new Date();


    if (dateElement) {

        dateElement.textContent =
            now.toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
    }


    if (timeElement) {

        timeElement.textContent =
            now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
    }
}


/* =========================================================
   SUMMARY CARDS
   ========================================================= */

function updateSummaryCards() {

    const bills = getBills();
    const quotations = getQuotations();
    const deliveryChallans = getDeliveryChallans();
    const customers = getCustomers();


    const totalSales = bills.reduce(
        (sum, bill) => {
            return sum + getBillAmount(bill);
        },
        0
    );


    const totalBillsElement =
        document.getElementById("totalBills");

    const totalSalesElement =
        document.getElementById("totalSales");

    const totalQuotationsElement =
        document.getElementById("totalQuotations");

    const totalDeliveryElement =
        document.getElementById("totalDeliveryChallans");

    const totalCustomersElement =
        document.getElementById("totalCustomers");


    if (totalBillsElement) {
        totalBillsElement.textContent =
            bills.length;
    }


    if (totalSalesElement) {
        totalSalesElement.textContent =
            formatCurrency(totalSales);
    }


    if (totalQuotationsElement) {
        totalQuotationsElement.textContent =
            quotations.length;
    }


    if (totalDeliveryElement) {
        totalDeliveryElement.textContent =
            deliveryChallans.length;
    }


    if (totalCustomersElement) {
        totalCustomersElement.textContent =
            customers.length;
    }
}


/* =========================================================
   TODAY OVERVIEW
   ========================================================= */

function updateTodayOverview() {

    const bills = getBills();
    const quotations = getQuotations();
    const deliveryChallans = getDeliveryChallans();


    const todayBills =
        bills.filter(bill =>
            isToday(getDocumentDate(bill))
        );


    const todayQuotations =
        quotations.filter(quotation =>
            isToday(getDocumentDate(quotation))
        );


    const todayDeliveryChallans =
        deliveryChallans.filter(dc =>
            isToday(getDocumentDate(dc))
        );


    const todaySales = todayBills.reduce(
        (sum, bill) => {
            return sum + getBillAmount(bill);
        },
        0
    );


    const todayBillsElement =
        document.getElementById("todayBills");

    const todaySalesElement =
        document.getElementById("todaySales");

    const todayQuotationsElement =
        document.getElementById("todayQuotations");

    const todayDeliveryElement =
        document.getElementById("todayDeliveryChallans");


    if (todayBillsElement) {
        todayBillsElement.textContent =
            todayBills.length;
    }


    if (todaySalesElement) {
        todaySalesElement.textContent =
            formatCurrency(todaySales);
    }


    if (todayQuotationsElement) {
        todayQuotationsElement.textContent =
            todayQuotations.length;
    }


    if (todayDeliveryElement) {
        todayDeliveryElement.textContent =
            todayDeliveryChallans.length;
    }
}


/* =========================================================
   RECENT TABLE
   ========================================================= */

function renderRecentDocuments() {

    const tableBody =
        document.getElementById("recentDocuments");

    if (!tableBody) {
        return;
    }


    const documents =
        getRecentDocuments();


    if (documents.length === 0) {

        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">
                    No documents available
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML =
        documents.map((document, index) => {

            let typeLabel = "";
            let typeClass = "";


            if (document.type === "bill") {
                typeLabel = "Bill";
                typeClass = "bill";
            }

            if (document.type === "quotation") {
                typeLabel = "Quotation";
                typeClass = "quotation";
            }

            if (document.type === "delivery") {
                typeLabel = "Delivery Challan";
                typeClass = "delivery";
            }


            const amountText =
                document.type === "delivery"
                    ? "—"
                    : formatCurrency(document.amount);


            return `
                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <span class="document-type ${typeClass}">
                            ${escapeHTML(typeLabel)}
                        </span>
                    </td>

                    <td>
                        <strong>
                            ${escapeHTML(document.number)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(document.customer)}
                    </td>

                    <td>
                        ${escapeHTML(formatDate(document.date))}
                    </td>

                    <td>
                        ${escapeHTML(amountText)}
                    </td>

                </tr>
            `;

        }).join("");
}


/* =========================================================
   HTML SAFETY
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   FULL DASHBOARD REFRESH
   ========================================================= */

function refreshDashboardData() {

    updateDashboardDateTime();

    updateSummaryCards();

    updateTodayOverview();

    renderRecentDocuments();
}


/* =========================================================
   REFRESH BUTTON
   ========================================================= */

function setupDashboardRefresh() {

    const refreshButton =
        document.getElementById("refreshDashboard");


    if (!refreshButton) {
        return;
    }


    refreshButton.addEventListener(
        "click",
        () => {

            refreshDashboardData();

        }
    );
}


/* =========================================================
   AUTO REFRESH CLOCK
   ========================================================= */

function setupClock() {

    updateDashboardDateTime();

    setInterval(
        updateDashboardDateTime,
        1000
    );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeDashboard() {

    refreshDashboardData();

    setupDashboardRefresh();

    setupClock();
}
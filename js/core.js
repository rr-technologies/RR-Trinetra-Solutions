/* =========================================================
   RR TRINETRA BILLING - CORE SYSTEM
   ========================================================= */

window.RRBillingCore = (() => {

    const STORAGE = {
        settings: "rrBillingSettings",

        bills: "posBills",
        quotations: "quotations",
        deliveryChallans: "deliveryChallans",

        billNumber: "lastBillNumber",
        quotationNumber: "lastQuotationNumber",
        dcNumber: "lastDCNumber",

        customers: "customers"
    };


    /* =====================================================
       SETTINGS
       ===================================================== */

    const DEFAULT_SETTINGS = {
    companyName: "RR TRINETRA Focus & Services",
    ownerName: "",
    mobile: "",
    email: "",
    address: "VIJAYAWADA",
    gstin: "",
    currency: "₹",
    receiptPrefix: "INV",
    quotationPrefix: "QT",
    dcPrefix: "DC",
    logo: "images/logo.png"
};


    function getSettings() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE.settings
                    ) || "null"
                );

            return {
                ...DEFAULT_SETTINGS,
                ...(saved || {})
            };

        } catch (error) {

            console.error(
                "Settings load error:",
                error
            );

            return {
                ...DEFAULT_SETTINGS
            };
        }
    }


    function saveSettings(settings) {

        const finalSettings = {
            ...DEFAULT_SETTINGS,
            ...(settings || {})
        };

        localStorage.setItem(
            STORAGE.settings,
            JSON.stringify(finalSettings)
        );

        return finalSettings;
    }

    /* =========================================================
   SIDEBAR BRAND SYNC
========================================================= */

function syncSidebarBrand() {

    const settings = getSettings();

    const sidebarLogo =
        document.querySelector(
            ".sidebar .brand img"
        );

    const sidebarName =
        document.querySelector(
            ".sidebar .brand h2"
        );

    if (sidebarLogo) {

        sidebarLogo.src =
            settings.logo ||
            "images/logo.png";
    }

    if (sidebarName) {

        sidebarName.textContent =
            settings.businessName ||
            settings.companyName ||
            "RR Trinetra";
    }
}


/* Auto sync on every page */

document.addEventListener(
    "DOMContentLoaded",
    syncSidebarBrand
);  


    /* =====================================================
       STORAGE HELPERS
       ===================================================== */

    function getArray(key) {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(key) || "[]"
                );

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            console.error(
                "Storage read error:",
                key,
                error
            );

            return [];
        }
    }


    function saveArray(key, data) {

        localStorage.setItem(
            key,
            JSON.stringify(
                Array.isArray(data)
                    ? data
                    : []
            )
        );

        return data;
    }


    /* =====================================================
       NUMBER GENERATORS
       ===================================================== */

    function getNextNumber(type) {

        let storageKey;
        let prefix;
        let defaultNumber = 1000;


        if (type === "bill") {

            storageKey = STORAGE.billNumber;

            prefix =
                getSettings().receiptPrefix || "INV";

        } else if (type === "quotation") {

            storageKey =
                STORAGE.quotationNumber;

            prefix =
                getSettings().quotationPrefix || "QT";

        } else if (type === "dc") {

            storageKey =
                STORAGE.dcNumber;

            prefix =
                getSettings().dcPrefix || "DC";

        } else {

            throw new Error(
                "Unknown document type: " + type
            );
        }


        const current =
            parseInt(
                localStorage.getItem(
                    storageKey
                ) || defaultNumber,
                10
            );


        const next =
            current + 1;


        localStorage.setItem(
            storageKey,
            String(next)
        );


        return `${prefix}-${next}`;
    }


    /* =====================================================
       CURRENCY
       ===================================================== */

    function formatCurrency(amount) {

        const currency =
            getSettings().currency || "₹";


        const value =
            Number(amount) || 0;


        return currency +
            value.toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );
    }


    /* =====================================================
       DATE / TIME
       ===================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "";
        }


        const date =
            new Date(dateValue);


        if (Number.isNaN(date.getTime())) {
            return "";
        }


        return date.toLocaleDateString(
            "en-IN"
        );
    }


    function formatDateTime(dateValue) {

        if (!dateValue) {
            return "";
        }


        const date =
            new Date(dateValue);


        if (Number.isNaN(date.getTime())) {
            return "";
        }


        return date.toLocaleString(
            "en-IN"
        );
    }


    /* =====================================================
       TOTAL CALCULATION
       ===================================================== */

    function calculateTotals(
        items = [],
        gstPercent = 0
    ) {

        let subtotal = 0;
        let discount = 0;


        items.forEach(item => {

            const qty =
                Number(item.qty) || 0;

            const rate =
                Number(item.rate) || 0;

            const itemDiscount =
                Number(item.discount) || 0;


            subtotal += qty * rate;

            discount += itemDiscount;

        });


        const taxableAmount =
            Math.max(
                subtotal - discount,
                0
            );


        const gst =
            taxableAmount *
            (Number(gstPercent) || 0) /
            100;


        const grandTotal =
            taxableAmount + gst;


        return {
            subtotal,
            discount,
            taxableAmount,
            gst,
            grandTotal
        };
    }


    /* =====================================================
       DOCUMENT ID
       ===================================================== */

    function createId(prefix = "RR") {

        const time =
            Date.now().toString(36);

        const random =
            Math.random()
                .toString(36)
                .substring(2, 7);


        return (
            prefix +
            "-" +
            time +
            "-" +
            random
        ).toUpperCase();
    }


    /* =====================================================
       EMPTY / SAFE VALUE
       ===================================================== */

    function safeText(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value).trim();
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    return {

        STORAGE,

        DEFAULT_SETTINGS,

        getSettings,

        saveSettings,

        getArray,

        saveArray,

        getNextNumber,

        formatCurrency,

        formatDate,

        formatDateTime,

        calculateTotals,

        createId,

        safeText

    };

})();
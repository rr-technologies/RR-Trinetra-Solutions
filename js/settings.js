/* =========================================================
   RR TRINETRA - SETTINGS LOGIC
   Settings page only
   Does not modify billing / quotation / DC logic
   ========================================================= */


/* =========================================================
   STORAGE KEY
   ========================================================= */

const SETTINGS_KEY = "rrBillingSettings";
const LEGACY_SETTINGS_KEY = "gymSettings";

/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

const DEFAULT_SETTINGS = {
    businessName: "RR Trinetra Focus & Services",
    companyName: "RR Trinetra Focus & Services",
    ownerName: "",
    mobile: "",
    email: "",
    gstin: "",
    address: "Vijayawada",
    receiptPrefix: "INV-",
    currency: "INR",
    logo: "images/logo.png"
};


/* =========================================================
   GET SETTINGS
   ========================================================= */

function getSettings() {

    try {

        const saved =
            localStorage.getItem(SETTINGS_KEY);

        if (!saved) {
            return { ...DEFAULT_SETTINGS };
        }

        const parsed =
            JSON.parse(saved);

        return {
            ...DEFAULT_SETTINGS,
            ...parsed
        };

    } catch (error) {

        console.error(
            "Unable to load settings:",
            error
        );

        return {
            ...DEFAULT_SETTINGS
        };
    }
}


/* =========================================================
   SAVE SETTINGS TO LOCAL STORAGE
   ========================================================= */

function saveSettingsToStorage(settings) {

    try {

        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(settings)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save settings:",
            error
        );

        alert(
            "Settings could not be saved."
        );

        return false;
    }
}


/* =========================================================
   LOAD SETTINGS INTO FORM
   ========================================================= */

function loadSettings() {

    const settings =
        getSettings();


    const businessName =
        document.getElementById(
            "businessName"
        );

    const ownerName =
        document.getElementById(
            "ownerName"
        );

    const mobile =
        document.getElementById(
            "businessMobile"
        );

    const email =
        document.getElementById(
            "businessEmail"
        );

    const address =
        document.getElementById(
            "businessAddress"
        );

    const receiptPrefix =
        document.getElementById(
            "receiptPrefix"
        );

    const currency =
        document.getElementById(
            "currency"
        );

    const logoPreview =
        document.getElementById(
            "logoPreview"
        );


    if (businessName) {
        businessName.value =
            settings.businessName || "";
    }


    if (ownerName) {
        ownerName.value =
            settings.ownerName || "";
    }


    if (mobile) {
        mobile.value =
            settings.mobile || "";
    }


    if (email) {
        email.value =
            settings.email || "";
    }

    const businessGSTIN =
    document.getElementById("businessGSTIN");

if (businessGSTIN) {
    businessGSTIN.value =
        settings.gstin || "";
}


    if (address) {
        address.value =
            settings.address || "";
    }


    if (receiptPrefix) {
        receiptPrefix.value =
            settings.receiptPrefix || "INV-";
    }


    if (currency) {
        currency.value =
            settings.currency || "INR";
    }


    if (logoPreview) {

        logoPreview.src =
            settings.logo ||
            DEFAULT_SETTINGS.logo;
    }

    updateSidebarBrand(settings);
}


/* =========================================================
   COLLECT FORM DATA
   ========================================================= */

function collectSettings() {

    const settings =
        getSettings();


    const businessName =
        document.getElementById(
            "businessName"
        );

    const ownerName =
        document.getElementById(
            "ownerName"
        );

    const mobile =
        document.getElementById(
            "businessMobile"
        );

    const email =
        document.getElementById(
            "businessEmail"
        );

    const address =
        document.getElementById(
            "businessAddress"
        );

    const receiptPrefix =
        document.getElementById(
            "receiptPrefix"
        );

    const currency =
        document.getElementById(
            "currency"
        );


    settings.businessName =
        businessName
            ? businessName.value.trim()
            : "";


    settings.ownerName =
        ownerName
            ? ownerName.value.trim()
            : "";


    settings.mobile =
        mobile
            ? mobile.value.trim()
            : "";


    settings.email =
        email
            ? email.value.trim()
            : "";

     settings.gstin =
    document.getElementById("businessGSTIN")
        ? document.getElementById("businessGSTIN").value.trim()
        : "";          


    settings.address =
        address
            ? address.value.trim()
            : "";


    settings.receiptPrefix =
        receiptPrefix
            ? receiptPrefix.value.trim()
            : "INV-";


    settings.currency =
        currency
            ? currency.value
            : "INR";


    return settings;
}


/* =========================================================
   SAVE BUTTON
   ========================================================= */

function handleSaveSettings() {

    const settings =
        collectSettings();


    if (!settings.businessName) {

        alert(
            "Please enter the business name."
        );

        return;
    }


    if (!settings.receiptPrefix) {

        settings.receiptPrefix =
            "INV-";
    }


    const saved =
        saveSettingsToStorage(
            settings
        );


    if (!saved) {
        return;
    }


    alert(
        "Settings saved successfully!"
    );


    updateLogoPreview(
        settings.logo
    );

    updateSidebarBrand(settings);


    /*
       Allow other pages to detect
       that settings were changed.
    */

    window.dispatchEvent(
        new CustomEvent(
            "rrSettingsUpdated",
            {
                detail: settings
            }
        )
    );
}

/* =========================================================
   UPDATE SIDEBAR BRAND
========================================================= */

function updateSidebarBrand(settings) {

    const sidebarLogo =
        document.getElementById(
            "sidebarLogo"
        );

    const sidebarGymName =
        document.getElementById(
            "sidebarGymName"
        );


    if (sidebarLogo) {

        sidebarLogo.src =
            settings.logo ||
            DEFAULT_SETTINGS.logo;
    }


    if (sidebarGymName) {

        sidebarGymName.textContent =
            settings.businessName ||
            DEFAULT_SETTINGS.businessName;
    }
}


/* =========================================================
   RESET FORM
   ========================================================= */

function handleResetSettings() {

    const confirmed =
        confirm(
            "Reset the form to default settings?"
        );


    if (!confirmed) {
        return;
    }


    const defaults = {
        ...DEFAULT_SETTINGS
    };


    const businessName =
        document.getElementById(
            "businessName"
        );

    const ownerName =
        document.getElementById(
            "ownerName"
        );

    const mobile =
        document.getElementById(
            "businessMobile"
        );

    const email =
        document.getElementById(
            "businessEmail"
        );

    const address =
        document.getElementById(
            "businessAddress"
        );

    const receiptPrefix =
        document.getElementById(
            "receiptPrefix"
        );

    const currency =
        document.getElementById(
            "currency"
        );


    if (businessName) {
        businessName.value =
            defaults.businessName;
    }


    if (ownerName) {
        ownerName.value =
            defaults.ownerName;
    }


    if (mobile) {
        mobile.value =
            defaults.mobile;
    }


    if (email) {
        email.value =
            defaults.email;
    }


    if (address) {
        address.value =
            defaults.address;
    }


    if (receiptPrefix) {
        receiptPrefix.value =
            defaults.receiptPrefix;
    }


    if (currency) {
        currency.value =
            defaults.currency;
    }


    updateLogoPreview(
        defaults.logo
    );
}


/* =========================================================
   LOGO FILE
   ========================================================= */

function setupLogoUpload() {

    const logoInput =
        document.getElementById(
            "businessLogo"
        );

    const logoPreview =
        document.getElementById(
            "logoPreview"
        );


    if (!logoInput || !logoPreview) {
        return;
    }


    logoInput.addEventListener(
        "change",
        function () {

            const file =
                this.files?.[0];


            if (!file) {
                return;
            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select an image file."
                );

                this.value = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload = function (event) {

                const imageData =
                    event.target.result;


                logoPreview.src =
                    imageData;


                const settings =
                    getSettings();


                settings.logo =
                    imageData;


                saveSettingsToStorage(
                    settings
                );

                updateSidebarBrand(settings);
            };


            reader.onerror =
                function () {

                    alert(
                        "Unable to read the selected logo."
                    );

                };


            reader.readAsDataURL(
                file
            );
        }
    );
}


/* =========================================================
   UPDATE LOGO PREVIEW
   ========================================================= */

function updateLogoPreview(
    logo
) {

    const logoPreview =
        document.getElementById(
            "logoPreview"
        );


    if (!logoPreview) {
        return;
    }


    logoPreview.src =
        logo ||
        DEFAULT_SETTINGS.logo;
}


/* =========================================================
   BACKUP DATA
   ========================================================= */

function backupData() {

    const backup = {};


    try {

        for (
            let i = 0;
            i < localStorage.length;
            i++
        ) {

            const key =
                localStorage.key(i);


            if (!key) {
                continue;
            }


            backup[key] =
                localStorage.getItem(key);
        }


        const backupObject = {
            app: "RR Trinetra Billing",
            version: "1.0",
            exportedAt:
                new Date().toISOString(),
            data: backup
        };


        const json =
            JSON.stringify(
                backupObject,
                null,
                2
            );


        const blob =
            new Blob(
                [json],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement("a");


        const datePart =
            new Date()
                .toISOString()
                .slice(0, 10);


        link.href = url;


        link.download =
            `RR-Trinetra-Backup-${datePart}.json`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );


        alert(
            "Backup created successfully!"
        );

    } catch (error) {

        console.error(
            "Backup failed:",
            error
        );

        alert(
            "Backup could not be created."
        );
    }
}


/* =========================================================
   RESTORE DATA
   ========================================================= */

function restoreData() {

    const fileInput =
        document.getElementById(
            "restoreFile"
        );


    if (!fileInput || !fileInput.files?.[0]) {

        alert(
            "Please choose a backup file first."
        );

        return;
    }


    const file =
        fileInput.files[0];


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            try {

                const backup =
                    JSON.parse(
                        event.target.result
                    );


                if (
                    !backup ||
                    typeof backup !== "object" ||
                    !backup.data ||
                    typeof backup.data !== "object"
                ) {

                    alert(
                        "Invalid RR Trinetra backup file."
                    );

                    return;
                }


                const confirmed =
                    confirm(
                        "Restore this backup? Existing local data will be replaced."
                    );


                if (!confirmed) {
                    return;
                }


                /*
                   Clear current local storage
                   only after confirmation.
                */

                localStorage.clear();


                Object.entries(
                    backup.data
                ).forEach(
                    ([key, value]) => {

                        localStorage.setItem(
                            key,
                            value
                        );

                    }
                );


                alert(
                    "Data restored successfully. The page will reload."
                );


                window.location.reload();

            } catch (error) {

                console.error(
                    "Restore failed:",
                    error
                );

                alert(
                    "Invalid or corrupted backup file."
                );
            }
        };


    reader.onerror =
        function () {

            alert(
                "Unable to read the backup file."
            );

        };


    reader.readAsText(
        file
    );
}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

function setupSettingsEvents() {

    const saveButton =
        document.getElementById(
            "saveSettings"
        );


    const resetButton =
        document.getElementById(
            "resetSettings"
        );


    const backupButton =
        document.getElementById(
            "backupData"
        );


    const restoreButton =
        document.getElementById(
            "restoreData"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            handleSaveSettings
        );
    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            handleResetSettings
        );
    }


    if (backupButton) {

        backupButton.addEventListener(
            "click",
            backupData
        );
    }


    if (restoreButton) {

        restoreButton.addEventListener(
            "click",
            restoreData
        );
    }
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSettings();

        setupLogoUpload();

        setupSettingsEvents();

    }
);
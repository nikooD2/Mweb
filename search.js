/* =========================================================
   SEARCH MODULE
   ========================================================= */

const SearchModule = (() => {

    let records = [];

    let filteredRecords = [];
    let initialized = false;

    let currentQuery = "";
    let searchOrigin = "search";

    let currentPage = 1;

    const perPage = 6;


    /* =====================================================
       LOAD XML
       ===================================================== */

    async function init() {
        if (initialized) {
            return;
        }

        try {

            const response =
                await fetch(
                    "data/sample.xml",
                    {
                        cache: "no-store"
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "XML file could not be loaded."
                );
            }

            const xmlText =
                await response.text();

            const xml =
                new DOMParser()
                    .parseFromString(
                        xmlText,
                        "application/xml"
                    );

            if (
                xml.querySelector("parsererror")
            ) {
                throw new Error(
                    "Invalid XML."
                );
            }

            records = [
                ...xml.querySelectorAll("record")
            ].map(parseRecord);

            filteredRecords = [
                ...records
            ];
            console.log("XML loaded");
            console.log("Records:", records);

            initialized = true;

        }

        catch (error) {

            console.error(
                "Search initialization error:",
                error
            );

            records = [];
            filteredRecords = [];

        }
    
    }

    /* =====================================================
   NORMAL SEARCH PAGE
   ===================================================== */

    function renderSearchPage() {

        searchOrigin = "search";


        const content =
            document.getElementById(
                "dynamic-content"
            );

        if (!content) return;


        content.innerHTML = `

            <div class="search-page">

                <nav class="archive-breadcrumb">

                    <span class="crumb current">
                        جستجو
                    </span>

                </nav>
                <h2>
                    جستجو
                </h2>

                <div class="search-toolbar">

                    <div class="search-input-wrap">

                        <i
                            class="fa-solid
                                fa-magnifying-glass"
                        ></i>


                        <input
                            id="main-search-input"
                            class="search-input"
                            type="search"
                            placeholder="در آرشیو جستجو کنید..."
                            autocomplete="off"
                        >

                    </div>


                    <button
                        id="main-search-submit"
                        class="search-submit"
                        type="button"
                    >
                        جستجو
                    </button>

                </div>

            </div>

        `;


        const input =
            document.getElementById(
                "main-search-input"
            );


        const button =
            document.getElementById(
                "main-search-submit"
            );


        function submitSearch() {

            searchOrigin = "search";

            SearchModule.search(
                input?.value || ""
            );

            scrollToDashboard();

        }


        button?.addEventListener(
            "click",
            submitSearch
        );


        input?.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    submitSearch();

                }

            }
        );

    }
    /* =====================================================
    ADVANCED SEARCH PAGE
    ===================================================== */

    function renderAdvancedSearchPage() {

        searchOrigin = "advanced";

        const content =
            document.getElementById("dynamic-content");

        if (!content) return;


        content.innerHTML = `

            <div class="search-page advanced-search-page">

                <!-- BREADCRUMB -->

                <nav class="archive-breadcrumb">

                    <span class="crumb current">
                        جستجوی پیشرفته
                    </span>

                </nav>


                <!-- TITLE -->

                <div class="page-heading">

                    <h2>
                        جستجوی پیشرفته
                    </h2>

                </div>


                <!-- ADVANCED SEARCH -->

                <div class="advanced-search-form">


                    <div class="advanced-field">

                        <label for="advanced-title">
                            عنوان
                        </label>

                        <input
                            id="advanced-title"
                            type="text"
                            class="advanced-input"
                            placeholder="عنوان مورد نظر را وارد کنید"
                        >

                    </div>


                    <div class="advanced-field">

                        <label for="advanced-author">
                            پدیدآور
                        </label>

                        <input
                            id="advanced-author"
                            type="text"
                            class="advanced-input"
                            placeholder="نام پدیدآور را وارد کنید"
                        >

                    </div>


                    <div class="advanced-field">

                        <label for="advanced-type">
                            نوع ماده
                        </label>

                        <select
                            id="advanced-type"
                            class="advanced-input"
                        >

                            <option value="">
                                همه
                            </option>

                            <option value="question">
                                پرسش
                            </option>

                            <option value="article">
                                مقاله
                            </option>

                            <option value="book">
                                کتاب
                            </option>

                        </select>

                    </div>


                    <div class="advanced-search-actions">

                        <button
                            id="advanced-search-submit"
                            class="search-submit"
                            type="button"
                        >
                            <i class="fa-solid fa-magnifying-glass"></i>
                            جستجو
                        </button>

                    </div>


                </div>

            </div>

        `;


        const button =
            document.getElementById(
                "advanced-search-submit"
            );


        button?.addEventListener(
            "click",
            () => {

                searchOrigin = "advanced";

                advancedSearch();

            }
        );

    }

    /* =====================================================
       PARSE XML RECORD
       ===================================================== */

    function parseRecord(node) {

        const getText =
            selector =>
                node
                    .querySelector(selector)
                    ?.textContent
                    .trim() || "";


        return {

            id:
                node.getAttribute("id")
                || "",

            type:
                node.getAttribute("type")
                || "question",

            title:
                getText("title"),

            summary:
                getText("summary"),

            author:
                getText("author"),

            question:
                getText("question"),

            answer:
                getText("answer"),


            attachments: [

                ...node.querySelectorAll(
                    "attachments > attachment"
                )

            ].map(attachment => ({

                id:
                    attachment
                        .getAttribute("id")
                        || "",

                type:
                    attachment
                        .getAttribute("type")
                        || "file",

                title:
                    attachment
                        .querySelector("title")
                        ?.textContent
                        .trim() || "",

                description:
                    attachment
                        .querySelector("description")
                        ?.textContent
                        .trim() || ""

            })),


            sources: [

                ...node.querySelectorAll(
                    "sources > source"
                )

            ]

            .map(
                source =>
                    source.textContent.trim()
            )

            .filter(Boolean)

        };

    }


    /* =====================================================
       SEARCH
       ===================================================== */

    function search(query = "") {

        currentQuery =
            query.trim();

        currentPage = 1;

        const normalizedQuery =
            currentQuery.toLowerCase();


        filteredRecords =
            records.filter(record => {

                if (!normalizedQuery) {
                    return true;
                }


                const text = [

                    record.title,

                    record.summary,

                    record.author,

                    record.question,

                    record.answer

                ]

                .join(" ")

                .toLowerCase();


                return text.includes(
                    normalizedQuery
                );

            });


        renderResults();

    }

    /* =====================================================
    ADVANCED SEARCH
    ===================================================== */

    function advancedSearch() {

        const title =
            document
                .getElementById(
                    "advanced-title"
                )
                ?.value
                .trim()
                .toLowerCase()
                || "";


        const author =
            document
                .getElementById(
                    "advanced-author"
                )
                ?.value
                .trim()
                .toLowerCase()
                || "";


        const type =
            document
                .getElementById(
                    "advanced-type"
                )
                ?.value
                || "";


        filteredRecords =
            records.filter(record => {

                const titleMatch =
                    !title ||
                    record.title
                        .toLowerCase()
                        .includes(title);


                const authorMatch =
                    !author ||
                    record.author
                        .toLowerCase()
                        .includes(author);


                const typeMatch =
                    !type ||
                    record.type === type;


                return (
                    titleMatch &&
                    authorMatch &&
                    typeMatch
                );

            });


        currentQuery = "";

        currentPage = 1;


        renderResults();
        scrollToDashboard();
    }

    /* =====================================================
       RENDER RESULTS
       ===================================================== */

    function renderResults() {

        const content =
            document.getElementById(
                "dynamic-content"
            );

        if (!content) return;


        const pageRecords =
            getCurrentPageRecords();


        content.innerHTML = `

            <div class="results-page">

                    <!-- BREADCRUMB -->
                <nav class="archive-breadcrumb">

                    <button
                        class="crumb is-link"
                        data-breadcrumb="${searchOrigin}"
                    >
                        ${
                            searchOrigin === "advanced"
                                ? "جستجوی پیشرفته"
                                : "جستجو"
                        }
                    </button>

                    <span class="separator">
                        /
                    </span>

                    <span class="crumb current">
                        نتایج
                    </span>

                </nav>

                <div class="results-heading">

                    <h2>
                        نتایج
                    </h2>

                    <span class="results-count">

                        ${filteredRecords.length}
                        نتیجه

                    </span>

                </div>


                ${
                    pageRecords.length

                    ?

                    `
                    <div class="results-list">

                        ${
                            pageRecords
                                .map(renderCard)
                                .join("")
                        }

                    </div>
                    `

                    :

                    `
                    <div class="search-empty">

                        <i
                            class="fa-regular
                                fa-folder-open"
                        ></i>

                        <h2>
                            نتیجه‌ای پیدا نشد
                        </h2>

                        <p class="v1">
                            در صورت تمایل می توانید از بخش
                            <a href="#" onclick="event.preventDefault(); openDashboard('new')">
                                ارسال شبهه جدید
                            </a>
                            استفاده کنید.
                        </p>

                    </div>
                    `
                }

            </div>

        `;

        applyVersion();
        bindResultEvents();

    }


    /* =====================================================
       CARD
       ===================================================== */

    function renderCard(record) {

        return `

            <article
                class="result-card"
                data-record-id="${escapeHtml(
                    record.id
                )}"
                tabindex="0"
            >


                <!-- TITLE -->

                <h2 class="result-card-title">

                    ${escapeHtml(
                        record.title
                    )}

                </h2>


                <!-- SUMMARY -->

                <p class="result-card-summary">

                    ${escapeHtml(
                        record.summary
                    )}

                </p>


                <!-- AUTHOR -->

                <div
                    class="result-card-author"
                >

                    <i
                        class="fa-regular
                              fa-user"
                    ></i>

                    <span>

                        ${escapeHtml(
                            record.author
                            ||
                            "پدیدآور نامشخص"
                        )}

                    </span>

                </div>


                <!-- ATTACHMENTS -->

                <div
                    class="result-card-attachments"
                >

                    <span
                        class="attachment-label"
                    >
                        پیوست‌ها
                    </span>


                    ${
                        record.attachments
                            .map(
                                attachment =>
                                    renderAttachmentChip(
                                        record.id,
                                        attachment
                                    )
                            )
                            .join("")
                    }

                </div>


            </article>

        `;

    }


    /* =====================================================
       ATTACHMENT CHIP
       ===================================================== */

    function renderAttachmentChip(
        recordId,
        attachment
    ) {

        return `

            <button
                type="button"

                class="attachment-chip"

                data-record-id="${escapeHtml(
                    recordId
                )}"

                data-attachment-id="${escapeHtml(
                    attachment.id
                )}"
            >

                <i
                    class="${getAttachmentIcon(
                        attachment.type
                    )}"
                ></i>

                <span>

                    ${escapeHtml(
                        attachment.title
                    )}

                </span>

            </button>

        `;

    }


    /* =====================================================
       EVENTS
       ===================================================== */

    function bindResultEvents() {
        /* =================================================
        BREADCRUMB → SEARCH / ADVANCED
        ================================================= */

        document
            .querySelector(
                ".results-page [data-breadcrumb]"
            )
            ?.addEventListener(
                "click",
                () => {

                    if (
                        SearchModule.getSearchOrigin()
                        === "advanced"
                    ) {

                        loadPage("advanced");

                    }

                    else {

                        loadPage("search");

                    }

                }
            );


        /* =================================================
        CLICK CARD
        ================================================= */

        document
            .querySelectorAll(".result-card")
            .forEach(card => {

                card.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target.closest(
                                ".attachment-chip"
                            )
                        ) {
                            return;
                        }


                        showQuestion(
                            card.dataset.recordId
                        );

                    }
                );


                /* Keyboard */

                card.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key !== "Enter" &&
                            event.key !== " "
                        ) {
                            return;
                        }


                        event.preventDefault();


                        showQuestion(
                            card.dataset.recordId
                        );

                    }
                );

            });


        /* =================================================
        ATTACHMENT
        ================================================= */

        document
            .querySelectorAll(
                ".attachment-chip"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        showQuestion(

                            button.dataset.recordId,

                            button.dataset.attachmentId

                        );

                    }
                );

            });

    }


    /* =====================================================
       CURRENT PAGE
       ===================================================== */

    function getCurrentPageRecords() {

        const start =
            (currentPage - 1)
            * perPage;


        return filteredRecords.slice(

            start,

            start + perPage

        );

    }


    /* =====================================================
       FIND RECORD
       ===================================================== */

    function getRecordById(id) {

        return records.find(
            record =>
                record.id === id
        );

    }


    /* =====================================================
       FIND INDEX
       ===================================================== */

    function getResultIndex(id) {

        return filteredRecords.findIndex(
            record =>
                record.id === id
        );

    }


    /* =====================================================
       PREVIOUS / NEXT
       ===================================================== */

    function getAdjacentRecord(
        id,
        direction
    ) {

        const index =
            getResultIndex(id);


        if (index === -1) {
            return null;
        }


        return (
            filteredRecords[
                index + direction
            ]
            || null
        );

    }


    /* =====================================================
       ICON
       ===================================================== */

    function getAttachmentIcon(type) {

        switch (type) {

            case "pdf":

                return `
                    fa-regular fa-file-pdf
                `;

            case "audio":

                return `
                    fa-solid fa-headphones
                `;

            case "video":

                return `
                    fa-solid fa-video
                `;

            case "image":

                return `
                    fa-regular fa-image
                `;

            default:

                return `
                    fa-regular fa-file
                `;

        }

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHtml(value) {

        return String(value ?? "")

            .replaceAll(
                "&",
                "&amp;"
            )

            .replaceAll(
                "<",
                "&lt;"
            )

            .replaceAll(
                ">",
                "&gt;"
            )

            .replaceAll(
                '"',
                "&quot;"
            )

            .replaceAll(
                "'",
                "&#039;"
            );

    }

    function getResultCount() {

        return filteredRecords.length;

    }
    function getSearchOrigin() {

        return searchOrigin;

    }

    return {

        init,

        renderSearchPage,

        renderAdvancedSearchPage,

        search,

        advancedSearch,

        renderResults,

        getRecordById,

        getResultIndex,

        getAdjacentRecord,

        getResultCount,

        getSearchOrigin

    };


})();


/*=====================================
    HERO SEARCH
=====================================*/

function initHeroSearch() {

    const heroSearchInputs =
        document.querySelectorAll(".hero-search input");

    const heroSearchButtons =
        document.querySelectorAll(".hero-search button");


    if (!heroSearchInputs.length) {
        return;
    }


    heroSearchInputs.forEach((input, index) => {

        const button =
            heroSearchButtons[index];

        if (!button) {
            return;
        }


        async function performHeroSearch() {

            const query =
                input.value.trim();


            if (!query) {
                return;
            }


            // باز کردن صفحه جستجو
            await loadPage("search");


            // پیدا کردن ورودی صفحه جستجو
            const searchInput =
                document.querySelector(".search-input");


            const searchSubmit =
                document.querySelector(".search-submit");


            if (searchInput) {
                searchInput.value = query;
            }


            if (searchSubmit) {
                searchSubmit.click();
            }

            scrollToDashboard();

        }


        button.addEventListener(
            "click",
            performHeroSearch
        );


        input.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    performHeroSearch();

                }

            }
        );

    });

}
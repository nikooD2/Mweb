/* =========================================================
   QUESTION MODULE
   ========================================================= */

const QuestionModule = (() => {


    function show(
        recordId,
        attachmentId = null
    ) {


        const record =
            SearchModule.getRecordById(
                recordId
            );


        if (!record) {
            return;
        }


        const index =
            SearchModule.getResultIndex(
                recordId
            );


        const previous =
            SearchModule.getAdjacentRecord(
                recordId,
                -1
            );


        const next =
            SearchModule.getAdjacentRecord(
                recordId,
                1
            );


        const content =
            document.getElementById(
                "dynamic-content"
            );


        if (!content) {
            return;
        }


        content.innerHTML = `

            <div class="question-page">

                <!-- BREADCRUMB -->

                <nav
                    class="archive-breadcrumb"
                >

                    <button
                        class="crumb is-link"
                        data-breadcrumb="${SearchModule.getSearchOrigin()}"
                    >
                        ${
                            SearchModule.getSearchOrigin() === "advanced"
                                ? "جستجوی پیشرفته"
                                : "جستجو"
                        }
                    </button>

                    <span class="separator">
                        /
                    </span>

                    <button
                        class="crumb is-link"
                        data-breadcrumb="results"
                    >
                        نتایج
                    </button>

                    <span class="separator">
                        /
                    </span>

                    <span class="crumb current">
                        ${escapeHtml(record.title)}
                    </span>

                </nav>


                <!-- TITLE -->

                <header
                    class="question-header"
                >

                    <h1
                        class="question-title"
                    >

                        ${escapeHtml(
                            record.title
                        )}

                    </h1>

                </header>

<!-- previous  -->
                <!-- QUESTION -->
<!--
                <section
                    class="question-section"
                >

                    <h2  class="question-section-title"> شبهه </h2>

                    <p class="question-section-text">
                        ${escapeHtml(
                            record.question
                        )}
                    </p>

                </section>
-->
<!-- previous  -->
                <!-- ANSWER -->
<!--
                <section
                    class="question-section"
                >

                    <h2
                        class="question-section-title"
                    >
                        پاسخ
                    </h2>


                    <div
                        class="answer-box"
                    >

                        <p
                            class="question-section-text"
                        >

                            ${escapeHtml(
                                record.answer
                            )}

                        </p>

                    </div>

                </section>
-->
<!--new -->
                <div
                        class="answer-box"
                    >

                        <p
                            class="question-section-text"
                        >

                            ${escapeHtml(
                                record.answer
                            )}

                        </p>

                    </div>

                <!-- ATTACHMENTS -->

                <section
                    id="question-attachments"
                    class="question-section"
                >

                    <h2
                        class="question-section-title"
                    >
                        پیوست‌ها
                    </h2>


                    ${
                        record.attachments.length

                        ?

                        `
                        <div
                            class="attachment-list"
                        >

                            ${
                                record
                                    .attachments
                                    .map(
                                        renderAttachment
                                    )
                                    .join("")
                            }

                        </div>
                        `

                        :

                        `
<!-- previous  -->
<!--                        <p  class="question-section-text">
                            برای این پرسش پیوستی
                            ثبت نشده است.
                            </p>
-->
                            <p  class="question-section-text">
                            برای این مطلب پیوستی
                            ثبت نشده است.
                            </p>
                        `
                    }

                </section>


                <!-- SOURCES -->

                <section
                    class="question-section"
                >

                    <h2
                        class="question-section-title"
                    >
                        منابع
                    </h2>


                    ${
                        record.sources.length

                        ?

                        `
                        <ol
                            class="sources-list"
                        >

                            ${
                                record.sources
                                    .map(
                                        source => `
                                            <li>
                                                ${escapeHtml(
                                                    source
                                                )}
                                            </li>
                                        `
                                    )
                                    .join("")
                            }

                        </ol>
                        `

                        :

                        `
                        <p
                            class="question-section-text"
                        >
                            منبعی ثبت نشده است.
                        </p>
                        `
                    }

                </section>


                <!-- PREVIOUS / NEXT -->

                <nav
                    class="question-navigation"
                >


                    <button
                        class="question-nav-btn"

                        ${
                            previous
                            ? ""
                            : "disabled"
                        }

                        data-question-nav="${
                            previous
                            ? previous.id
                            : ""
                        }"
                    >

                        <i
                            class="fa-solid
                                  fa-arrow-right"
                        ></i>
<!-- previous  -->
<!--                        <span>
                            پرسش قبلی
                        </span>
-->
                        <span>
                            قبلی
                        </span>     
                    </button>


                    <span
                        class="question-position"
                    >

                        ${index + 1}

                        از

                        ${SearchModule.getResultCount()}

                    </span>


                    <button
                        class="question-nav-btn"

                        ${
                            next
                            ? ""
                            : "disabled"
                        }

                        data-question-nav="${
                            next
                            ? next.id
                            : ""
                        }"
                    >
<!-- previous  -->
<!--                        <span>
                            پرسش بعدی
                        </span>
-->
                        <span>
                            بعدی
                        </span> 

                        <i
                            class="fa-solid
                                  fa-arrow-left"
                        ></i>

                    </button>


                </nav>


            </div>

        `;


        bindEvents();


        /*
         * اگر کاربر از روی پیوست آمده،
         * برو روی همان پیوست.
         */

        if (attachmentId) {

            scrollToAttachment(
                attachmentId
            );

        }
        else{
            scrollToDashboard();
        }

    }


    /* =====================================================
       ATTACHMENT
       ===================================================== */

    function renderAttachment(
        attachment
    ) {

        return `

            <article
                id="attachment-${escapeHtml(
                    attachment.id
                )}"

                class="attachment-item"
            >

                <div
                    class="attachment-info"
                >

                    <h3
                        class="attachment-title"
                    >

                        ${escapeHtml(
                            attachment.title
                        )}

                    </h3>


                    <p
                        class="attachment-description"
                    >

                        ${escapeHtml(
                            attachment.description
                        )}

                    </p>

                </div>


                <button
                    class="attachment-open"
                    type="button"
                >
                    مشاهده
                </button>

            </article>

        `;

    }


    /* =====================================================
       EVENTS
       ===================================================== */

        function bindEvents() {


            /* =================================================
            BREADCRUMB → SEARCH / ADVANCED
            ================================================= */

            document
                .querySelector(
                    ".question-page [data-breadcrumb]"
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
            BREADCRUMB → RESULTS
            ================================================= */

            document
                .querySelector(
                    ".question-page [data-breadcrumb='results']"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        SearchModule
                            .renderResults();

                    }
                );


            /* =================================================
            PREVIOUS / NEXT
            ================================================= */

            document
                .querySelectorAll(
                    "[data-question-nav]"
                )
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        () => {

                            if (
                                button.disabled
                            ) {
                                return;
                            }


                            const id =
                                button
                                    .dataset
                                    .questionNav;


                            if (id) {

                                show(id);

                                scrollToDashboard();

                            }

                        }
                    );

                });

        }


    /* =====================================================
       SCROLL TO ATTACHMENT
       ===================================================== */

    function scrollToAttachment(
        attachmentId
    ) {

        requestAnimationFrame(() => {


            const target =
                document.getElementById(
                    `attachment-${attachmentId}`
                );


            if (!target) {
                return;
            }


            target.scrollIntoView({

                behavior: "smooth",

                block: "center"

            });


            target.classList.add(
                "highlighted"
            );


            setTimeout(() => {

                target.classList.remove(
                    "highlighted"
                );

            }, 2500);

        });

    }


    /* =====================================================
       ESCAPE
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


    return {
        show
    };


})();


/*
 * تابعی که search.js هم از آن استفاده می‌کند
 */

function showQuestion(
    recordId,
    attachmentId = null
) {

    QuestionModule.show(
        recordId,
        attachmentId
    );

}
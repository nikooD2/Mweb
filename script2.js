/*=====================================
    PASSWORD PROTECTION
=====================================*/

function showProtectedContent() {
    const overlay = document.getElementById("passwordOverlay");
    const mainContent = document.getElementById("mainContent");

    if (overlay) {
        overlay.style.display = "none";
    }

    if (mainContent) {
        mainContent.classList.remove("hidden");
    }
}

function openProtectedPage(event, targetPage) {
    event.preventDefault();

    const correctPassword = "1234";
    const enteredPassword = prompt("لطفاً رمز عبور را وارد کنید:");

    if (enteredPassword === correctPassword) {
        showProtectedContent();
        return true;
    }

    alert("رمز عبور اشتباه است.");
    return false;
}


/*=====================================
    GLOBAL ELEMENTS
=====================================*/

const navbar = document.getElementById("navbar");
const content = document.getElementById("dynamic-content");


/*=====================================
    NAVBAR + BACK TO TOP SCROLL
=====================================*/

const topButton = document.createElement("button");

topButton.innerHTML = "↑";
topButton.className = "back-top";
topButton.setAttribute("aria-label", "بازگشت به بالا");

document.body.appendChild(topButton);

window.addEventListener("scroll", () => {

    /* Navbar */

    if (navbar) {
        navbar.classList.toggle(
            "active",
            window.scrollY > 120
        );
    }


    /* Back To Top */

    topButton.classList.toggle(
        "show",
        window.scrollY > 500
    );

});


topButton.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/*=====================================
    DASHBOARD MENU
=====================================*/

const desktopMenuButtons =
    document.querySelectorAll(".menu-btn");

const mobileMenuButtons =
    document.querySelectorAll(".mobile-menu-btn");


function activateMenuButton(button) {

    if (!button) return;

    const page = button.dataset.page;

    /*
        Active فقط برای منوی مربوطه
    */

    desktopMenuButtons.forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.page === page
        );
    });

    mobileMenuButtons.forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.page === page
        );
    });

    loadPage(page);
}


/*
    Desktop menu
*/

desktopMenuButtons.forEach(button => {

    button.addEventListener("click", () => {
        activateMenuButton(button);
    });

});


/*
    Mobile menu
*/

mobileMenuButtons.forEach(button => {

    button.addEventListener("click", () => {

        activateMenuButton(button);

        closeMobileMenu();

    });

});


/*=====================================
    OPEN DASHBOARD
=====================================*/

function openDashboard(page) {

    const button = document.querySelector(
        `.menu-btn[data-page="${page}"],
         .mobile-menu-btn[data-page="${page}"]`
    );

    if (button) {
        activateMenuButton(button);
    }


    /*
        در موبایل اسکرول داشبورد انجام نشود
    */

    if (window.innerWidth <= 600) {
        return;
    }


    const dashboard =
        document.getElementById("dashboard");

    if (!dashboard) return;


    const headerHeight =
        navbar ? navbar.offsetHeight : 0;


    const top =
        dashboard.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight -
        20;


    window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth"
    });

}


/*=====================================
    LOAD PAGE
=====================================*/

function loadPage(page) {

    switch (page) {

        case "home":

            content.innerHTML = `

<h2>

خانه

</h2>

<p>

به سامانه مصباح خوش آمدید.

</p>

<div class="cards">

<div class="card" onclick="openDashboard('search')">

<h3>

جستجو

</h3>

<p>
موضوع، کلیدواژه یا عبارت مربوط به شبهه را وارد و تنها با یک کلیک بهترین پاسخ برای آن را پیدا کنید.
</p>

</div>

<div class="card" onclick="openDashboard('advanced')">

<h3>

جستجوی پیشرفته

</h3>

<p>
برای پیدا کردن دقیق‌تر مطالب، جستجو را با فیلترهای پیشرفته محدود کنید.
</p>

</div>

<div class="card" onclick="openDashboard('ai')">

<h3>

هوش مصنوعی

</h3>

<p>

هوش مصنوعی مصباح با دریافت متن شبهه، استخراج کلید واژه ها و جستجو در آرشیو را برای شما انجام می دهد

</p>

</div>

<div class="card" onclick="openDashboard('new')">

<h3>

ارسال شبهه جدید

</h3>

<p>

در صورت پیدا نکردن جواب پرسش خود یا تمایل به ارسال شبهه جدید برای ما، از این قسمت با ما در ارتباط باشید
</p>

</div>

</div>
`;

            break;


        /*=============================*/

        case "mobile-home":

            content.innerHTML = `

            <div class="mobile-home">

                <h1>
                    پاسخ به شبهات مذهبی
                </h1>

                <p>
                    جستجو در هزاران سوال، پاسخ و منبع معتبر
                </p>

                <div class="hero-search">

                    <input
                        type="text"
                        placeholder="سوال یا موضوع مورد نظر را وارد کنید..."
                    >

                    <button>
                        جستجو
                    </button>

                </div>

                <div class="hero-links">

                    <a href="#" onclick="openDashboard('advanced')">
                        جستجوی پیشرفته
                    </a>

                    <a href="#" onclick="openDashboard('ai')">
                        هوش مصنوعی
                    </a>

                    <a href="#" onclick="openDashboard('new')">
                        ارسال شبهه جدید
                    </a>

                </div>

            </div>

`;

            break;


        /*=============================*/
        case "search":

            content.innerHTML = `

<h2>

جستجو

</h2>

<div class="hero-search">

<input placeholder="موضوع شبهه را وارد کنید...">

<button>

جستجو

</button>

`;

            break;


        /*=============================*/

        case "advanced":

            content.innerHTML = `

<h2>

جستجوی پیشرفته

</h2>

<div class="cards">

<div class="card">

کلمات کلیدی

</div>

<div class="card">

دسته بندی

</div>

<div class="card">

...

</div>

<div class="card">

...

</div>

</div>

`;

            break;


        /*=============================*/

        //case "ai":

//            content.innerHTML = `

//<h2>

//پرسش از هوش مصنوعی

//</h2>

//<div class="hero-search">

//<input placeholder="سوال خود را بنویسید...">

//<button>

//ارسال

//</button>

//</div>

//<div class="card" style="margin-top:30px;">

//پاسخ هوش مصنوعی اینجا نمایش داده می‌شود.

//</div>

            //break;
//`;
        case "ai":

            content.innerHTML = `
    <div class="ai-layout">

    <aside class="chat-sidebar">

        <button class="new-chat">
            <i class="fa-solid fa-plus"></i>
            چت جدید
        </button>

        <h4>امروز</h4>

        <div class="chat-item active">
            شبهه امامت
        </div>

        <div class="chat-item">
            فلسفه حجاب
        </div>

        <h4>دیروز</h4>

        <div class="chat-item">
            غدیر
        </div>

    </aside>

    <div class="dashboard-page">

    <h2 class="dashboard-title">
        پرسش از هوش مصنوعی
    </h2>

    <div id="ai-chat"></div>

    <div class="dashboard-input">

        <input
            id="aiQuestion"
            type="text"
            placeholder="سوال یا موضوع مورد نظر را وارد کنید..."
        >

        <button class="send-btn" id="sendAI">

            <i class="fa-solid fa-arrow-up"></i>

        </button>

    </div>
</div>


`;

            setTimeout(initAIPage, 0);

            break;


        /*=============================*/

        case "experts":

            content.innerHTML = `

<h2>

پرسش از متخصصان

</h2>

<p>

متخصص مورد نظر خود را انتخاب کنید.

</p>

<div class="cards">

<div class="card">

فقه

</div>

<div class="card">

تاریخ

</div>

<div class="card">

قرآن

</div>

<div class="card">

اخلاق

</div>

</div>

`;

            break;
        /*=============================*/
        case "new":

            content.innerHTML = `

<div class="new-question-page">

    <h2 class="page-title">

        ارسال شبهه جدید

    </h2>

    <div class="form-group">

        <label>

            نوع شبهه را وارد کنید

        </label>

        <select class="form-control">

            <option selected disabled>

                انتخاب کنید...

            </option>

            <option>

                جدید

            </option>

            <option>

                تکراری

            </option>

            <option>

                فراگیر در فضای مجازی

            </option>

        </select>

    </div>


    <div class="form-group">

        <label>

            شبهه مورد نظر را توضیح دهید

        </label>

        <textarea
            class="form-control textarea-lg"
            placeholder="لطفا برای دریافت پاسخ بهتر، شبهه را دقیق و با جزئیات توضیح دهید، در صورت امکان منبعی که از آن شبهه را دریافت کرده‌اید، مخاطبی که قرار است پاسخ مناسب برای او تولید شود و همچنین رده سنی مخاطب را ذکر کنید."
        ></textarea>

    </div>

        <div class="form-group">

    <label>

        در صورت وجود عکس، ویدیو و یا صوت مشاهده شده در فضای مجازی را ارسال کنید

    </label>

    <label class="upload-box">

        <input
            type="file"
            id="uploadFile"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        >

        <i class="fa-solid fa-cloud-arrow-up"></i>

        <h3>

            فایل را اینجا رها کنید

        </h3>

        <p>

            یا برای انتخاب فایل کلیک کنید

        </p>

        <span>

            فرمت‌های مجاز:
            تصویر، ویدیو، صوت

        </span>

    </label>

</div>

    </div>


    <div class="submit-area">

        <button class="submit-question" id="submitQuestion">

            ثبت و ارسال

        </button>

    </div>
    <div class="success-modal" id="successModal">

    <div class="success-box">

        <i class="fa-solid fa-circle-check"></i>

        <h3>

            پیام شما با موفقیت ارسال شد

        </h3>

        <p>

            با تشکر از شما، شبهه ثبت شد.
            پس از بررسی و تولید پاسخ مناسب،
            از طریق بخش اعلان‌ها شما را مطلع خواهیم کرد.

        </p>

        <button id="closeSuccess">

            متوجه شدم

        </button>

    </div>

</div>
</div>

`;
            setTimeout(() => {

                const submit = document.getElementById("submitQuestion");

                const modal = document.getElementById("successModal");

                const close = document.getElementById("closeSuccess");

                submit.onclick = () => {

                    modal.classList.add("show");

                };

                close.onclick = () => {

                    modal.classList.remove("show");

                };

            }, 0);

            break;
        /*================================*/

        case "about":

            content.innerHTML = `

<h2>

آشنایی با سایت

</h2>


<div class="card">

<h3>

درباره ما

</h3>

<p>

...

</p>

</div>


<div class="cards">


<div class="card">

<h3>

همکاری با ما

</h3>

<p>

...

</p>

</div>


<div class="card">

<h3>

ارتباط با ما

</h3>

<p>

...
</p>

</div>


</div>


`;

            break;


        /*=============================*/

        case "library":

            content.innerHTML = `

<h2>

مرور منابع

</h2>


<div class="cards">


<div class="card">

<h3>

سوالات پرتکرار مذهبی

</h3>

<p>

...
</p>

</div>



<div class="card">

<h3>

...

</h3>

<p>

...
</p>

</div>



<!--
<div class="card">

<h3>

پژوهش‌ها

</h3>

<p>

مشاهده تحقیقات و بررسی‌های علمی.

</p>

</div>



<div class="card">

<h3>

سوالات پرتکرار مذهبی

</h3>

<p>
...
</p>

</div>
-->


</div>


`;

            break;
            

        case "trend":

            content.innerHTML = `

<h2>

سوالات روز

</h2>

<div class="cards">


<div class="card">

<h3>
دختری به نام رقیه
</h3>

<p>
در کتب تاریخی اشاره ای به دختری به نام رقیه برای امام حسین علیه السلام نشده است
</p>

</div>

<div class="card">

<h3>

قمه زنی سنت است یا بدعت

</h3>

<p>
...
</p>

`;

            break;


        /*=============================*/
    
        case "upcoming":

            content.innerHTML = `

<h2>

مناسبات پیش رو

</h2>

<div class="cards">


<div class="card">

<h3>
پیاده روی اربعین
</h3>

<p>
از نظر ریاضی امکان رسیدن کاروان اسرا در روز اربعین به کربلا وجود دارد؟
</p>

</div>

<div class="card">

<h3>
پیامبر اکرم شهادت یا رحلت؟
</h3>

<p>
...
</p>

`;

            break;


        /*=============================*/
    }

}


/*=====================================
    INITIAL PAGE
=====================================*/

window.addEventListener("DOMContentLoaded", () => {

    /*
        دسکتاپ → home
        موبایل → mobile-home
    */

    const isMobile = window.innerWidth <= 600;

    const initialPage = isMobile
        ? "mobile-home"
        : "home";


    const initialButton = document.querySelector(
        isMobile
            ? `.mobile-menu-btn[data-page="${initialPage}"]`
            : `.menu-btn[data-page="${initialPage}"]`
    );


    if (initialButton) {
        activateMenuButton(initialButton);
    }


    /* Password */

    const unlockButton =
        document.getElementById("unlockBtn");

    const passwordInput =
        document.getElementById("passwordInput");

    const passwordMessage =
        document.getElementById("passwordMessage");


    if (unlockButton) {

        unlockButton.addEventListener("click", () => {

            if (
                passwordInput &&
                passwordInput.value === "1234"
            ) {

                showProtectedContent();

            } else {

                if (passwordMessage) {
                    passwordMessage.textContent =
                        "رمز عبور اشتباه است.";
                }

            }

        });

    }


    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    unlockButton?.click();

                }

            }
        );

    }

});


/*=====================================
    SCROLL ANIMATION
=====================================*/

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.15
        }
    );


document
    .querySelectorAll(
        ".card, .expert-card, .box"
    )
    .forEach(item => {

        item.style.opacity = "0";

        item.style.transform =
            "translateY(40px)";

        item.style.transition =
            "all .6s ease";

        observer.observe(item);

    });


/*=====================================
    SEARCH ENTER EVENT
=====================================*/

const searchInputs =
    document.querySelectorAll(
        ".hero-search input, .search-small input"
    );


searchInputs.forEach(input => {

    input.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            alert(
                "در نسخه نهایی، نتیجه جستجو نمایش داده می‌شود."
            );

        }

    });

});


/*=====================================
    BUTTON CLICK EFFECT
=====================================*/

/*
    back-top از این افکت مستثنی شده
    تا با hover / show تداخل نداشته باشد.
*/

document
    .querySelectorAll(
        "button:not(.back-top)"
    )
    .forEach(button => {

        button.addEventListener("click", () => {

            button.style.transform =
                "scale(.96)";


            setTimeout(() => {

                button.style.transform = "";

            }, 150);

        });

    });


/*=====================================
    ACTIVE CATEGORY
=====================================*/

const categories =
    document.querySelectorAll(
        ".nav-bottom a"
    );


categories.forEach(category => {

    category.addEventListener("click", () => {

        categories.forEach(item => {
            item.classList.remove("selected");
        });

        category.classList.add("selected");

    });

});


/*=====================================
    AI PAGE
=====================================*/

function initAIPage() {

    const input =
        document.getElementById("aiQuestion");

    const button =
        document.getElementById("sendAI");


    if (!input || !button) return;


    button.addEventListener(
        "click",
        sendQuestion
    );


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendQuestion();

            }

        }
    );

}


function sendQuestion() {

    const input =
        document.getElementById("aiQuestion");

    const chat =
        document.getElementById("ai-chat");

    const aiPage =
        document.querySelector(".ai-page");


    if (!input || !chat || !aiPage) {
        return;
    }


    const question =
        input.value.trim();


    if (!question) return;


    chat.innerHTML = `

        <div class="ai-response">

            <h3>پاسخ هوش مصنوعی</h3>

            <p>
                این یک پاسخ آزمایشی است.
                در فازهای بعدی پاسخ واقعی هوش مصنوعی
                در این قسمت نمایش داده خواهد شد.
            </p>

        </div>

    `;


    aiPage.classList.add("chat-mode");

}


/*=====================================
    MOBILE MENU
=====================================*/

const mobileMenuToggle =
    document.getElementById(
        "mobileMenuToggle"
    );

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );

const mobileMenuClose =
    document.getElementById(
        "mobileMenuClose"
    );

const mobileMenuOverlay =
    document.getElementById(
        "mobileMenuOverlay"
    );


function openMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.add("open");

    mobileMenuOverlay?.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


function closeMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.remove("open");

    mobileMenuOverlay?.classList.remove("show");

    document.body.style.overflow = "";

}


/* Open */

mobileMenuToggle?.addEventListener(
    "click",
    openMobileMenu
);


/* Close */

mobileMenuClose?.addEventListener(
    "click",
    closeMobileMenu
);


/* Overlay */

mobileMenuOverlay?.addEventListener(
    "click",
    closeMobileMenu
);


/*=====================================
    BACK TO TOP STYLE
=====================================*/

const style =
    document.createElement("style");


style.textContent = `

.back-top {
    position: fixed;
    bottom: 30px;
    left: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: #125918;
    color: white;
    font-size: 25px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: .35s;
    z-index: 9999;
    box-shadow: 0 10px 25px rgba(0,0,0,.2);
}

.back-top:hover {
    background: #1E7610;
    transform: translateY(-5px);
}

.back-top.show {
    opacity: 1;
    visibility: visible;
}

`;

document.head.appendChild(style);
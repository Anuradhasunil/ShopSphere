/* =========================================================
   SHOPNOVA HOME PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* ==============================
       CONTACT HUB
    =============================== */

    const contactButton =
        document.getElementById("contactButton");

    const footerContactButton =
        document.getElementById("footerContactButton");

    const closeContact =
        document.getElementById("closeContact");

    const contactPanel =
        document.getElementById("contactPanel");

    const contactOverlay =
        document.getElementById("contactOverlay");


    function openContactPanel() {

        if (!contactPanel || !contactOverlay) {
            return;
        }

        contactPanel.classList.add("show");

        contactOverlay.classList.add("show");

        document.body.style.overflow = "hidden";
    }


    function closeContactPanel() {

        if (!contactPanel || !contactOverlay) {
            return;
        }

        contactPanel.classList.remove("show");

        contactOverlay.classList.remove("show");

        document.body.style.overflow = "";
    }


    if (contactButton) {

        contactButton.addEventListener(
            "click",
            openContactPanel
        );

    }


    if (footerContactButton) {

        footerContactButton.addEventListener(
            "click",
            openContactPanel
        );

    }


    if (closeContact) {

        closeContact.addEventListener(
            "click",
            closeContactPanel
        );

    }


    if (contactOverlay) {

        contactOverlay.addEventListener(
            "click",
            closeContactPanel
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {
                closeContactPanel();
            }

        }
    );


    /* ==============================
       SEARCH
    =============================== */

    const searchForm =
        document.getElementById("searchForm");

    const searchInput =
        document.getElementById("searchInput");


    if (searchForm) {

        searchForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const searchValue =
                    searchInput
                        ? searchInput.value.trim()
                        : "";


                if (!searchValue) {

                    if (searchInput) {
                        searchInput.focus();
                    }

                    return;
                }


                /*
                    Send the search term to
                    products.html.
                */

                window.location.href =
                    "products.html?search=" +
                    encodeURIComponent(searchValue);

            }
        );

    }


    /* ==============================
       IMAGE FALLBACK
    =============================== */

    const heroImages =
        document.querySelectorAll(
            "img"
        );


    heroImages.forEach(
        function (image) {

            image.addEventListener(
                "error",
                function () {

                    image.style.display =
                        "none";

                }
            );

        }
    );


    /* ==============================
       SIMPLE SCROLL ANIMATION
    =============================== */

    const animatedElements =
        document.querySelectorAll(
            ".category-card, .trust-item, .india-content"
        );


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.style.opacity =
                                    "1";

                                entry.target.style.transform =
                                    "translateY(0)";

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        animatedElements.forEach(
            function (element) {

                element.style.opacity =
                    "0";

                element.style.transform =
                    "translateY(20px)";

                element.style.transition =
                    "opacity .6s ease, transform .6s ease";

                observer.observe(
                    element
                );

            }
        );

    }

});
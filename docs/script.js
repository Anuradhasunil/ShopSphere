function setupHomeSearch() {

    const input = document.getElementById("searchInput");
    const button = document.getElementById("searchButton");

    if (!input) {
        return;
    }

    function goToProducts() {

        const text = input.value.trim();

        if (text === "") {
            window.location.href = "products.html";
            return;
        }

        window.location.href =
            "products.html?search=" +
            encodeURIComponent(text);
    }

    if (button) {

        button.addEventListener(
            "click",
            function () {
                goToProducts();
            }
        );

    }

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                goToProducts();

            }

        }
    );

}
function initializeNavbarSearch() {
    const dialog = document.getElementById("navbar-search-dialog");
    const openButton = document.getElementById("navbar-search-open");
    const closeButton = document.getElementById("navbar-search-close");
    const form = document.getElementById("navbar-search-form");
    const input = document.getElementById("navbar-search-input");

    if (!dialog || !openButton || !closeButton || !form || !input || dialog.dataset.initialized) return;
    dialog.dataset.initialized = "true";

    openButton.addEventListener("click", () => {
        dialog.showModal();
        input.focus();
    });

    closeButton.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        const query = input.value.trim();
        if (!query) return;

        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    });
}

const navbarSearchObserver = new MutationObserver(initializeNavbarSearch);
const navbarContainer = document.getElementById("navbar");

if (navbarContainer) {
    navbarSearchObserver.observe(navbarContainer, { childList: true, subtree: true });
    initializeNavbarSearch();
}
export const themeChanger = (ev) => {
    // Установка темы
    if (
        ev.target.tagName === "path" ||
        ev.target.tagName === "svg" ||
        ev.target.dataset.purpose === "themeChanger"
    ) {
        if (localStorage.getItem("theme") !== "dark") {
            document.documentElement.setAttribute("data-bs-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-bs-theme");
            localStorage.removeItem("theme");
        }
    }
};

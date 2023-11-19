export const themeChanger = (ev) => {
    // Установка темы
    if (
        ev.target.tagName === "path" ||
        ev.target.tagName === "svg" ||
        ev.target.dataset.purpose === "themeChanger"
    ) {
        let lsTheme = localStorage.getItem("theme");
        if (lsTheme === "light") {
            localStorage.setItem("theme", "dark");
            document.documentElement.setAttribute("data-bs-theme", "dark");
            return (lsTheme = "dark");
        } else if (lsTheme === "dark") {
            localStorage.setItem("theme", "light");
            document.documentElement.setAttribute("data-bs-theme", "light");
            return (lsTheme = "light");
        }
    }
};

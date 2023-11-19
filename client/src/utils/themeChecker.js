if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-bs-theme", "dark");
} else if (localStorage.getItem("theme") === "light") {
    document.documentElement.setAttribute("data-bs-theme", "light");
}

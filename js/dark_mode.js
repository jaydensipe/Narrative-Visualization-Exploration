import updateDarkModeColor from "./d3_charts/chart_3";

export var darkMode = Boolean(false);

function switchDarkMode() {

    if (darkMode) {
        document.getElementById("dark-mode-toggle-button").innerText = "🌖"
        document.getElementById("body").classList.remove("dark-body");

        let containers = document.getElementsByClassName("container");
        Array.prototype.forEach.call(containers, function (container) {
            container.classList.remove("dark-container");
        });

        let d1 = document.querySelectorAll(".title, .button");
        Array.prototype.forEach.call(d1, function (d) {
            d.classList.remove("dark-purple");
        });

        let d2 = document.querySelectorAll(".title-text, .bottom-title-text");
        Array.prototype.forEach.call(d2, function (d) {
            d.classList.remove("dark-green");
        });

        let d3 = document.querySelectorAll(".sub-text");
        Array.prototype.forEach.call(d3, function (d) {
            d.classList.remove("dark-green-text");
        });

        darkMode = false;
    } else {
        document.getElementById("dark-mode-toggle-button").innerText = "☀️"
        document.getElementById("body").classList.add("dark-body");

        let containers = document.getElementsByClassName("container");
        Array.prototype.forEach.call(containers, function (container) {
            container.classList.add("dark-container");
        });

        let d1 = document.querySelectorAll(".title, .button");
        Array.prototype.forEach.call(d1, function (d) {
            d.classList.add("dark-purple");
        });

        let d2 = document.querySelectorAll(".title-text, .bottom-title-text");
        Array.prototype.forEach.call(d2, function (d) {
            d.classList.add("dark-green");
        });

        let d3 = document.querySelectorAll(".sub-text");
        Array.prototype.forEach.call(d3, function (d) {
            d.classList.add("dark-green-text");
        });

        darkMode = true;
    }

    updateDarkModeColor(darkMode);
}
document.getElementById("dark-mode-toggle-button").addEventListener("click", switchDarkMode);
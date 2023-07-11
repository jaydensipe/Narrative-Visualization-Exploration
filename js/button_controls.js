import { animateChartsOnPage } from "./animation_control";

// Initialize buttons and functions to dswitch between pages
let nextButton = document.getElementById('next-button');
if (nextButton.addEventListener) {
    nextButton.addEventListener('click', buttonGoNext, false);
} else if (nextButton.attachEvent) {
    nextButton.attachEvent('onclick', buttonGoNext);
}

let backButton = document.getElementById('back-button');
if (backButton.addEventListener) {
    backButton.addEventListener('click', buttonGoBack, false);
} else if (backButton.attachEvent) {
    backButton.attachEvent('onclick', buttonGoBack);
}

// Initializes correct input for back button
if (!document.getElementById("page-" + (currentPage - 1))) {
    document.getElementById("back-button").disabled = true;
}

var currentPage = 1;
function buttonGoNext() {
    document.getElementById("page-" + currentPage).style.display = "none";
    document.getElementById("page-" + ++currentPage).style.display = "";

    // Animate the charts
    animateChartsOnPage(currentPage);

    if (!document.getElementById("page-" + (currentPage + 1))) {
        document.getElementById("next-button").disabled = true;
        return;
    }
    else {
        document.getElementById("back-button").disabled = false;
    }
}

function buttonGoBack() {
    document.getElementById("page-" + currentPage).style.display = "none";
    document.getElementById("page-" + --currentPage).style.display = "";

    if (!document.getElementById("page-" + (currentPage - 1))) {
        document.getElementById("back-button").disabled = true;
        return;
    }
    else {
        document.getElementById("next-button").disabled = false;
    }
}

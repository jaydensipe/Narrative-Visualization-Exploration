import { animateChart2 } from "./d3_charts/chart_2";

export function animateChartsOnPage(currentPage) {
    switch (currentPage) {
        case 4:
            animateChart2();
    }
}
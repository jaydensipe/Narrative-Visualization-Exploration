import { animateChart1 } from "./d3_charts/chart_1";
import { animateChart2 } from "./d3_charts/chart_2";
import { animateChart3 } from "./d3_charts/chart_3";

export function animateChartsOnPage(currentPage) {
    switch (currentPage) {
        case 3:
            animateChart1();
            break;
        case 4:
            animateChart2();
            break;
        case 5:
            animateChart3();
            break;
    }
}
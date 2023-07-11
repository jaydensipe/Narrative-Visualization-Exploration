import * as d3 from 'd3';

// Chart 2 D3 Charting
var x = null;
d3.csv("games.csv").then(function (data) {
    data.forEach(function (d) {
        d.rating = +d.rating;
    });

    data.sort(function (a, b) {
        return d3.descending(a.rating, b.rating);
    });

    var top10 = data.slice(0, 10);

    // Set up the SVG and chart dimensions
    var svg = d3.select("#chart-2"),
        margin = { top: 0, right: 10, bottom: 20, left: 250 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    x = d3.scaleLinear().rangeRound([0, width]);
    var y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set the domains for x and y scales
    x.domain([4.5, d3.max(top10, function (d) { return d.rating; })]);
    y.domain(top10.map(function (d) { return d.name; }));

    // Define a color scale for the bars
    var colorScale = d3.scaleDivergingSymlog()
        .domain([0, top10.length])
        .interpolator(d3.interpolateRgb.gamma(2.2)("lightblue", "darkblue"));

    g.selectAll(".bar")
        .data(top10)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", function (d) { return y(d.name); })
        .attr("height", y.bandwidth())
        .attr("fill", function (d, i) { return colorScale(i); })
        .on("click", function (d, i) { openVideoPlayback(i); });

    // Draw the x-axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Draw the y-axis
    g.append("g")
        .call(d3.axisLeft(y));

}).catch(function (error) {
    console.log(error);
});

// Opens video playback in a new tab
function openVideoPlayback(d) {
    let url = null;

    switch (d.id) {
        case "43252":
            url = "https://www.youtube.com/watch?v=UZP1W6D6aZA";
            break;
        case "644661":
            url = "https://www.youtube.com/watch?v=isYEhEMpHfk";
            break;
        case "257255":
            url = "https://www.youtube.com/watch?v=qy8jmm9kY4A";
            break;
        case "10338":
            url = "https://www.youtube.com/watch?v=_6uIFwARWIw";
            break;
        case "339958":
            url = "https://www.youtube.com/watch?v=SKpSpvFCZRw";
            break;
        case "43050":
            url = "https://www.youtube.com/watch?v=MQ2_2Rik3y4";
            break;
        case "662316":
            url = "https://www.youtube.com/watch?v=ZRhJT2nmvA4";
            break;
        case "4167":
            url = "https://www.youtube.com/watch?v=PfHxklxMhA4";
            break;
        case "840783":
            url = "https://www.youtube.com/watch?v=w8vPZrMFiZ4";
            break;
        case "3636":
            url = "https://www.youtube.com/watch?v=WxjeV10H1F0";
            break;
        default:
            url = null;
    }

    if (url == null) return;

    window.open(url, "_blank");
}

export function animateChart2() {
    // Animate the bars
    d3.selectAll(".bar")
        .transition()
        .duration(1000)
        .ease(d3.easeBounceInOut)
        .attr("width", function (d) { return x(d.rating); })
        .delay(function (d, i) { return (i * 100 + (500)); })
}

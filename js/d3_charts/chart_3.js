import * as d3 from 'd3';
import { darkMode } from '../dark_mode';

// Chart 3 D3 Charting
var color;
const width = 350;
const height = 350;
const radius = Math.min(width, height) / 2;

const arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(100);

const pie = d3.pie()
    .value(function (d) { return d.count; }).sort(null);

const svg = d3.select('#chart-3')
    .attr('width', width + 100)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

d3.csv('games.csv').then(function (data) {
    let months = data.map(function (d) {
        let releaseDate = new Date(d.released);
        return releaseDate.getMonth() + 1;
    });

    // Remove NaN values
    months = months.filter(function (month) {
        return !isNaN(month);
    });

    // Count the number of games released in each month
    const counts = {};
    months.forEach(function (month) {
        counts[month] = (counts[month] || 0) + 1;
    });

    const dataset = [];
    for (let month in counts) {
        let monthName = new Date(0, month).toLocaleString('en-US', { month: 'short' });
        dataset.push({ month: monthName, count: counts[month] });
    }

    // Updates color depending on dark mode
    updateChart3DarkMode(darkMode);

    svg.selectAll('arc')
        .data(pie(dataset))
        .enter().append('g')
        .attr('class', 'arc')
        .on('mouseover', function (d, i) {
            countText.attr("font-weight", 700)
                .text(`${i.data.count}`)
                .append('tspan')
                .attr("font-weight", 500)
                .text(' games released.')

        })
        .on('mouseout', function () {
            countText.text('');
        });

    const countText = svg.append('text')
        .attr('class', 'count-text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text('')

}).catch(function (error) {
    console.log(error);
});

export function updateChart3DarkMode(isDarkMode) {
    color = isDarkMode ? d3.scaleOrdinal(d3.schemeDark2) : d3.scaleOrdinal(d3.schemePastel2);
    d3.selectAll('#chart-3 .arc path')
        .style('fill', function (d) { return color(d.data.month); });
}

export function animateChart3() {
    let g = svg.selectAll('#chart-3 .arc');

    g.append('path')
        .attr('d', arc)
        .style('fill', function (d) { return color(d.data.month); })
        .transition()
        .duration(1500)
        .ease(d3.easeBounceInOut)
        .attrTween('d', function (d) {
            let i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function (t) {
                d.endAngle = i(t);
                return arc(d);
            }
        });

    g.append('text')
        .attr('transform', function (d) {
            let centroid = arc.centroid(d);
            let angle = (d.startAngle + d.endAngle) / 2;
            angle = angle * (180 / Math.PI);

            return 'translate(' + centroid[0] + ',' + centroid[1] + ') rotate(' + angle + ')';
        })
        .attr('text-anchor', 'middle')
        .text(function (d) { return d.data.month; })
        .transition()
        .duration(1000);
}
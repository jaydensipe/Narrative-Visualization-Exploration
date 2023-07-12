import * as d3 from 'd3';
import { darkMode } from '../dark_mode';

var g = null;
var arc = null;
var color = null;
var countText = null;

d3.csv('games.csv').then(function (data) {
    var months = data.map(function (d) {
        var releaseDate = new Date(d.released);
        return releaseDate.getMonth() + 1;
    });

    // Remove NaN values
    months = months.filter(function (month) {
        return !isNaN(month);
    });

    // Count the number of games released in each month
    var counts = {};
    months.forEach(function (month) {
        counts[month] = (counts[month] || 0) + 1;
    });

    var dataset = [];
    for (var month in counts) {
        var monthName = new Date(0, month).toLocaleString('en-US', { month: 'short' });
        dataset.push({ month: monthName, count: counts[month] });
    }

    var width = 350;
    var height = 350;
    var radius = Math.min(width, height) / 2;

    // Updates color depending on dark mode
    updateDarkModeColor(darkMode)

    var pie = d3.pie()
        .value(function (d) { return d.count; }).sort(null);

    arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(100);

    var svg = d3.select('#chart-3')
        .attr('width', width + 100)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    g = svg.selectAll('arc')
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

    countText = svg.append('text')
        .attr('class', 'count-text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text('')
}).catch(function (error) {
    console.log(error);
});

export default function updateDarkModeColor(isDarkMode) {
    color = isDarkMode ? d3.scaleOrdinal(d3.schemeDark2) : d3.scaleOrdinal(d3.schemePastel2);
    d3.selectAll('#chart-3 .arc path')
        .style('fill', function (d) { return color(d.data.month); });
}

export function animateChart3() {
    g.append('path')
        .attr('d', arc)
        .style('fill', function (d) { return color(d.data.month); })
        .transition()
        .duration(1500)
        .ease(d3.easeBounceInOut)
        .attrTween('d', function (d) {
            var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function (t) {
                d.endAngle = i(t);
                return arc(d);
            }
        });

    g.append('text')
        .attr('transform', function (d) {
            var centroid = arc.centroid(d);
            var angle = (d.startAngle + d.endAngle) / 2;
            angle = angle * (180 / Math.PI);

            return 'translate(' + centroid[0] + ',' + centroid[1] + ') rotate(' + angle + ')';
        })
        .attr('text-anchor', 'middle')
        .text(function (d) { return d.data.month; })
        .transition()
        .duration(1000);
}
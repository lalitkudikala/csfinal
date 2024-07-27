function loadScene1() {
    d3.csv("life_expectancy.csv").then(function(data) {
        data.forEach(d => {
            d.Year = +d.Year;
            d.Life_Expectancy = +d.Life_Expectancy;
        });

        var svg = d3.select("#scene-container").append("svg").attr("width", 800).attr("height", 400);
        var margin = {top: 50, right: 50, bottom: 50, left: 50};
        var width = 800 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var x = d3.scaleLinear().domain([2010, 2019]).range([0, width]);
        var y = d3.scaleLinear().domain([60, 80]).range([height, 0]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        var line = d3.line().x(d => x(d.Year)).y(d => y(d.Life_Expectancy));
        var countries = [...new Set(data.map(d => d.Country))];

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        g.append("g")
            .call(d3.axisLeft(y));

        countries.forEach(country => {
            var countryData = data.filter(d => d.Country === country);

            g.append("path").datum(countryData).attr("fill", "none").attr("stroke", color(country)).attr("stroke-width", 1.5).attr("d", line);

            g.selectAll(`.dot-${country.replace(/ /g, '-')}`).data(countryData).enter().append("circle").attr("class", `dot-${country.replace(/ /g, '-')}`)
                .attr("cx", d => x(d.Year)).attr("cy", d => y(d.Life_Expectancy)).attr("r", 5).attr("fill", color(country))
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("r", 8);
                    d3.select("#tooltip").style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 10) + "px").style("display", "inline-block")
                        .html(`Country: ${d.Country}<br>Year: ${d.Year}<br>Life Expectancy: ${d.Life_Expectancy}`);
                })
                .on("mouseout", function() {
                    d3.select(this).attr("r", 5);
                    d3.select("#tooltip").style("display", "none");
                });
        });

        g.append("text").attr("x", width / 2).attr("y", -10).attr("text-anchor", "middle").attr("class", "annotation").text("Life Expectancy Over Time");
    });

    d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("text-align", "center").style("width", "120px").style("height", "50px").style("padding", "2px")
        .style("font", "12px sans-serif").style("background", "lightsteelblue").style("border", "0px").style("border-radius", "8px").style("pointer-events", "none").style("display", "none");
}

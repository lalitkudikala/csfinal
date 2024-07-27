function loadScene1() {
    d3.csv("life_expectancy.csv").then(function(data) {
        data.forEach(d => {
            d.Year = +d.Year;
            d.Life_Expectancy = +d.Life_Expectancy;
        });

        var svg = d3.select("#scene1-container").append("svg").attr("width", 800).attr("height", 400);

        var x = d3.scaleLinear().domain([2010, 2019]).range([50, 750]);
        var y = d3.scaleLinear().domain([60, 80]).range([350, 50]);

        var line = d3.line().x(d => x(d.Year)).y(d => y(d.Life_Expectancy));
        var countries = [...new Set(data.map(d => d.Country))];

        countries.forEach(country => {
            var countryData = data.filter(d => d.Country === country);

            svg.append("path").datum(countryData).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 1.5).attr("d", line);

            svg.selectAll(".dot").data(countryData).enter().append("circle").attr("class", "dot").attr("cx", d => x(d.Year)).attr("cy", d => y(d.Life_Expectancy)).attr("r", 5)
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

        svg.append("text").attr("x", 400).attr("y", 30).attr("text-anchor", "middle").attr("class", "annotation").text("Life Expectancy Over Time");

        d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("text-align", "center").style("width", "120px").style("height", "50px").style("padding", "2px")
            .style("font", "12px sans-serif").style("background", "lightsteelblue").style("border", "0px").style("border-radius", "8px").style("pointer-events", "none").style("display", "none");
    });
}

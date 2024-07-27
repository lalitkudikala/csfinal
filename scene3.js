function loadScene3() {
    d3.csv("mortality_rates.csv").then(function(data) {
        data.forEach(d => {
            d.Year = +d.Year;
            d.Deaths = +d.Deaths;
        });

        var svg = d3.select("#scene3-container").append("svg").attr("width", 800).attr("height", 400);

        var causes = [...new Set(data.map(d => d.Cause))];
        var nestedData = d3.nest()
            .key(d => d.Country)
            .key(d => d.Cause)
            .rollup(leaves => d3.sum(leaves, d => d.Deaths))
            .entries(data);

        var color = d3.scaleOrdinal(d3.schemeCategory10).domain(causes);
        var x = d3.scaleBand().domain(nestedData.map(d => d.key)).range([50, 750]).padding(0.1);
        var y = d3.scaleLinear().domain([0, d3.max(nestedData, d => d3.sum(d.values, v => v.value))]).range([350, 50]);

        svg.selectAll(".bar").data(nestedData).enter().append("g").attr("transform", d => `translate(${x(d.key)},0)`)
            .each(function(d) {
                var bars = d3.select(this).selectAll(".bar").data(d.values).enter().append("rect").attr("class", "bar")
                    .attr("x", d => x.bandwidth() / causes.length * causes.indexOf(d.key)).attr("y", d => y(d.value))
                    .attr("width", x.bandwidth() / causes.length).attr("height", d => 350 - y(d.value)).attr("fill", d => color(d.key))
                    .on("mouseover", function(event, d) {
                        d3.select(this).attr("fill", "orange");
                        d3.select("#tooltip").style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 10) + "px").style("display", "inline-block")
                            .html(`Country: ${d.key}<br>Cause: ${d.key}<br>Deaths: ${d.value}`);
                    })
                    .on("mouseout", function() {
                        d3.select(this).attr("fill", d => color(d.key));
                        d3.select("#tooltip").style("display", "none");
                    });
            });

        svg.append("text").attr("x", 400).attr("y", 30).attr("text-anchor", "middle").attr("class", "annotation").text("Mortality Rates by Cause of Death (2010)");

        d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("text-align", "center").style("width", "120px").style("height", "50px").style("padding", "2px")
            .style("font", "12px sans-serif").style("background", "lightsteelblue").style("border", "0px").style("border-radius", "8px").style("pointer-events", "none").style("display", "none");
    });
}

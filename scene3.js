function loadScene3() {
    d3.csv("mortality_rates.csv").then(function(data) {
        data.forEach(d => {
            d.Year = +d.Year;
            d.Deaths = +d.Deaths;
        });

        var svg = d3.select("#scene-container").append("svg").attr("width", 800).attr("height", 400);
        var margin = {top: 50, right: 50, bottom: 50, left: 50};
        var width = 800 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var causes = [...new Set(data.map(d => d.Cause))];
        var nestedData = d3.nest()
            .key(d => d.Country)
            .key(d => d.Cause)
            .rollup(leaves => d3.sum(leaves, d => d.Deaths))
            .entries(data);

        var color = d3.scaleOrdinal(d3.schemeCategory10).domain(causes);
        var x = d3.scaleBand().domain(nestedData.map(d => d.key)).range([0, width]).padding(0.1);
        var y = d3.scaleLinear().domain([0, d3.max(nestedData, d => d3.sum(d.values, v => v.value))]).range([height, 0]);

        var g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));

        nestedData.forEach(country => {
            var countryGroup = g.append("g").attr("transform", `translate(${x(country.key)},0)`);

            country.values.forEach((d, i) => {
                countryGroup.append("rect")
                    .attr("x", i * (x.bandwidth() / causes.length))
                    .attr("y", y(d.value))
                    .attr("width", x.bandwidth() / causes.length)
                    .attr("height", height - y(d.value))
                    .attr("fill", color(d.key))
                    .on("mouseover", function(event, d) {
                        d3.select(this).attr("fill", "orange");
                        d3.select("#tooltip").style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 10) + "px").style("display", "inline-block")
                            .html(`Country: ${country.key}<br>Cause: ${d.key}<br>Deaths: ${d.value}`);
                    })
                    .on("mouseout", function() {
                        d3.select(this).attr("fill", color(d.key));
                        d3.select("#tooltip").style("display", "none");
                    });
            });
        });

        g.append("text").attr("x", width / 2).attr("y", -10).attr("text-anchor", "middle").attr("class", "annotation").text("Mortality Rates by Cause of Death (2010)");
    });

    d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("text-align", "center").style("width", "120px").style("height", "50px").style("padding", "2px")
        .style("font", "12px sans-serif").style("background", "lightsteelblue").style("border", "0px").style("border-radius", "8px").style("pointer-events", "none").style("display", "none");
}

function loadScene2() {
    d3.csv("healthcare_expenditure.csv").then(function(data) {
        data.forEach(d => {
            d.Year = +d.Year;
            d.Expenditure_Percentage_GDP = +d.Expenditure_Percentage_GDP;
        });

        var svg = d3.select("#scene-container").append("svg").attr("width", 1000).attr("height", 500); // Increased width to accommodate legend
        var margin = {top: 50, right: 150, bottom: 50, left: 50}; // Increased right margin for legend
        var width = 800 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var x = d3.scaleBand().domain(data.map(d => d.Country)).range([0, width]).padding(0.1);
        var y = d3.scaleLinear().domain([0, 20]).range([height, 0]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));

        var nestedData = d3.group(data, d => d.Country);

        nestedData.forEach((values, key) => {
            var barGroup = g.selectAll(`.bar-${key.replace(/ /g, '-')}`)
                .data(values)
                .enter()
                .append("rect")
                .attr("class", `bar-${key.replace(/ /g, '-')}`)
                .attr("x", d => x(d.Country))
                .attr("y", d => y(d.Expenditure_Percentage_GDP))
                .attr("width", x.bandwidth() / values.length)
                .attr("height", d => height - y(d.Expenditure_Percentage_GDP))
                .attr("fill", color(key))
                .attr("transform", (d, i) => `translate(${i * (x.bandwidth() / values.length)}, 0)`)
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("fill", "orange");
                    d3.select("#tooltip").style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 10) + "px").style("display", "inline-block")
                        .html(`Country: ${d.Country}<br>Year: ${d.Year}<br>Expenditure: ${d.Expenditure_Percentage_GDP}%`);
                })
                .on("mouseout", function() {
                    d3.select(this).attr("fill", color(key));
                    d3.select("#tooltip").style("display", "none");
                });
        });

        // Add legend
        var legend = svg.append("g")
            .attr("transform", `translate(${width + margin.right / 2}, ${margin.top})`);

        nestedData.forEach((values, key, i) => {
            legend.append("rect")
                .attr("x", 0)
                .attr("y", i * 20)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", color(key));

            legend.append("text")
                .attr("x", 20)
                .attr("y", i * 20 + 10)
                .text(key);
        });

        g.append("text").attr("x", width / 2).attr("y", -10).attr("text-anchor", "middle").attr("class", "annotation").text("Healthcare Expenditure by Country (All Years)");
    });

    d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("text-align", "center").style("width", "120px").style("height", "50px").style("padding", "2px")
        .style("font", "12px sans-serif").style("background", "lightsteelblue").style("border", "0px").style("border-radius", "8px").style("pointer-events", "none").style("display", "none");
}

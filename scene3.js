function loadScene3() {
    d3.csv("healthcare_categories.csv").then(function(data) {
        data.forEach(d => {
            d.Expenditure_Percentage = +d.Expenditure_Percentage;
        });

        var svg = d3.select("#scene-container").append("svg").attr("width", 1000).attr("height", 500);
        var margin = {top: 50, right: 50, bottom: 50, left: 50};
        var width = 800 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var pie = d3.pie().value(d => d.Expenditure_Percentage);
        var arc = d3.arc().outerRadius(100).innerRadius(0);

        var countries = ["USA", "China", "India"];
        var countryData = {};
        countries.forEach(country => {
            countryData[country] = data.filter(d => d.Country === country);
        });

        countries.forEach((country, i) => {
            var g = svg.append("g")
                .attr("transform", `translate(${margin.left + i * 250 + 150}, ${height / 2})`);

            var arcs = g.selectAll(".arc")
                .data(pie(countryData[country]))
                .enter().append("g")
                .attr("class", "arc");

            arcs.append("path")
                .attr("d", arc)
                .attr("fill", d => color(d.data.Category))
                .on("mouseover", function(event, d) {
                    d3.select("#tooltip").style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 10) + "px").style("display", "inline-block")
                        .html(`Country: ${d.data.Country}<br>Category: ${d.data.Category}<br>Expenditure: ${d.data.Expenditure_Percentage}%`);
                })
                .on("mouseout", function() {
                    d3.select("#tooltip").style("display", "none");
                });

            // Add labels
            arcs.append("text")
                .attr("transform", d => `translate(${arc.centroid(d)})`)
                .attr("dy", ".35em")
                .text(d => `${d.data.Expenditure_Percentage}%`);

            // Add country title
            g.append("text")
                .attr("x", 0)
                .attr("y", -120)
                .attr("text-anchor", "middle")
                .attr("class", "annotation")
                .text(country);
        });

        // Add title
        svg.append("text").attr("x", width / 2).attr("y", 20).attr("text-anchor", "middle").attr("class", "annotation").text("Healthcare Expenditure Categories by Country");

        // Add description below the graph
        d3.select("#scene-container").append("div")
            .attr("class", "paragraph")
            .style("width", "800px")
            .style("margin-top", "20px")
            .html("<p>This chart displays the breakdown of healthcare expenditure into categories for the USA, China, and India. It highlights the distribution of spending across hospital care, physician services, prescription drugs, and other health spending, showcasing the differences in healthcare priorities and investments among these countries.</p>");
    });

    d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("text-align", "center").style("width", "120px").style("height", "50px").style("padding", "2px")
        .style("font", "12px sans-serif").style("background", "lightsteelblue").style("border", "0px").style("border-radius", "8px").style("pointer-events", "none").style("display", "none");
}

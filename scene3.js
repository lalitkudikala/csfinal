function loadScene3() {
    d3.csv("healthcare_categories.csv").then(function(data) {
        console.log("Data loaded:", data); // Debugging statement
        data.forEach(d => {
            d.Expenditure = +d.Expenditure;
        });

        var svg = d3.select("#scene-container").append("svg").attr("width", 1000).attr("height", 500);
        var margin = {top: 50, right: 150, bottom: 50, left: 50};
        var width = 800 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var pie = d3.pie().value(d => d.Expenditure);
        var arc = d3.arc().outerRadius(100).innerRadius(0);

        var countries = ["USA", "India", "China"];
        var countryData = {};
        countries.forEach(country => {
            countryData[country] = data.filter(d => d.Country === country);
        });

        countries.forEach((country, i) => {
            console.log("Processing country:", country); // Debugging statement
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
                        .html(`Country: ${d.data.Country}<br>Category: ${d.data.Category}<br>Expenditure: ${d.data.Expenditure}%`);
                })
                .on("mouseout", function() {
                    d3.select("#tooltip").style("display", "none");
                });

            // Add labels
            arcs.append("text")
                .attr("transform", d => `translate(${arc.centroid(d)})`)
                .attr("dy", ".35em")
                .text(d => `${d.data.Expenditure}%`);

            // Add country title
            g.append("text")
                .attr("x", 0)
                .attr("y", -120)
                .attr("text-anchor", "middle")
                .attr("class", "annotation")
                .text(country);
        });

        // Add legend
        var legend = svg.append("g")
            .attr("transform", `translate(${width + margin.right}, ${margin.top})`);

        color.domain().forEach((category, i) => {
            legend.append("rect")
                .attr("x", 0)
                .attr("y", i * 20)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", color(category));

            legend.append("text")
                .attr("x", 20)
                .attr("y", i * 20 + 10)
                .text(category);
        });
    }).catch(function(error) {
        console.error("Error loading the data:", error);
    });

    d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("text-align", "center").style("width", "120px").style("height", "50px").style("padding", "2px")
        .style("font", "12px sans-serif").style("background", "lightsteelblue").style("border", "0px").style("border-radius", "8px").style("pointer-events", "none").style("display", "none");
}

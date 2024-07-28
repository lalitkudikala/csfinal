function loadScene3() {
    d3.csv("healthcare_categories.csv").then(function(data) {
        console.log("Data loaded:", data); // Debugging statement
        data.forEach(d => {
            d.Expenditure = +d.Expenditure;
        });

        var svg = d3.select("#scene-container").append("svg").attr("width", 1200).attr("height", 500);
        var margin = {top: 50, right: 200, bottom: 50, left: 50};
        var width = 1000 - margin.left - margin.right;
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
                .attr("transform", `translate(${margin.left + i * 300 + 150}, ${height / 2})`);

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
            .attr("transform", `translate(${width + 300}, ${margin.top})`); // Moved legend to the right

        var categories = Array.from(new Set(data.map(d => d.Category)));
        categories.forEach((category, i) => {
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

        // Add description below the graph
        d3.select("#scene-container").append("div")
            .attr("class", "paragraph")
            .style("width", "1000px")
            .style("margin-top", "20px")
            .html("<p>These pie charts illustrate the distribution of healthcare expenditure categories for the USA, India, and China. The USA spends a significant portion on 'Other Health Spending', reflecting a diverse allocation of healthcare resources. India has a high percentage allocated to 'Hospital Care', indicating a focus on hospital infrastructure. China shows a balanced distribution among the categories, with significant expenditure in 'Hospital Care' and 'Prescription Drugs'. This distribution reflects the different healthcare priorities and economic structures of each country.</p>");
    }).catch(function(error) {
        console.error("Error loading the data:", error);
    });

    d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("text-align", "center").style("width", "120px").style("height", "50px").style("padding", "2px")
        .style("font", "12px sans-serif").style("background", "lightsteelblue").style("border", "0px").style("border-radius", "8px").style("pointer-events", "none").style("display", "none");
}

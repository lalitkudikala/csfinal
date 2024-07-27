function loadScene1() {
    d3.csv("life_expectancy.csv").then(function(data) {
        data.forEach(d => {
            d.Year = +d.Year;
            d.Life_Expectancy = +d.Life_Expectancy;
        });

        var svg = d3.select("#scene-container").append("svg").attr("width", 1000).attr("height", 500); // Increased width to accommodate legend
        var margin = {top: 50, right: 150, bottom: 50, left: 50}; // Increased right margin for legend
        var width = 800 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var x = d3.scaleLinear().domain(d3.extent(data, d => d.Year)).range([0, width]);
        var y = d3.scaleLinear().domain([d3.min(data, d => d.Life_Expectancy) - 5, d3.max(data, d => d.Life_Expectancy) + 5]).range([height, 0]);

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

        // Add legend
        var legend = svg.append("g")
            .attr("transform", `translate(${width + margin.right / 2}, ${margin.top})`);

        countries.forEach((country, i) => {
            legend.append("rect")
                .attr("x", 0)
                .attr("y", i * 20)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", color(country));

            legend.append("text")
                .attr("x", 20)
                .attr("y", i * 20 + 10)
                .text(country);
        });

        g.append("text").attr("x", width / 2).attr("y", -10).attr("text-anchor", "middle").attr("class", "annotation").text("Life Expectancy Over Time");

        // Add paragraph explaining trends
        d3.select("#scene-container").append("div")
            .attr("class", "paragraph")
            .style("width", "800px")
            .style("margin-top", "20px")
            .html("<p>This chart shows the life expectancy trends over time for various countries. It highlights the differences in life expectancy across countries and how it has changed from 2000 to 2022. As you can see all countries have had a gradual growth in life expectancy over the years due to medical advancements. The one anomaly shown is the drastic decrease from 2020 to 2021 caused by the coronavirus. However, the life expectancy rates went back up in 2022 due to the release of vaccines causing fewer deaths. It is important to note that since China had a strict lockdown during the pandemic, their life expectancy rates were not affected where as the USA and India had more laid-back lockdown rules causing far more deaths. Another observation can be made by looking at the growth rates for the countries’ life expectancies. India's rapid increase in life expectancy is largely due to its recent economic growth and significant improvements in healthcare infrastructure. In contrast, the USA and China have already achieved substantial advancements in medical innovation and public health, leading to more stabilized and slower growth rates in life expectancy. While India's growth highlights the benefits of emerging economic strength, the USA and China reflect the challenges of extending life expectancy in already advanced healthcare systems. </p>");
    });

    d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("text-align", "center").style("width", "120px").style("height", "50px").style("padding", "2px")
        .style("font", "12px sans-serif").style("background", "lightsteelblue").style("border", "0px").style("border-radius", "8px").style("pointer-events", "none").style("display", "none");
}

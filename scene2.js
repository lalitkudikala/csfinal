function loadScene2() {
    d3.csv("healthcare_expenditure.csv").then(function(data) {
        data.forEach(d => {
            d.Year = +d.Year;
            d.Healthcare_Expenditure_Percentage_GDP = +d.Healthcare_Expenditure_Percentage_GDP;
        });

        var svg = d3.select("#scene-container").append("svg").attr("width", 1000).attr("height", 500); // Increased width to accommodate legend
        var margin = {top: 50, right: 150, bottom: 50, left: 50}; // Increased right margin for legend
        var width = 800 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var x = d3.scaleBand().domain(data.map(d => d.Country)).range([0, width]).padding(0.1);
        var y = d3.scaleLinear().domain([0, d3.max(data, d => d.Healthcare_Expenditure_Percentage_GDP) + 5]).range([height, 0]);

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
                .attr("y", d => y(d.Healthcare_Expenditure_Percentage_GDP))
                .attr("width", x.bandwidth() / values.length)
                .attr("height", d => height - y(d.Healthcare_Expenditure_Percentage_GDP))
                .attr("fill", color(key))
                .attr("transform", (d, i) => `translate(${i * (x.bandwidth() / values.length)}, 0)`)
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("fill", "orange");
                    d3.select("#tooltip").style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 10) + "px").style("display", "inline-block")
                        .html(`Country: ${d.Country}<br>Year: ${d.Year}<br>Expenditure: ${d.Healthcare_Expenditure_Percentage_GDP}%`);
                })
                .on("mouseout", function() {
                    d3.select(this).attr("fill", color(key));
                    d3.select("#tooltip").style("display", "none");
                });
        });

        
        d3.select("#scene-container").append("div")
            .attr("class", "paragraph")
            .style("width", "800px")
            .style("margin-top", "20px")
            .html("<p>This graph illustrates healthcare expenditure as a percentage of GDP from 2000 to 2021 for India, China, and the USA. The USA shows consistently high expenditure, peaking significantly in 2020 due to extra research spent on fighting the coronavirus. The constant increased expenditure is due to a multitude of causes such high insurance rates, retail prescription drugs, and salaries. There is also the problem of the notorious bad diets in the USA that are the cause of many health issues such as obesity. On the other hand, China displays steady growth in healthcare spending, reflecting its expanding economy and improvements in healthcare. India's expenditure shows slight fluctuations but remains lower compared to the other two countries, indicating different priorities or levels of investment in healthcare. This conflicts with the idea of their high rate of growth in life expectancy, however, it tells us about the country's efficient processes and ability to grow even with proportionally smaller budgets.</p>");

        g.append("text").attr("x", width / 2).attr("y", -10).attr("text-anchor", "middle").attr("class", "annotation").text("Healthcare Expenditure by Country (2000-2021)");
    });

    d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("text-align", "center").style("width", "120px").style("height", "50px").style("padding", "2px")
        .style("font", "12px sans-serif").style("background", "lightsteelblue").style("border", "0px").style("border-radius", "8px").style("pointer-events", "none").style("display", "none");
}

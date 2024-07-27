function loadScene2() {
    d3.csv("healthcare_expenditure.csv").then(function(data) {
        data.forEach(d => {
            d.Year = +d.Year;
            d.Expenditure_Percentage_GDP = +d.Expenditure_Percentage_GDP;
        });

        var svg = d3.select("#scene-container").append("svg").attr("width", 800).attr("height", 400);
        var margin = {top: 50, right: 50, bottom: 50, left: 50};
        var width = 800 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var x = d3.scaleBand().domain(data.map(d => d.Country)).range([0, width]).padding(0.1);
        var y = d3.scaleLinear().domain([0, 20]).range([height, 0]);

        var g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));

        g.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar").attr("x", d => x(d.Country)).attr("y", d => y(d.Expenditure_Percentage_GDP))
            .attr("width", x.bandwidth()).attr("height", d => height - y(d.Expenditure_Percentage_GDP)).attr("fill", "steelblue")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "orange");
                d3.select("#tooltip").style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 10) + "px").style("display", "inline-block")
                    .html(`Country: ${d.Country}<br>Expenditure: ${d.Expenditure_Percentage_GDP}%`);
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "steelblue");
                d3.select("#tooltip").style("display", "none");
            });

        g.append("text").attr("x", width / 2).attr("y", -10).attr("text-anchor", "middle").attr("class", "annotation").text("Current Healthcare Expenditure (% of GDP)");
    });

    d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("text-align", "center").style("width", "120px").style("height", "50px").style("padding", "2px")
        .style("font", "12px sans-serif").style("background", "lightsteelblue").style("border", "0px").style("border-radius", "8px").style("pointer-events", "none").style("display", "none");
}

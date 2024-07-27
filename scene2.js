function loadScene2() {
    d3.csv("healthcare_expenditure.csv").then(function(data) {
        data.forEach(d => {
            d.Year = +d.Year;
            d.Expenditure_Percentage_GDP = +d.Expenditure_Percentage_GDP;
        });

        var svg = d3.select("#scene2-container").append("svg").attr("width", 800).attr("height", 400);

        var selectedYear = 2019;
        var yearData = data.filter(d => d.Year === selectedYear);

        var x = d3.scaleBand().domain(yearData.map(d => d.Country)).range([50, 750]).padding(0.1);
        var y = d3.scaleLinear().domain([0, 20]).range([350, 50]);

        svg.selectAll(".bar").data(yearData).enter().append("rect").attr("class", "bar").attr("x", d => x(d.Country)).attr("y", d => y(d.Expenditure_Percentage_GDP))
            .attr("width", x.bandwidth()).attr("height", d => 350 - y(d.Expenditure_Percentage_GDP)).attr("fill", "steelblue")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "orange");
                d3.select("#tooltip").style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 10) + "px").style("display", "inline-block")
                    .html(`Country: ${d.Country}<br>Expenditure: ${d.Expenditure_Percentage_GDP}%`);
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "steelblue");
                d3.select("#tooltip").style("display", "none");
            });

        svg.append("text").attr("x", 400).attr("y", 30).attr("text-anchor", "middle").attr("class", "annotation").text("Healthcare Expenditure by Country (2019)");

        d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("text-align", "center").style("width", "120px").style("height", "50px").style("padding", "2px")
            .style("font", "12px sans-serif").style("background", "lightsteelblue").style("border", "0px").style("border-radius", "8px").style("pointer-events", "none").style("display", "none");
    });
}

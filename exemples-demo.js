function makeDemo() {
    d3.csv("popular_cities_weather.csv").then(function (data) {

        data = data.filter(function (d) {
            return d["city"] == "Mumbai";

        });

        data.forEach(function (d) {
            d["tavg"] = +d["tavg"];
            var date = new Date(d["date"]);
            d["mois"] = date.getMonth() + 1;
            var date2 = new Date(d["date"]);
            d["year"] = date2.getFullYear();
        });

        var pxX = 1000, pxY = 500;
        var svg = d3.select("svg");

        var scX = d3.scaleLinear()
            .domain(d3.extent(data, d => d["mois"]))
            .range([1, pxX - 10]);
        var scY = d3.scaleLinear()
            .domain(d3.extent(data, d => d["tavg"]))
            .range([pxY + 10, 0]);

        const customColors = {
            2020: "#8f1e91",
            2021: "#584add",
            2022: "#35c47c",
            2023: "#d6d43c",
            2024: "#db7535",
            2025: "#e53838",
        };

        const lineMaker = d3.line()
            .x(d => scX(d["mois"]))
            .y(d => scY(d["tavg"]));

        const dataByYear = d3.group(data, d => d["year"]);
        console.log(dataByYear);

        // Tracer les lignes
        svg.selectAll("path.year-line")
            .data(dataByYear)
            .enter()
            .append("path")
            .attr("class", "year-line")
            .attr("fill", "none")
            .attr("stroke", ([year, points]) => customColors[year]) // Couleur basée sur l'année
            .attr("stroke-width", 2)
            .attr("d", ([year, points]) => lineMaker(points.sort((a, b) => a["mois"] - b["mois"]))); // Trie par mois

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("fill", d => customColors[d["year"]])
            .attr("cx", d => scX(d["mois"]))
            .attr("cy", d => scY(d["tavg"]))


        svg.append("g")
            .attr("transform", "translate(,0" + pxY + ")")
            .call(d3.axisRight(scY));

        svg.append("g")
            .attr("transform", "translate(,0" + pxX + ")")
            .call(d3.axisBottom(scX));


    });
}
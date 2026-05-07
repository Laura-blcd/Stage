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

function makeList() {
    var d1 = [8, 2, 4, 2, 9, 4, 1, 7, 5, 1, 9, 2];
    var d2 = [0, 4, 2, 1, 4, 3, 4, 2, 6, 9, 5, 8];

    var n = d1.length, mx = d3.max(d3.merge([d1, d2]));
    var svg = d3.select("#stagger");

    var scX = d3.scaleLinear().domain([0, n]).range([50, 540]);
    var scY = d3.scaleLinear().domain([0, mx]).range([250, 50]);

    svg.selectAll("line")
        .data(d1)
        .enter()
        .append("line")
        .attr("stroke", "red").attr("stroke-width", 20)
        .attr("x1", (d, i) => scX(i)).attr("y1", scY(0))
        .attr("x2", (d, i) => scX(i)).attr("y2", d => scY(d))

    svg.on("click", function () {
        [d1, d2] = [d2, d1];

        svg.selectAll("line").data(d1).transition().duration(1000).delay((d, i) => 200 * i).attr("y2", d => scY(d));
    })

}
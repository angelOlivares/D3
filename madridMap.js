//Graph 1. - Precio Medio del Alquiler Segun Barrio
d3.json('practica_airbnb.json')
    .then((featureCollection) => {
        drawMap(featureCollection);
    });

function drawMap(featureCollection) {
    var width = 900;
    var height = 1100;

    var svg = d3.select('#madridMap')
        .append('svg')
        .style("background-color", "lightgrey")
        .attr('width', width)
        .attr('height', height)
        .append('g');

    var tooltip = d3
        .select("div")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute") 
        .style("pointer-events", "none") 
        .style("visibility", "hidden")
        .style("background-color", "#93CAAE");

    var center = d3.geoCentroid(featureCollection); 

    var projection = d3.geoMercator()
        .fitSize([width, height], featureCollection)
        .scale(130000)
        .center(center) 
        .translate([width / 2, height / 2]) 

    var pathProjection = d3.geoPath().projection(projection);
    var features = featureCollection.features;
   

    var createdPath = svg.selectAll('path')
        .data(features)
        .enter()
        .append('path')
        .attr('d', (d) => pathProjection(d))
        .attr("opacity", function (d, i) {
            d.opacity = 1
            return d.opacity
        })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
    
        //Graph 2. - Precio Medio del Alquiler Segun Barrio

    createdPath.on('click', function (event, d) {
        d3.select("#bChart").selectAll("svg").remove();
        var selectedBarrio = d.properties.avgbedrooms
        var height = 500;
        var width = 500;
        var marginbottom = 100;
        var margintop = 50;

        let secondTitle = d3.select("#grafico2").select("div")
            .html("<h1>Graph. 2: Total de Propiedades Segun Numero de Habitaciones del Barrio: " + d.properties.name + "</h1>");

        secondTitle.
            style("font-size", 20);

        var svg = d3.select('#bChart')
            .append('svg')
            .attr('width', width + 200)
            .attr('height', height + marginbottom + margintop)
            .append("g")
            .attr("transform", "translate(" + 100 + "," + margintop + ")");

        var xscale = d3.scaleBand()
            .domain(selectedBarrio.map(function (d) {
                return d.bedrooms;
            }))
            .range([0, width])
            .padding(0.1);

        var yscale = d3.scaleLinear()
            .domain([0, d3.max(selectedBarrio, function (d) {
                return d.total;
            })])
            .range([height, 0]);

        var xaxis = d3.axisBottom(xscale);

        var rect = svg
            .selectAll('rect')
            .data(selectedBarrio)
            .enter()
            .append('rect')
            .attr("fill", "#93CAAE");


        rect
            .attr("x", function (d) {
                return xscale(d.bedrooms);
            })
            .attr('y', d => {
                return yscale(0)
            })
            .attr("width", xscale.bandwidth())
            .attr("height", function () {
                return height - yscale(0); 
            });

        rect
            .transition()
            .ease(d3.easeBounce)
            .duration(1000)
            .delay(function (d, i) {
                return (i * 300)
            })
            .attr('y', d => {
                return yscale(d.total)
            })
            .attr("height", function (d) {
                return height - yscale(d.total);   
            
            });

        var text = svg.selectAll('text')
            .data(selectedBarrio)
            .enter()
            .append('text')
            .text(d => d.total)
            .attr("x", function (d) {
                return xscale(d.bedrooms) + xscale.bandwidth() / 2 - 10;
            })
            .attr('y', d => {
                return yscale(d.total)
            })
            .style("opacity", 0);

        text
            .transition()
            .duration(200)
            .delay(d3.max(selectedBarrio, function (d, i) {
                return i;
            }) * 200)
            .style("opacity", 1);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xaxis);

        svg
            .append("text")
            .attr("transform", "translate(" + width / 2 + " ," + (height + 60) + ")")
            .style("text-anchor", "middle")
            .text("Numero de habitaciones");

    });
    //Terminamos con el grafico 2 y continuamos con el grafico 1

    var vmax = d3.max(features, (d) => d.properties.avgprice);
    var vmin = d3.min(features, (d) => d.properties.avgprice);

    var scaleColor = d3.scaleLinear().domain([vmin, vmax]).range(["white", "blue"]);
    createdPath.attr('fill', (d) => scaleColor(d.properties.avgprice));

    function handleMouseOver(event, d) {
        d3.select(this)
            .transition()
            .duration(1000)
            .attr("fill", "#93CAAE");

        tooltip
            .transition()
            .duration(200)
            .style("visibility", "visible")
            .style("left", event.pageX + 20 + "px")
            .style("top", event.pageY - 30 + "px")
            .text(`Barrio: ${d.properties.name}, Precio Medio: ${d.properties.avgprice} Eur`);
    }

    function handleMouseOut(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", (d) => scaleColor(d.properties.avgprice));

        tooltip.transition().duration(200).style("visibility", "hidden");
    }

}
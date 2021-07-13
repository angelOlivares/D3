//Graph 2. - Total de habitaciones segun numero de habitaciones
//console.log(features[1].properties.avgbedrooms);

var selectedBarrio = [
    {
      "bedrooms": "0",
      "total": 79
    },
    {
      "bedrooms": "1",
      "total": 684
    },
    {
      "bedrooms": "2",
      "total": 221
    },
    {
      "bedrooms": "3",
      "total": 78
    },
    {
      "bedrooms": "4",
      "total": 20
    }
  ]

var height = 500;
var width = 500;
var marginbottom = 100;
var margintop = 50;

var svg = d3.select('#bChart')
    .append('svg')
    .attr('width', width)
    .attr('height', height + marginbottom + margintop)
    .append("g")
    .attr("transform", "translate(0," + margintop + ")");

//Creacion de escalas
var xscale = d3.scaleBand()
    .domain(selectedBarrio.map(function(d) {
        return d.bedrooms;
    }))
    .range([0, width])
    .padding(0.1);

var yscale = d3.scaleLinear()
    .domain([0, d3.max(selectedBarrio, function(d) {
        return d.total;
    })])
    .range([height, 0]);

//Creación de eje X
var xaxis = d3.axisBottom(xscale);

//Creacion de los rectangulos
var rect = svg
    .selectAll('rect')
    .data(selectedBarrio)
    .enter()
    .append('rect')
    .attr("fill", "#93CAAE");



rect
    .attr("x", function(d) {
        return xscale(d.bedrooms);
    })
    .attr('y', d => {
        return yscale(0)
    })
    .attr("width", xscale.bandwidth())
    .attr("height", function() {
        return height - yscale(0); //Al cargarse los rectangulos tendran una altura de 0 
    });

rect
    .transition() //transición de entrada
    .ease(d3.easeBounce)
    .duration(1000)
    .delay(function(d, i) {
        return (i * 300)
    })
    .attr('y', d => {
        return yscale(d.total)
    })
    .attr("height", function(d) {
        return height - yscale(d.total); //Altura real de cada rectangulo.
    });


//Añadimos el texto correspondiente a cada rectangulo.
var text = svg.selectAll('text')
    .data(selectedBarrio)
    .enter()
    .append('text')
    .text(d => d.total)
    .attr("x", function(d) {
        return xscale(d.bedrooms) + xscale.bandwidth() / 2 - 10;
    })
    .attr('y', d => {
        return yscale(d.total)
    })
    .style("opacity", 0);

//Por si queremos aplicar el estilo creado al texto
/*text.attr('class', (d) => {
        if (d.value > 10) {
            return 'rectwarning';
        }
        return 'text';
    })*/

//Transicción de entrada en el texto.
text
    .transition()
    //.ease(d3.easeBounce)
    .duration(200)
    .delay(d3.max(selectedBarrio, function(d, i) {
        return i;
    }) * 300 + 1000)
    .style("opacity", 1);

//Añadimos el eje X
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis);

    svg
    .append("text")
    .attr("transform", "translate(" + width / 2 + " ," + (height + 60) + ")")
    .style("text-anchor", "middle")
    .text("Numero de habitaciones");
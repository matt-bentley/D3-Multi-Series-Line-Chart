var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope) {
  
    var data = [
        {
          name: "USA",
          values: [
            {date: "2000", price: "100"},
            {date: "2001", price: "110"},
            {date: "2002", price: "145"},
            {date: "2003", price: "241"},
            {date: "2004", price: "101"},
            {date: "2005", price: "90"},
            {date: "2006", price: "10"},
            {date: "2007", price: "35"},
            {date: "2008", price: "21"},
            {date: "2009", price: "201"}
          ]
        },
        {
          name: "Canada",
          values: [
            {date: "2000", price: "200"},
            {date: "2001", price: "120"},
            {date: "2002", price: "33"},
            {date: "2003", price: "21"},
            {date: "2004", price: "51"},
            {date: "2005", price: "190"},
            {date: "2006", price: "120"},
            {date: "2007", price: "85"},
            {date: "2008", price: "221"},
            {date: "2009", price: "101"}
          ]
        },
        {
          name: "Maxico",
          values: [
            {date: "2000", price: "50"},
            {date: "2001", price: "10"},
            {date: "2002", price: "5"},
            {date: "2003", price: "71"},
            {date: "2004", price: "20"},
            {date: "2005", price: "9"},
            {date: "2006", price: "220"},
            {date: "2007", price: "235"},
            {date: "2008", price: "61"},
            {date: "2009", price: "10"}
          ]
        }
      ];
      
      var width = 500;
      var height = 300;
      var margin = 50;
      var duration = 250;
      
      var lineOpacity = "0.25";
      var lineOpacityHover = "0.85";
      var otherLinesOpacityHover = "0.1";
      var lineStroke = "1.5px";
      var lineStrokeHover = "2.5px";
      
      var circleOpacity = '0.85';
      var circleOpacityOnLineHover = "0.25"
      var circleRadius = 3;
      var circleRadiusHover = 6;
      
      
      /* Format Data */
      var parseDate = d3.timeParse("%Y");
      var parseTime = d3.timeParse("%d-%b-%y");
      var formatTime = d3.timeFormat("%e %B");
      data.forEach(function(d) { 
          var i = 0;
        d.values.forEach(function(d) {
          d.date = parseDate(d.date);
          d.price = +d.price;    
          d.index = i;
          i++;
        });
      });
      
      
      /* Scale */
      var xScale = d3.scaleTime()
        .domain(d3.extent(data[0].values, d => d.date))
        .range([0, width-margin]);
      
      var yScale = d3.scaleLinear()
        .domain([0, d3.max(data[0].values, d => d.price)])
        .range([height-margin, 0]);
      
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      
      /* Add SVG */
      var svg = d3.select("#chart").append("svg")
        .attr("width", (width+margin)+"px")
        .attr("height", (height+margin)+"px")
        .append('g')
        .attr("transform", `translate(${margin}, ${margin})`);

      /* Function for transition */
      var tLine = svg.transition()
        .duration(2000);
      
      /* Add line into SVG */
      var line = d3.line()
        .curve(d3.curveMonotoneX)
        .x(d => xScale(d.date))
        .y(d => yScale(d.price));
      
      let lines = svg.append('g')
        .attr('class', 'lines');
      
      lines.selectAll('.line-group')
        .data(data).enter()
        .append('g')
        .attr('class', 'line-group')  
        .on("mouseover", function(d, i) {
            svg.append("text")
              .attr("class", "title-text")
              .style("fill", color(i))        
              .text(d.name)
              .attr("text-anchor", "middle")
              .attr("x", (width-margin)/2)
              .attr("y", 5);
          })
        .on("mouseout", function(d) {
            svg.select(".title-text").remove();
          })
        .append('path')
        .attr('class', 'line')  
        .attr('d', d => line(d.values))
        .style('stroke', (d, i) => color(i))
        .style('opacity', lineOpacity)
        .on("mouseover", function(d) {
            d3.selectAll('.line').transition()		
              .duration(200)
              .style('opacity', otherLinesOpacityHover);

            d3.selectAll('.circle').transition()		
              .duration(200)
              .style('opacity', circleOpacityOnLineHover);

            d3.select(this).transition()		
              .duration(200)
              .style('opacity', lineOpacityHover)
              .style("stroke-width", lineStrokeHover)
              .style("cursor", "pointer");
          })
        .on("mouseout", function(d) {
            d3.selectAll(".line").transition()		
              .duration(200)
              .style('opacity', lineOpacity);

            d3.selectAll('.circle').transition()		
              .duration(200)
              .style('opacity', circleOpacity);

            d3.select(this).transition()		
              .duration(200)
              .style("stroke-width", lineStroke)
              .style("cursor", "none");
          });

      /* Add a curtain */
      var curtain = svg.append("rect")
      .attr("x", -1 * width)
      .attr("y", (-1 * height) + 10)
      .attr("width", width)
      .attr("height", height)
      .attr("class", "curtain")
      .attr("transform", "rotate(180)")
      .style("fill", "#ffffff")

      /* Add circles in the line */
      lines.selectAll("circle-group")
        .data(data).enter()
        .append("g")
        .style("fill", (d, i) => color(i))
        .selectAll("circle")
        .data(d => d.values).enter()
        .append("g")
        .attr("class", "circle")  
        .on("mouseover", function(d) {

            tooltip.transition()		
              .duration(300)		
              .style("opacity", .8)
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY - 28) + "px");		
              
            tooltip.html("<div class='tooltip-inner'>" + formatTime(d.date) + "<br/>"  + d.price + "</div>");	
          })
        .on("mouseout", function(d) {
            d3.select(this)
              .style("cursor", "none");

            tooltip.transition()		
              .duration(300)		
              .style("opacity", 0);
          })
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.price))
        .attr("r", 0)
        .style('opacity', 0);
      
      
      /* Add Axis into SVG */
      var xAxis = d3.axisBottom(xScale).ticks(5);
      var yAxis = d3.axisLeft(yScale).ticks(5);
      
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height-margin})`)
        .call(xAxis);
      
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append('text')
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .attr("fill", "#000")
        .text("Total values");

      // Define the div for the tooltip
      var tooltip = d3.select("body").append("div")	
      .attr("class", "tooltip")				
      .style("opacity", 0);

      tLine.select("rect.curtain")
        .attr("width",0);

      svg.selectAll(".dot").transition()
        .delay(function(d,i){
            return 1200 + (60 * d.index)
        })
        .duration(500)
        .style("opacity",circleOpacity)
        .attr("r", circleRadius);
  
});
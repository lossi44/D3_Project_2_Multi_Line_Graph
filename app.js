//  Define SVG area dimensions, Chart Params
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = { 
  top: 20, 
  right: 100, 
  bottom: 60, 
  left: 75 
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Variables for the path tracker objects
// var parseTime = d3.timeParse("%Y");

//  var x = d3.timeScale()
//      .range([0, width]);

    // var y = d3.scale.linear()
      // .range([height, 0]);

    // var color = d3.scale.category10();

    // var xAxis = d3.svg.axis()
    //   .scale(x)
    //   .orient("bottom");

    // var yAxis = d3.svg.axis()
    //   .scale(y)
    //   .orient("left");

    // var line = d3.svg.line()
    //   .interpolate("basis")
    //   .x(function(d) {
    //     return x(d.date);
    //   })
    //   .y(function(d) {
    //     return y(d.temperature);
    //   });

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from an external data.CSV file
var co2Data = d3.csv("data.csv", function(error, co2Data) {
   if (error) throw error;

  // Print the CO2 data
  console.log(co2Data);
  console.log([co2Data]);

  // Configure a parseTime function which will return a new Date object from a string
  var parseTime = d3.timeParse("%Y");

// Reference line 108 on the HTML file
  // Create an Object Array for the GLobal Population

  //  Create an object array for the CO2 Emissions

  // Format the date and cast the CO2 value to a number
  co2Data.forEach(function(data) {
    data.year = parseTime(data.year);
    data.population = +data.population;
    data.co2 = +data.co2;
  });

    // Create scaling functions
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(co2Data, d => d.year))
    .range([0, width]);

  var yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(co2Data, d => d.co2)])
    .range([height, 0]);

  var yLinearScale2 = d3.scaleLinear()
    .domain([0, d3.max(co2Data, d => d.population)])
    .range([height, 0]);

   // Create axis functions
  var bottomAxis = d3.axisBottom(xTimeScale)
    .tickFormat(d3.timeFormat("%Y"));
  var leftAxis = d3.axisLeft(yLinearScale1);
  var rightAxis = d3.axisRight(yLinearScale2);

    // gridlines in x axis function // 
  function make_x_gridlines() {		
    return d3.axisBottom(xTimeScale)
        .ticks(10)
}
// gridlines in y axis function //
  function make_y_gridlines() {		
    return d3.axisLeft(yLinearScale1)
        .ticks(10)
}
  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y1-axis to the left side of the display
  chartGroup.append("g")
    // Define the color of the axis text
    .classed("green", true)
    .call(leftAxis);

  // Add y2-axis to the right side of the display
  chartGroup.append("g")
    // Define the color of the axis text
    .classed("blue", true)
    .attr("transform", `translate(${width}, 0)`)
    .call(rightAxis);

 // add the X gridlines
  chartGroup.append("g")			
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
     .tickSize(-height)
     .tickFormat("")
 )
// add the Y gridlines
  chartGroup.append("g")			
    .attr("class", "grid")
    .call(make_y_gridlines()
     .tickSize(-width)
     .tickFormat("")
 )
  // Line generators for each line
  var line1 = d3.line()
    .x(d => xTimeScale(d.year))
    .y(d => yLinearScale1(d.co2));

  var line2 = d3.line()
    .x(d => xTimeScale(d.year))
    .y(d => yLinearScale2(d.population));

  // Append a path for line1
  chartGroup.append("path")
    .data([co2Data])
    .attr("d", line1)
    .classed("line green", true);

  // Append a path for line2
  chartGroup.append("path")
    .data([co2Data])
    .attr("d", line2)
    .classed("line blue", true);

  // Append axes titles
  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .classed("population-text text", true)
    .text("Global Population and");

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
    .classed("co2-text text", true)
    .text("CO2 Emissions from 1960 to 2017");

  // append y1 (Left) axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("CO2 Emissions in Metric Tonnes");
  
  // append y2 (Right) axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90,355,-410)")
    .attr("y", 0 + margin.right)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Global Population");
  });

  // Begin vertical line and circle line path tracker
var color = d3.scaleLinear().domain([1,length])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

color.domain(d3.keys(co2Data[0]).filter(function(key) {
  returnkey !== "year";
}));
// Call each year from our csv file, 1960 - 2017
co2Data.forEach(function(d) {
  d.year = parseTime(d.year);
});

var pathCircles = color.domain().map(function(circleData) {
  return {
    circleData: circleData,
    values:data.map(function(d) {
      return {
        year: d.year,
        co2: +[circleData]    
      };
    })
  };
});

x.domain(d3.extent(data, function(c) {
  return d.year;
}));

y.domain([
  d3.min(pathCircles, function(c) {
    return d3.min(c.values, function(v) {
      return v.co2;
    });
  })
]);
// Adding a legend to the graph
var legend = svg.selectAll('g')
  .data(pathCircles)
  .enter()
  .append('g')
  .attr('class', 'legend');

legend.append('rect')
  .attr('x', width - 20)
  .attr('y', function(d, i) {
    return i * 20;
  })
  .attr('width', 10)
  .attr('height', 10)
  .style('fill', function(d) {
    return color(d.circleData);
  });

  legend.append('text')
  .attr('x', width - 8)
  .attr('y', function(d, i) {
    return (i * 20) + 9;
  })
  .text(function(d) {
    return d.circleData;
  });

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("CO2 Emissions (MT)");

var co2_pop = svg.selectAll(".population")
  .data(pathCircles)  
  .enter().append("g")
  .attr("d", function(d) {
    return line(d.values);
  })

co2_pop("path")
  .attr("class", "line")
  .attr("d", function(d) {
    return line(d.values);
  });

co2_pop("text")
  .datum(function(d) {
    return {
      circleData: d.circleData,
      value: d.values[d.values.length - 1]
    };
  })
  .attr("transform", function(d) {
    return "translate(" + x(d.value.year) + "," + y(d.value.co2) + ")";
  })
  .attr("x", 3)
  .attr("dy", ".35em")
  .text(function(d) {
    return d.circleData
  });
// Add vertical line for path tracker  
var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(chartGroup)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) {
        return color(d.population);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            console.log(width/mouse[0])
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);
            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(2));
              
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });

// End multi-line graph code, circles on path not functioning....yet!  

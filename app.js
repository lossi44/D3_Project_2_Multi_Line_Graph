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

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from an external data.CSV file
d3.csv("data.csv", function(error, co2Data) {
   if (error) throw error;

  // Print the CO2 data
  console.log(co2Data);
  console.log([co2Data]);

  // Configure a parseTime function which will return a new Date object from a string
  var parseTime = d3.timeParse("%Y");

  // Format the date and cast the CO2 value to a number
  co2Data.forEach(function(data) {
    data.year = parseTime(data.year);
    data.population = +data.population;
    data.co2 = +data.CO2;
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
    .classed("country-text text", true)
    .text("Global Population");

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
    .classed("co2-text text", true)
    .text("and CO2 Emissions");
});

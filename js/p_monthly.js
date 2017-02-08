(function() {

  // 表示するデータ
  var data = [
    {date: "2014-01", value:1130000},
    {date: "2015-02", value:1700000},
    {date: "2015-03", value:1000000},
    {date: "2015-04", value:1100000},
    {date: "2015-05", value:1690000},
    {date: "2015-06", value:1500000},
    {date: "2015-07", value:1750000},
    {date: "2015-08", value:1800000},
    {date: "2015-09", value:1550000},
    {date: "2015-10", value:1500000},
    {date: "2015-11", value:1320000},
    {date: "2015-12", value:1900000}
  ];

  var data3 = [
    {date: "2015-01", value:1800000},
    {date: "2015-02", value:1900000},
    {date: "2015-03", value:1700000},
    {date: "2015-04", value:1800000},
    {date: "2015-05", value:2000000},
    {date: "2015-06", value:1900000},
    {date: "2015-07", value:1870000},
    {date: "2015-08", value:1900000},
    {date: "2015-09", value:1700000},
    {date: "2015-10", value:1600000},
    {date: "2015-11", value:1800000},
    {date: "2015-12", value:1900000}
  ];

  var dataSinryobi = {
    

  }

  var width = 750;
  var height = 500;
  var aspect = width / height;

  var padding = 30; // グラフの余白
  var xAxisPadding = 50; // x軸表示余白
  var yAxisPadding = 50; // y軸表示余白

  var displayNum = data.length - 1; // 表示日数
  var dayWidth = (width - xAxisPadding - padding * 2) / displayNum; // 1日分の横幅

  var max = 2000000;

  var rightMax = 50;


  // SVG作成
  var graphArea = d3.select("#graphArea")
    .append("svg")
    .attr("id", "graph")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 "+ width +" " + height +"")
    .attr("preserveAspectRatio", "xMidYMid meet");

  /* -----------------------------------
    responsive with window size
  ----------------------------------- */

  var graph = d3.select("#graph");

  d3.select(window)
    .on("resize", function() {
      var targetWidth = graph.node().getBoundingClientRect().width;
      graph.attr("width", targetWidth);
      graph.attr("height", targetWidth / aspect);
    });

  //================================================
  //    棒グラフ
  //================================================

  var c = [ "#BDE4F3", "#E7E2C1", "#E2CCD8" ]; // ColorBrewer Set 1

  var numberGroups = 12; // groups
  var numberSeries = 3;  // series in each group
  var data2 = d3.range(numberSeries).map(function () { return d3.range(numberGroups).map(Math.random); });

  console.log(data2);

  // Groups scale, x axis
  var x0 = d3.scale.ordinal()
      .domain(d3.range(numberGroups))
      .rangeBands([0, width-10], 0.7);

  // Series scale, x axis
  // It might help to think of the series scale as a child of the groups scale
  var x1 = d3.scale.ordinal()
      .domain(d3.range(numberSeries))
      .rangeBands([0, x0.rangeBand()]);

  // Values scale, y axis
  var y = d3.scale.linear()
      .domain([0, 2]) // Because Math.random returns numbers between 0 and 1
      .range([0, height]);


  // Series selection
  // We place each series into its own SVG group element. In other words,
  // each SVG group element contains one series (i.e. bars of the same colour).
  // It might be helpful to think of each SVG group element as containing one bar chart.
  var series = graph.selectAll("series")
      .data(data2)
    .enter().append("g")
      .attr("class", "series") // Not strictly necessary, but helpful when inspecting the DOM
      .attr("fill", function (d, i) { return c[i]; })
      .attr("transform", function (d, i) { return "translate(" + (x1(i) + padding) + ")"; });

  // Groups selection
  var groups = series.selectAll("rect")
      .data(Object) // The second dimension in the two-dimensional data array
    .enter().append("rect")
        .attr("x", 0)
        .attr("y", function (d) { return height - y(d); })
        .attr("width", x1.rangeBand())
        .attr("height", y)
        .attr("transform", function (d, i) { return "translate(" + x0(i) + ", -50)"; });

  //================================================
  //    折れ線グラフ
  //================================================

  // 軸
  var xScale = d3.time.scale()
    .domain([1, 12])
    .range([padding, width - xAxisPadding - padding]);

  var yScale = d3.scale.linear()
    .domain([max, 0])
    .range([padding, height - yAxisPadding - padding]);

  var yScale2 = d3.scale.linear()
    .domain([rightMax, 0])
    .range([padding, height - yAxisPadding - padding]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(function(d,i){ 
      console.log(d.date);
      return (i+1) + '月'; 
    })
    .ticks(12);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(9)
    .orient("left");

  var yAxis2 = d3.svg.axis()
    .scale(yScale2)
    .ticks(9)
    .orient("right");

  var yGridAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .innerTickSize(-height)
      .tickFormat("");

  var xGridAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .innerTickSize(-width)
    .tickFormat("");

  graph.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + xAxisPadding + ", " + (height - yAxisPadding) + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("x", 0)
    .attr("y", 15);

  graph.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + xAxisPadding + ", 0)")
    .call(yAxis);

  graph.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (width) + ", 0)")
    .call(yAxis2);

  // Y軸のグリッドを描画
  graph.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + xAxisPadding + "," + (height - yAxisPadding) + ")")
    .call(yGridAxis);

  // X軸のグリッドを描画
  graph.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + xAxisPadding + ", 0)")
    .call(xGridAxis);

  // 折れ線グラフ
  var line = d3.svg.line()
    .x(function(d, i){
      return (i * dayWidth) + xAxisPadding + padding;
    })
    .y(function(d){
      return height - padding - yAxisPadding - ((height - yAxisPadding - padding * 2) / max * d.value );
    });

  // 塗り潰し領域を生成
  var area = d3.svg.area()
      .x(function(d,i) { 
        return (i * dayWidth) + xAxisPadding + padding;
      })
      .y0(function(d,i) { 
        return height - yAxisPadding;
      })
      .y1(function(d,i) { 
        return height - padding - yAxisPadding - ((height - yAxisPadding - padding * 2) / max * d.value );
      });

  graph.append("path")
    .attr("class", "high")
    .attr("d", line(data))
    .attr("stroke", "#FA4884")
    .attr("stroke-width", "2px")
    .attr("fill", "none");

  graph.append("path")
    .attr("class", "high")
    .attr("d", area(data3))
    .attr("stroke", "#1DC3BC")
    .attr("stroke-width", "2px")
    .attr("fill", "#B3F7FE")
    .attr("opacity", "0.3");

  // 散布図
  graph.selectAll(".high_circle")
      .data(data)
      .enter()
      .append("circle")
    .attr("class", "high_circle")
      .attr("cx", function(d,i){
          return (i * dayWidth) + xAxisPadding + padding;
      })
      .attr("cy", function(d){
          return height - padding - yAxisPadding - ((height - yAxisPadding - padding * 2) / max * d.value );
      })
      .attr("r", 0)
      .attr("fill", "#FA4884")
    .transition()
      .duration(700)
      .attr("r", 6);

  // テキスト
  graph.selectAll(".high_text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "high_text")
    .text(function (d) {
      return d.value;
    })
    .attr("font-size", "14px")
    .attr("fill", "#FA4884")
    .attr("x", function(d, i){
      return (i * dayWidth) + xAxisPadding + padding - 25;
    })
    .attr("y", function(d){
      return height - padding - yAxisPadding - ((height - yAxisPadding - padding * 2) / max * d.value ) - 12;
    });
})();
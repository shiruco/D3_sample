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

  var width = 700;
  var height = 500;
  var aspect = width / height;

  //x軸の左右余白
  var xAxisPadding = 30;

  //y軸の上下余白
  var yAxisPadding = 0;

  // グラフ左余白
  var graphLeftPadding = 60;

  // グラフ上余白
  var graphTopPadding = 20;

  //グラフ下余白
  var graphBottomPadding = 50;

  //月単位の間隔
  monthWidth = 50;

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

  /* -----------------------------------
    診察日数棒グラフ
  ----------------------------------- */

  var c = [ "#BDE4F3", "#E7E2C1", "#E2CCD8" ]; // ColorBrewer Set 1

  var numberGroups = 12; // groups
  var numberSeries = 3;  // series in each group
  var data2 = d3.range(numberSeries).map(function () { return d3.range(numberGroups).map(Math.random); });

  console.log(data2);

  // Groups scale, x axis
  var x0 = d3.scale.ordinal()
      .domain(d3.range(numberGroups))
      .rangeBands([graphLeftPadding, monthWidth * 11 + graphLeftPadding],0.8);

  // Series scale, x axis
  // It might help to think of the series scale as a child of the groups scale
  var x1 = d3.scale.ordinal()
      .domain(d3.range(numberSeries))
      .rangeBands([0, x0.rangeBand()]);

  // Values scale, y axis
  var y = d3.scale.linear()
      .domain([0, 1]) // Because Math.random returns numbers between 0 and 1
      .range([0, height - graphBottomPadding - graphTopPadding - yAxisPadding]);


  // Series selection
  // We place each series into its own SVG group element. In other words,
  // each SVG group element contains one series (i.e. bars of the same colour).
  // It might be helpful to think of each SVG group element as containing one bar chart.
  var series = graph.selectAll("series")
      .data(data2)
    .enter().append("g")
      .attr("class", "series") // Not strictly necessary, but helpful when inspecting the DOM
      .attr("fill", function (d, i) { return c[i]; })
      .attr("transform", function (d, i) { return "translate(" + (x1(i)) + ")"; });

  // Groups selection
  var groups = series.selectAll("rect")
      .data(Object) // The second dimension in the two-dimensional data array
    .enter().append("rect")
        .attr("x", 0)
        .attr("y", function (d) { return height - y(d); })
        .attr("width", x1.rangeBand())
        .attr("height", y)
        .attr("transform", function (d, i) { return "translate(" + x0(i) + ", " + -graphBottomPadding + ")"; });

  /* -----------------------------------
    月次売上折れ線グラフ
  ----------------------------------- */

  // 軸
  var xScale = d3.time.scale()
    .domain([1, 12])
    .range([xAxisPadding, monthWidth * 11 + xAxisPadding]);

  var yScale = d3.scale.linear()
    .domain([max, 0])
    .range([yAxisPadding + graphTopPadding, height - graphBottomPadding - yAxisPadding]);

  var yScale2 = d3.scale.linear()
    .domain([rightMax, 0])
    .range([yAxisPadding + graphTopPadding, height - graphBottomPadding - yAxisPadding]);

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

  // 月(X軸)を描画
  graph.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + graphLeftPadding + ", " + (height - graphBottomPadding) + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("x", 0)
    .attr("y", 15);

　// 売上(Y軸)を描画
  graph.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + graphLeftPadding + ", 0)")
    .call(yAxis);

  // 診察日数(Y軸)を描画
  graph.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (monthWidth * 11 + graphLeftPadding + xAxisPadding + 30) + ", 0)")
    .call(yAxis2);

  // Y軸のグリッドを描画
  graph.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + graphLeftPadding + "," + (height - graphBottomPadding) + ")")
    .call(yGridAxis);

  // X軸のグリッドを描画
  graph.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + graphLeftPadding + ", 0)")
    .call(xGridAxis);

  // 折れ線グラフ
  var line = d3.svg.line()
    .x(function(d, i){
      return (i * monthWidth) + graphLeftPadding + xAxisPadding;
    })
    .y(function(d){
      return height - yAxisPadding - graphBottomPadding - ((height - graphBottomPadding - graphTopPadding - yAxisPadding * 2) / max * d.value );
    });

  // 塗り潰し領域を生成
  var area = d3.svg.area()
      .x(function(d,i) { 
        return (i * monthWidth) + graphLeftPadding + xAxisPadding;
      })
      .y0(function(d,i) { 
        return height - graphBottomPadding;
      })
      .y1(function(d,i) { 
        return height - yAxisPadding - graphBottomPadding - ((height - graphBottomPadding - graphTopPadding - yAxisPadding * 2) / max * d.value );
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
          return (i * monthWidth) + graphLeftPadding + xAxisPadding;
      })
      .attr("cy", function(d){
          return height - yAxisPadding - graphBottomPadding - ((height - graphBottomPadding - graphTopPadding - yAxisPadding * 2) / max * d.value );
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
      return (i * monthWidth) + graphLeftPadding + xAxisPadding - 25;
    })
    .attr("y", function(d){
      return height - yAxisPadding - graphBottomPadding - ((height - graphBottomPadding - graphTopPadding - yAxisPadding * 2) / max * d.value ) - 12;
    });
})();
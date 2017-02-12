(function() {

  'use strict';

  // 表示するデータ
  var data = {
    // 過去3年分の月次データ(昇順)
    monthlyData: [
      {
        sales: [
          {date: "2016-01", value:1300000, day: 10},
          {date: "2016-02", value:1400000, day: 22},
          {date: "2016-03", value:1100000, day: 21},
          {date: "2016-04", value:1250000, day: 18},
          {date: "2016-05", value:1400000, day: 30},
          {date: "2016-06", value:1550000, day: 26},
          {date: "2016-07", value:1500000, day: 24},
          {date: "2016-08", value:1620000, day: 28},
          {date: "2016-09", value:1700000, day: 25},
          {date: "2016-10", value:1500000, day: 27},
          {date: "2016-11", value:1390000, day: 27},
          {date: "2016-12", value:1200000, day: 24}
        ]
      },
      {
        sales: [
          {date: "2015-01", value:1600000, day: 21},
          {date: "2015-02", value:1300000, day: 30},
          {date: "2015-03", value:1000000, day: 24},
          {date: "2015-04", value:1450000, day: 27},
          {date: "2015-05", value:1300000, day: 24},
          {date: "2015-06", value:1350000, day: 27},
          {date: "2015-07", value:1300000, day: 29},
          {date: "2015-08", value:1120000, day: 19},
          {date: "2015-09", value:1500000, day: 28},
          {date: "2015-10", value:1100000, day: 10},
          {date: "2015-11", value:1290000, day: 30},
          {date: "2015-12", value:1100000, day: 20}
        ]
      },
      {
        sales: [
          {date: "2014-01", value:1500000, day: 10},
          {date: "2014-02", value:1200000, day: 24},
          {date: "2014-03", value:1100000, day: 26},
          {date: "2014-04", value:1250000, day: 22},
          {date: "2014-05", value:1400000, day: 28},
          {date: "2014-06", value:1650000, day: 30},
          {date: "2014-07", value:1200000, day: 10},
          {date: "2014-08", value:1220000, day: 30},
          {date: "2014-09", value:1400000, day: 25},
          {date: "2014-10", value:1300000, day: 27},
          {date: "2014-11", value:1390000, day: 28},
          {date: "2014-12", value:1300000, day: 29}
        ]
      }
    ],
    targetSalesData: [
      {date: "2016-01", value:1500000},
      {date: "2016-02", value:1600000},
      {date: "2016-03", value:1700000},
      {date: "2016-04", value:1700000},
      {date: "2016-05", value:1500000},
      {date: "2016-06", value:1700000},
      {date: "2016-07", value:1570000},
      {date: "2016-08", value:1600000},
      {date: "2016-09", value:1700000},
      {date: "2016-10", value:1600000},
      {date: "2016-11", value:1400000},
      {date: "2016-12", value:1700000}
    ],
    graphData: {
      maxSalesData: 1800000,
      maxBusinessDay: 45,
      displayMonth: [
        1,2,3,4,5,6,7,8,9,10,11,12
      ]
    }
  }

  /* -----------------------------------
    グラフ領域設定
  ----------------------------------- */

  var width = 960;
  var height = 514;

  // x軸の左右余白
  var xAxisPadding = 70;

  // グラフ左余白
  var graphLeftPadding = 70;

  // グラフ右余白
  var graphRightPadding = 50;

  // グラフ上余白
  var graphTopPadding = 20;

  // グラフ下余白
  var graphBottomPadding = 50;

  // 収益最大値
  var maxSalesData = data.graphData.maxSalesData;

  // 診療日最大値
  var maxBuisinessDay = data.graphData.maxBusinessDay;

  // 表示月
  var displayMonth = data.graphData.displayMonth;

  // 月単位の間隔
  var monthWidth = (width - xAxisPadding * 2) / 11;

　/* -----------------------------------
    グラフ領域初期化
  ----------------------------------- */

  // SVG作成
  var graphArea = d3.select("#graphArea")
    .append("svg")
    .attr("id", "graph")
    .attr("width", width + graphLeftPadding + graphRightPadding)
    .attr("height", height + graphTopPadding + graphBottomPadding);

  var graph = d3.select("#graph");

  /* -----------------------------------
    診察日数棒グラフ
  ----------------------------------- */

  // 棒グラフ色
  var rectColors = [ "#BDE4F3", "#E7E2C1", "#E2CCD8" ];

  // 棒グラフグループ数
  var numberGroups = displayMonth.length;

  // 棒グラフの数
  var numberSeries = 3;

  // データ整形
  var businessDayData = d3.range(numberSeries).map(function (i) { 
    var md = data.monthlyData[i];
    return d3.range(numberGroups).map(function(i) {
      return md.sales[i].day;
    });
  });

  // 棒グラフグループのXスケール
  var x0 = d3.scale.ordinal()
      .domain(d3.range(numberGroups))
      .rangeBands([graphLeftPadding + xAxisPadding, ((monthWidth * displayMonth.length) + graphLeftPadding + xAxisPadding)]);

  // 各棒グラフのXスケール
  var x1 = d3.scale.ordinal()
      .domain(d3.range(numberSeries))
      .rangeBands([0, x0.rangeBand() / 3]);

  // 各棒グラフのYスケール
  var y = d3.scale.linear()
      .domain([0, maxBuisinessDay])
      .range([0, height]);

  var series = graph.selectAll("series")
      .data(businessDayData)
      .enter()
      .append("g")
      .attr("class", "series")
      .attr("fill", function (d, i) { 
        return rectColors[i]; 
      })
      .attr("transform", function (d, i) { 
        return "translate(" + x1(i) + ")"; 
      });

  var groups = series.selectAll("rect")
      .data(Object)
      .enter()
      .append("rect")
        .attr("x", 0)
        .attr("y", function (d) { 
          return height - y(d); 
        })
        .attr("width", x1.rangeBand())
        .attr("height", y)
        .attr("transform", function (d, i) { 
          return "translate(" + (x0(i) - (x1.rangeBand() / 2 * 3) )  + ", " + graphTopPadding + ")"; 
        });

  /* -----------------------------------
    月次売上折れ線グラフ
  ----------------------------------- */

  // 折れ線グラフ色
  var salesLineColors = [
    "#F84983", "#FEAF15", "#50B6F0"
  ];

  // 軸
  var xScale = d3.time.scale()
    .domain([1, displayMonth.length])
    .range([xAxisPadding, monthWidth * (displayMonth.length -  1) + xAxisPadding]);

  var yScale = d3.scale.linear()
    .domain([maxSalesData, 0])
    .range([graphTopPadding, height + graphTopPadding]);

  var yScale2 = d3.scale.linear()
    .domain([maxBuisinessDay, 0])
    .range([graphTopPadding, height + graphTopPadding]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(function(d,i){
      return data.graphData.displayMonth[i] + '月';
    })
    .ticks(displayMonth.length);

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
    .attr("transform", "translate(" + graphLeftPadding + ", " + (height + graphTopPadding) + ")")
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
    .attr("transform", "translate(" + (width + graphLeftPadding) + ", 0)")
    .call(yAxis2);

  // Y軸のグリッドを描画
  graph.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + graphLeftPadding + "," + (height + graphTopPadding) + ")")
    .call(yGridAxis);

  // X軸のグリッドを描画
  graph.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + graphLeftPadding + ", 0)")
    .call(xGridAxis);

  var drawSalesLineGraph = function(data, color, option) {

    // 折れ線グラフ
    var line = d3.svg.line()
      .x(function(d, i){
        return (i * monthWidth) + graphLeftPadding + xAxisPadding;
      })
      .y(function(d){
        return height + graphTopPadding - ( height / maxSalesData * d.value );
      });

    graph.append("path")
      .attr("d", line(data))
      .attr("stroke", color)
      .attr("stroke-width", "2px")
      .attr("fill", "none");

    // 散布図
    graph.selectAll(".circle" + option.index + "")
        .data(data)
        .enter()
        .append("circle")
      .attr("class", "circle" + option.index + "")
        .attr("cx", function(d,i){
            return (i * monthWidth) + graphLeftPadding + xAxisPadding;
        })
        .attr("cy", function(d){
            return height + graphTopPadding - (height / maxSalesData * d.value );
        })
        .attr("r", 5)
        .attr("fill", color);

    if (option.isShowText) {
      // テキスト
      graph.selectAll(".text" + option.index + "")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "text" + option.index + "")
        .text(function (d) {
          return d.value;
        })
        .attr("font-size", "14px")
        .attr("fill", color)
        .attr("x", function(d, i){
          return (i * monthWidth) + graphLeftPadding + xAxisPadding - 25;
        })
        .attr("y", function(d){
          return height + graphTopPadding - (height / maxSalesData * d.value ) - 15;
        });
    }
  }

  var drawTargetSalesLineGraph = function(data, color, option) {

    // 塗り潰し領域を生成
    var area = d3.svg.area()
      .x(function(d,i) { 
        return (i * monthWidth) + graphLeftPadding + xAxisPadding;
      })
      .y0(function(d,i) { 
        return height + graphTopPadding;
      })
      .y1(function(d,i) { 
        return height + graphTopPadding - ( height / maxSalesData * d.value );
      });

    graph.append("path")
      .attr("d", area(data))
      .attr("stroke", "#0FBFB8")
      .attr("stroke-width", "2px")
      .attr("fill", "#E2F4F5")
      .attr("opacity", "0.3");
  }

  // 収益目標グラフ描画
  drawTargetSalesLineGraph(data.targetSalesData);

  // 収益実績グラフ描画 (最新のものが前面にくるように)
  for (var i = data.monthlyData.length - 1; i >= 0; i-- ) {
    drawSalesLineGraph(
      data.monthlyData[i].sales, 
      salesLineColors[i],
      {
        index: i,
        isShowText: (i === 0) ? true : false
      }
    );
  }

})();
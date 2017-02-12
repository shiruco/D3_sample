(function() {

  // 表示するデータ
  var salesData = [
    {date: "2014-10", value:1600000},
    {date: "2014-11", value:1300000},
    {date: "2014-12", value:1000000},
    {date: "2015-01", value:1100000},
    {date: "2015-02", value:1290000},
    {date: "2015-03", value:1100000},
    {date: "2015-04", value:1450000},
    {date: "2015-05", value:1300000},
    {date: "2015-06", value:1350000},
    {date: "2015-07", value:1300000},
    {date: "2015-08", value:1120000},
    {date: "2015-09", value:1500000}
  ];

  var targetSalesData = [
    {date: "2015-01", value:1500000},
    {date: "2015-02", value:1600000},
    {date: "2015-03", value:1700000},
    {date: "2015-04", value:1700000},
    {date: "2015-05", value:1500000},
    {date: "2015-06", value:1700000},
    {date: "2015-07", value:1570000},
    {date: "2015-08", value:1600000},
    {date: "2015-09", value:1700000},
    {date: "2015-10", value:1600000},
    {date: "2015-11", value:1400000},
    {date: "2015-12", value:1700000}
  ];

  var businessDays = {
    

  }

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

  // 月単位の間隔
  var monthWidth = (width - xAxisPadding * 2) / 11;

  var max = 1800000;

  var rightMax = 45;


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
  var numberGroups = 12;

  // 棒グラフの数
  var numberSeries = 3;

  var data2 = d3.range(numberSeries).map(function () { 
    return d3.range(numberGroups).map(Math.random); 
  });

  console.log(data2);

  // 棒グラフグループのXスケール
  var x0 = d3.scale.ordinal()
      .domain(d3.range(numberGroups))
      .rangeBands([graphLeftPadding + xAxisPadding, ((monthWidth * 12) + graphLeftPadding + xAxisPadding)]);

  // 各棒グラフのXスケール
  var x1 = d3.scale.ordinal()
      .domain(d3.range(numberSeries))
      .rangeBands([0, x0.rangeBand() / 3]);

  // 各棒グラフのYスケール
  var y = d3.scale.linear()
      .domain([0, 1])
      .range([0, height]);

  var series = graph.selectAll("series")
      .data(data2)
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

  // 売上月データ数
  var salesMonthNum = salesData.length;

  // 最初の表示月
  var displayFirstYear = +salesData[0].date.split('-')[0];
  var displayFirstMonth = +salesData[0].date.split('-')[1];
  var displayLastYear = +salesData[salesMonthNum - 1].date.split('-')[0];
  var displayLastMonth = +salesData[salesMonthNum - 1].date.split('-')[1];

  // 軸
  var xScale = d3.time.scale()
    // .domain([
    //   new Date(displayFirstYear,displayFirstMonth - 1), 
    //   new Date(displayLastYear,displayLastMonth - 1)
    // ])
    .domain([1, 12])
    .range([xAxisPadding, monthWidth * 11 + xAxisPadding]);

  var yScale = d3.scale.linear()
    .domain([max, 0])
    .range([graphTopPadding, height + graphTopPadding]);

  var yScale2 = d3.scale.linear()
    .domain([rightMax, 0])
    .range([graphTopPadding, height + graphTopPadding]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(function(d,i){
      var month = +salesData[i].date.split('-')[1];
      return month + '' + '月'; 
      //return (d.getMonth() + 1) + '月'; 
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

  // 折れ線グラフ
  var line = d3.svg.line()
    .x(function(d, i){
      return (i * monthWidth) + graphLeftPadding + xAxisPadding;
    })
    .y(function(d){
      return height + graphTopPadding - ( height / max * d.value );
    });

  // 塗り潰し領域を生成
  var area = d3.svg.area()
      .x(function(d,i) { 
        return (i * monthWidth) + graphLeftPadding + xAxisPadding;
      })
      .y0(function(d,i) { 
        return height + graphTopPadding;
      })
      .y1(function(d,i) { 
        return height + graphTopPadding - ( height / max * d.value );
      });

  graph.append("path")
    .attr("class", "high")
    .attr("d", line(salesData))
    .attr("stroke", "#FA4884")
    .attr("stroke-width", "2px")
    .attr("fill", "none");

  graph.append("path")
    .attr("d", area(targetSalesData))
    .attr("stroke", "#1DC3BC")
    .attr("stroke-width", "2px")
    .attr("fill", "#B3F7FE")
    .attr("opacity", "0.3");

  // 散布図
  graph.selectAll(".high_circle")
      .data(salesData)
      .enter()
      .append("circle")
    .attr("class", "high_circle")
      .attr("cx", function(d,i){
          return (i * monthWidth) + graphLeftPadding + xAxisPadding;
      })
      .attr("cy", function(d){
          return height + graphTopPadding - (height / max * d.value );
      })
      .attr("r", 5)
      .attr("fill", "#FA4884");

  // テキスト
  graph.selectAll(".high_text")
    .data(salesData)
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
      return height + graphTopPadding - (height / max * d.value ) - 15;
    });
})();
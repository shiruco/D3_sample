(function() {

  'use strict';

  d3.json("./data/monthly_sales.json", function(error, data) {

    // 読み込みエラー時
    if (error != null) {
      // do something
      return;
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
    var numberSeries = data.monthlyData.length;

    // データ整形
    var businessDayData = d3.range(numberSeries).map(function (i) { 
      var md = data.monthlyData[numberSeries - i - 1];
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
          return rectColors[(rectColors.length - numberSeries) + i]; 
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
            return "translate(" + (x0(i) - (x1.rangeBand() / 2 * numberSeries) )  + ", " + graphTopPadding + ")"; 
          });

    /* -----------------------------------
      月次売上折れ線グラフ
    ----------------------------------- */

    // 折れ線グラフ色
    var salesLineColors = [ "#F84983", "#FEAF15", "#50B6F0" ];

    // 軸
    var xScale = d3.time.scale()
      .domain([1, displayMonth.length])
      .range([xAxisPadding, monthWidth * (displayMonth.length -  1) + xAxisPadding]);

    var xGridScale = d3.time.scale()
      .domain([1, 12])
      .range([xAxisPadding, monthWidth * 11 + xAxisPadding]);

    var yScaleSales = d3.scale.linear()
      .domain([maxSalesData, 0])
      .range([graphTopPadding, height + graphTopPadding]);

    var yScaleBusinessDay = d3.scale.linear()
      .domain([maxBuisinessDay, 0])
      .range([graphTopPadding, height + graphTopPadding]);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .tickFormat(function(d,i){
        return data.graphData.displayMonth[i] + '月';
      })
      .ticks(displayMonth.length);

    var yAxisSales = d3.svg.axis()
      .scale(yScaleSales)
      .orient("left");

    var yAxisBusinessDay = d3.svg.axis()
      .scale(yScaleBusinessDay)
      .orient("right");

    var yGridAxis = d3.svg.axis()
        .scale(xGridScale)
        .orient("bottom")
        .innerTickSize(-height)
        .tickFormat("");

    var xGridAxis = d3.svg.axis()
      .scale(yScaleSales)
      .orient("left")
      .innerTickSize(-width)
      .tickFormat("");

    // 月(X軸)を描画
    graph.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + graphLeftPadding + ", " + (height + graphTopPadding) + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("fill", "#0E2E40")
      .attr("font-weight", "bold")
      .attr("x", 0)
      .attr("y", 15);

  　// 売上(Y軸)を描画
    graph.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + graphLeftPadding + ", 0)")
      .call(yAxisSales)
      .selectAll("text")
      .attr("fill", "#0E2E40")
      .attr("font-weight", "bold");

    // 診察日数(Y軸)を描画
    graph.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (width + graphLeftPadding) + ", 0)")
      .call(yAxisBusinessDay)
      .selectAll("text")
      .attr("fill", "#C4C7C8")
      .attr("font-weight", "bold");

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

    /* -----------------------------------
      目標売上折れ線グラフ
    ----------------------------------- */

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

      if (option.isShowCircle) {
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
      }

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

    var drawTargetSalesLineGraph = function(data) {

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
        .attr("fill", "#0FBFB8")
        .attr("opacity", "0.1");
    }

    // 収益目標グラフ描画
    drawSalesLineGraph(data.targetSalesData, "#0FBFB8", {
      index: 11,
      isShowCircle: false,
      isShowText: false
    });
    drawTargetSalesLineGraph(data.targetSalesData);

    // 収益実績グラフ描画 (最新のものが前面にくるように)
    for (var i = data.monthlyData.length - 1; i >= 0; i-- ) {
      drawSalesLineGraph(
        data.monthlyData[i].sales, 
        salesLineColors[i],
        {
          index: i,
          isShowCircle: true,
          isShowText: (i === 0) ? true : false
        }
      );
    }
  });
})();
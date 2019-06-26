/* global d3 moment */

sap.ui.define(
  [
    "sap/ui/core/Control",
    "open/fc/thirdparty/d3",
    "open/fc/thirdparty/moment-with-locales"
  ],
  function(Control) {
    "use strict";

    return Control.extend("open.fc.CandlestickChart", {
      metadata: {
        library: "open.fc",
        properties: {
          width: "float",
          height: "float",
          axisLeftWidth: "float",
          axisRightWidth: "float",
          axisTopHeight: "float",
          axisBottomHeight: "float"
        },
        aggregations: {
          candles: { type: "open.fc.Candle", multiple: true }
        },

        defaultAggregation: "candles"
      },

      init: function() {
        var oControl = this;
        $(window).on("resize", function(oEvent) {
          oControl.onAfterRendering();
        });
      },
      renderer: function(oRm, oControl) {
        oRm.write("<svg");
        oRm.writeControlData(oControl);
        oRm.write(
          "><g class='fcChart'><g class='fcAxisLeft'></g><g class='fcAxisBottom'></g><g class='fcPlotArea'></g></g></svg>"
        );
        // d3 применяется только после рендера UI5
      },

      // без этого связывается только 100 элементов
      bindAggregation: function(sKey, oBindingInfo) {
        if (!oBindingInfo.length) oBindingInfo.length = 100000; // Max number of lines to display
        return sap.ui.core.Control.prototype.bindAggregation.apply(
          this,
          arguments
        ); //call superclass
      },

      // если меняется размер, то менять только размеры
      // если изменяется количество элементов - то их
      onAfterRendering: function() {
        var oControl = this;
        var aCandles = oControl.getCandles();
        if (!aCandles || aCandles.length < 2) return;
        var sId = this.getId();

        // подготовка переменных
        var sParentId = this.getParent().getId();

        var fWidth = oControl.getWidth();

        if (!fWidth) {
          fWidth = $("#" + sParentId).width();
        }

        var fAxisLeftWidth = oControl.getAxisLeftWidth(); // должно быть дефолтное, или даже вычисляться автоматически
        var fAxisRightWidth = oControl.getAxisRightWidth(); // должно быть дефолтное, или даже вычисляться автоматически
        var fPlotAreaWidth = fWidth - fAxisLeftWidth - fAxisRightWidth;
        var fHeight = oControl.getHeight();

        if (!fHeight) {
          fHeight = $("#" + sParentId).height(); // FIXME не срабатывает
        }

        var fAxisTopHeight = oControl.getAxisTopHeight(); // должно быть дефолтное, или даже вычисляться автоматически
        var fAxisBottomHeight = oControl.getAxisBottomHeight(); // должно быть дефолтное, или даже вычисляться автоматически
        var fPlotAreaHeight = fHeight - fAxisBottomHeight - fAxisTopHeight;
        var fMin = d3.min(aCandles, e => e.getLow());
        var fMax = d3.max(aCandles, e => e.getHigh());
        var fCandleBodyWidth = 0.8; // TODO заменить на ось категорий

        var sPositive = "white"; // TODO заменить на стили
        var sStroke = "white"; // TODO заменить на стили
        // подготовка пространства
        var svg = d3
          .select("#" + sId)

          .attr("width", fWidth)
          .attr("height", fHeight);

        var chart = svg.select(".fcChart");

        // console.log(ch1);
        // var chart = svg
        //   .append("g")

        chart.attr(
          "transform",
          `translate(${fAxisLeftWidth}, ${fAxisTopHeight})`
        ); // без учета верхней оси или заголовка

        // шкала x
        var dMinX = moment(aCandles[0].getX()).toDate();
        var iTimeframe = moment(aCandles[1].getX()).diff(dMinX, "m");
        var dMaxX = moment(aCandles[aCandles.length - 1].getX())
          .add(iTimeframe, "m")
          .toDate();

        var xScale = d3
          .scaleTime()
          .range([0, fPlotAreaWidth])
          .domain([dMinX, dMaxX]);

        // ось x
        var oAxisBottom = d3.axisBottom(xScale);

        chart
          .select(".fcAxisBottom")
          .attr("transform", `translate(0, ${fPlotAreaHeight})`)
          .call(oAxisBottom);

        var fTickWidth = xScale(
          moment(dMinX)
            .add(iTimeframe, "m")
            .toDate()
        );

        // шкала y
        var yScale = d3
          .scaleLinear()
          .range([fPlotAreaHeight, 0])
          .domain([fMin, fMax]);

        // ось y
        chart.select(".fcAxisLeft").call(d3.axisLeft(yScale));

        // тень свечи
        var plotArea = chart.select(".fcPlotArea");

        // plotArea
        //   .selectAll()
        //   .data(aCandles)
        //   .enter()
        //   .append("line")
        //   .attr("x1", e => xScale(moment(e.getX()).toDate()) + fTickWidth / 2)
        //   .attr("x2", e => xScale(moment(e.getX()).toDate()) + fTickWidth / 2)
        //   .attr("y1", e => yScale(e.getHigh()))
        //   .attr("y2", e => yScale(e.getLow()))
        //   .attr("fill", e =>
        //     e.getClose() >= e.getOpen() ? sPositive : sStroke
        //   )
        //   .attr("stroke-width", 1)
        //   .attr("stroke", e =>
        //     e.getClose() >= e.getOpen() ? sPositive : sStroke
        //   );

        // тело свечи
        var candleBody = plotArea.selectAll(".fcCandleBody").data(aCandles);

        candleBody.exit().remove();
        candleBody
          .enter()
          .append("rect")
          .classed("fcCandleBody", true);

        plotArea
          .selectAll(".fcCandleBody")
          .data(aCandles)
          .attr(
            "x",
            e =>
              xScale(moment(e.getX()).toDate()) +
              ((1 - fCandleBodyWidth) * fTickWidth) / 2
          )
          .attr("y", e => yScale(Math.max(e.getOpen(), e.getClose())))
          .attr("height", e =>
            Math.max(
              1,
              yScale(Math.min(e.getOpen(), e.getClose())) -
                yScale(Math.max(e.getOpen(), e.getClose()))
            )
          )
          .attr("width", fCandleBodyWidth * fTickWidth)
          .attr("fill", e =>
            e.getClose() >= e.getOpen() ? sPositive : sStroke
          )
          .attr("stroke-width", 0);
      }
    });
  }
);

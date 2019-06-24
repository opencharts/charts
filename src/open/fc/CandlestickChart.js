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
        properties: {
          padding: "int",
          width: "int",
          height: "int"
        },
        aggregations: {
          candles: { type: "open.fc.Candle", multiple: true }
        }
      },

      renderer: function(oRm, oControl) {
        oRm.write("<svg");
        oRm.writeControlData(oControl);
        oRm.write("></svg>");
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

      onAfterRendering: function() {
        var aCandles = this.getCandles();
        if (!aCandles || aCandles.length < 2) return;
        var sId = this.getId();

        // подготовка переменных
        var iPadding = this.getPadding();
        var sParentId = this.getParent().getId();

        if (!this.getWidth()) this.setWidth($("#" + sParentId).width());

        var iWidth = this.getWidth() - 2 * iPadding;
        var iHeight = this.getHeight() - 2 * iPadding;
        var fMin = d3.min(aCandles, e => e.getLow());
        var fMax = d3.max(aCandles, e => e.getHigh());

        var fCandleBodyWidth = 0.8;
        var sPositive = "green";
        var sStroke = "red";

        // подготовка пространства
        var svg = d3
          .select("#" + sId)
          .attr("width", this.getWidth())
          .attr("height", this.getHeight());

        var chart = svg
          .append("g")
          .attr("transform", `translate(${iPadding}, ${iPadding})`);

        // шкала x
        var dMinX = moment(aCandles[0].getX()).toDate();
        var iTimeframe = moment(aCandles[1].getX()).diff(dMinX, "m");
        var dMaxX = moment(aCandles[aCandles.length - 1].getX())
          .add(iTimeframe, "m")
          .toDate();

        var xScale = d3
          .scaleTime()
          .range([0, iWidth])
          .domain([dMinX, dMaxX]);

        // ось x
        var oAxisBottom = d3.axisBottom(xScale);

        chart
          .append("g")
          .attr("transform", `translate(0, ${iHeight})`)
          .call(oAxisBottom);

        var fTickWidth = xScale(
          moment(dMinX)
            .add(iTimeframe, "m")
            .toDate()
        );

        // шкала y
        var yScale = d3
          .scaleLinear()
          .range([iHeight, 0])
          .domain([fMin, fMax]);

        // ось y
        chart.append("g").call(d3.axisLeft(yScale));

        // тень свечи
        chart
          .selectAll()
          .data(aCandles)
          .enter()
          .append("line")
          .attr("x1", e => xScale(moment(e.getX()).toDate()) + fTickWidth / 2)
          .attr("x2", e => xScale(moment(e.getX()).toDate()) + fTickWidth / 2)
          .attr("y1", e => yScale(e.getHigh()))
          .attr("y2", e => yScale(e.getLow()))
          .attr("fill", e =>
            e.getClose() >= e.getOpen() ? sPositive : sStroke
          )
          .attr("stroke-width", 1)
          .attr("stroke", e =>
            e.getClose() >= e.getOpen() ? sPositive : sStroke
          );

        // тело свечи
        chart
          .selectAll()
          .data(aCandles)
          .enter()
          .append("rect")
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

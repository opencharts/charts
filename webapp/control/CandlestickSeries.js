sap.ui.define([
    "fokin/chart/control/Series"
], function(Series) {
    "use strict";

    return Series.extend("fokin.chart.control.CandlestickSeries", {
        metadata: {
            aggregations: {
                candlesticks: { type: "fokin.chart.control.Candlestick", multiple: true }
            }
        },

        generate: function() {
            var oParent = this.getParent();
            var iPadding = oParent.getPadding();
            var iHeight = oParent.getHeight() - 2 * iPadding;
            var xScale = oParent.oScaleX;
            var yScale = oParent.oScaleY;
            var chart = oParent.oChart; // FIXME сильная зависимость, учесть

            var aCandlesticks = this.getCandlesticks();
            // console.log(aCandlesticks);

            // chart.selectAll()
            //     .data(aCandlesticks)
            //     .enter()
            //     .append('line')
            //     .attr("x1", (e) => xScale(e.getX()) + iPadding)
            //     .attr("y1", (e) => yScale(e.getLow()))
            //     .attr("x2", (e) => xScale(e.getX()) + iPadding)
            //     .attr("y2", (e) => yScale(e.getHigh()))
            //     .style("stroke", "rgb(0,0,0)")
            //     .style("stroke-width", 1);

            var fWidth = 1;

            chart.selectAll()
                .data(aCandlesticks)
                .enter()
                .append('rect')
                .attr("x", (e) => xScale((moment(e.getX()).toDate())/* + (xScale.bandwidth() - fWidth) * 0.5*/))
                .attr("y", (e) => yScale(e.getHigh()))
                .attr("height", (e) => yScale(e.getLow()) - yScale(e.getHigh()))
                .attr("width", fWidth);

            chart.selectAll()
                .data(aCandlesticks)
                .enter()
                .append('rect')
                .attr("x", (e) => xScale((moment(e.getX()).toDate())))
                .attr("y", (e) => yScale(Math.max(e.getOpen(), e.getClose())))
                .attr("height", (e) => iHeight - yScale(Math.abs(e.getClose() - e.getOpen())))
                .attr("width", 20);

            return chart;
        }
    });
});

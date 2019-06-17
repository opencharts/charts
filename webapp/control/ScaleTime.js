sap.ui.define([
    "fokin/chart/control/Series"
], function(Series) {
    "use strict";

    return Series.extend("fokin.chart.control.ScaleTime", {
        metadata: {
            aggregations: {
                ticks: { type: "fokin.chart.control.AxisTick", multiple: true }
            }
        },

        generate: function() {
            var oParent = this.getParent();
            var iPadding = oParent.getPadding();
            var iHeight = oParent.getHeight() - 2 * iPadding;
            var xScale = oParent.oScaleX;
            var yScale = oParent.oScaleY;
            var chart = oParent.oChart; // FIXME сильная зависимость, учесть

            var aBars = this.getBars();
            return chart.selectAll()
                .data(aBars)
                .enter()
                .append('rect')
                .attr("x", (e) => xScale(e.getX()))
                .attr("y", (e) => yScale(e.getY()))
                .attr("height", (e) => iHeight - yScale(e.getY()))
                .attr("width", xScale.bandwidth())
        }
    });
});

/* global d3 moment */

sap.ui.define([
    "fokin/chart/control/Series"
], function(Series) {
    "use strict";

    return Series.extend("fokin.chart.control.LineSeries", {
        metadata: {
            aggregations: {
                points: { type: "fokin.chart.control.Point", multiple: true }
            }
        },

        generate: function() {
            var oParent = this.getParent();
            var iPadding = oParent.getPadding();
            var iHeight = oParent.getHeight() - 2 * iPadding;
            var xScale = oParent.oScaleX;
            var yScale = oParent.oScaleY;
            var svg = oParent.oSvg; // FIXME сильная зависимость, учесть

            var valueLine = d3.line()
                .x((e) => xScale(moment(e.getX()).toDate()) + iPadding)
                .y((e) => yScale(e.getY()) + iPadding)

            var aPoints = this.getPoints();
            return svg.append("path")
                .data([aPoints])
                .attr("class", "line")
                .attr("d", valueLine)
                .style("fill", "none")
                .style("stroke", "rgb(0,0,0)")
                .style("stroke-width", "2px");

        }
    });
});

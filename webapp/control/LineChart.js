/* global d3 moment */

sap.ui.define([
    "sap/ui/core/Control"
], function(Control) {
    "use strict";

    return Control.extend("fokin.chart.control.BarChart", {
        metadata: {
            properties: {
                padding: "int",
                width: "int",
                height: "int"
            },
            aggregations: {
                points: { type: "fokin.chart.control.Point", multiple: true }
            }
        },

        renderer: function(oRm, oControl) {
            oRm.write("<svg");
            oRm.writeControlData(oControl);
            oRm.write("></svg>");
            // d3 применяется только после рендера UI5
        },

        onAfterRendering: function() {
            var sId = this.getId();

            // подготовка переменных

            var iPadding = this.getPadding();
            var iWidth = this.getWidth() - 2 * iPadding;
            var iHeight = this.getHeight() - 2 * iPadding;
            var aPoints = this.getPoints();
            var fMin = d3.min(aPoints, e => e.getY());
            var fMax = d3.max(aPoints, e => e.getY());

            var fCandleBodyWidth = 0.8;
            var sStroke = "gray";

            // подготовка пространства
            var svg = d3.select('#' + sId)
                .attr("width", this.getWidth())
                .attr("height", this.getHeight());

            var chart = svg.append("g")
                .attr("transform", `translate(${iPadding}, ${iPadding})`);

            // шкала x
            var dMinX = moment(aPoints.length ? aPoints[0].getX() : null).toDate();
            var iTimeframe = moment(aPoints.length > 1 ? aPoints[1].getX() : null).diff(dMinX, 'm');
            var dMaxX = moment(aPoints.length ? aPoints[aPoints.length - 1].getX() : null).add(iTimeframe, 'm').toDate();

            var xScale = d3.scaleTime()
                .range([0, iWidth])
                .domain([dMinX, dMaxX]);

            // ось x
            var oAxisBottom = d3.axisBottom(xScale);

            chart.append('g')
                .attr('transform', `translate(0, ${iHeight})`)
                .call(oAxisBottom);

            var fTickWidth = xScale(moment(dMinX).add(iTimeframe, 'm').toDate());

            // шкала y
            var yScale = d3.scaleLinear()
                .range([iHeight, 0])
                .domain([fMin, fMax]);

            // ось y
            chart.append('g')
                .call(d3.axisLeft(yScale));

            // линия
            var line = d3.line()
                .x(e => xScale(moment(e.getX()).toDate()) + fTickWidth / 2)
                .y(e => yScale(e.getY()));

            chart.append("path")
                .datum(aPoints)
                .attr("fill", "none")
                .attr("stroke-width", 2)
                .attr("stroke", sStroke)
                .attr("d", line);
        }
    });
});

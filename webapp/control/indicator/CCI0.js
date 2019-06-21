/* global d3 moment */

sap.ui.define([
    "sap/ui/core/Control"
], function(Control) {
    "use strict";

    return Control.extend("fokin.chart.control.indicator.CCI0", {
        metadata: {
            properties: {
                padding: "int",
                width: "int",
                height: "int",
                threshold: "float"
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
            var sParentId = this.getParent().getId();

            // подготовка переменных

            var iPadding = this.getPadding();
            if (!this.getWidth()) this.setWidth($("#" + sParentId).width());
            
            var iWidth = this.getWidth() - 2 * iPadding;

            var iHeight = this.getHeight() - 2 * iPadding;
            var aPoints = this.getPoints();
            var fMin = d3.min(aPoints, e => e.getY());
            var fMax = d3.max(aPoints, e => e.getY());
            var fThreshold = this.getThreshold();

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

            // пороговые линии
            chart.append('line')
                .attr("x1", fTickWidth / 2)
                .attr("x2", iWidth - fTickWidth / 2)
                .attr("y1", yScale(fThreshold))
                .attr("y2", yScale(fThreshold))
                .attr("fill", sStroke)
                .attr("stroke-width", 2)
                .attr("stroke", sStroke);

            chart.append('line')
                .attr("x1", fTickWidth / 2)
                .attr("x2", iWidth - fTickWidth / 2)
                .attr("y1", yScale(-fThreshold))
                .attr("y2", yScale(-fThreshold))
                .attr("fill", sStroke)
                .attr("stroke-width", 2)
                .attr("stroke", sStroke);

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

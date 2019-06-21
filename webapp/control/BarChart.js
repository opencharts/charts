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
                bars: { type: "fokin.chart.control.Bar", multiple: true }
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
            var aBars = this.getBars();
            var fMin = d3.min(aBars, e => e.getY());
            var fMax = d3.max(aBars, e => e.getY());

            var fCandleBodyWidth = 0.8;

            // подготовка пространства
            var svg = d3.select('#' + sId)
                .attr("width", this.getWidth())
                .attr("height", this.getHeight());

            var chart = svg.append("g")
                .attr("transform", `translate(${iPadding}, ${iPadding})`);

            // шкала x
            var dMinX = moment(aBars.length ? aBars[0].getX() : null).toDate();
            var iTimeframe = moment(aBars.length > 1 ? aBars[1].getX() : null).diff(dMinX, 'm');
            var dMaxX = moment(aBars.length ? aBars[aBars.length - 1].getX() : null).add(iTimeframe, 'm').toDate();

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

            // бар
            chart.selectAll()
                .data(aBars)
                .enter()
                .append('rect')
                .attr("x", (e) => xScale(moment(e.getX()).toDate()) + (1 - fCandleBodyWidth) * fTickWidth / 2)
                .attr("y", (e) => yScale(e.getY()))
                .attr("height", (e) => iHeight - yScale(e.getY()))
                .attr("width", fCandleBodyWidth * fTickWidth)
                .attr("stroke-width", 2);
        }
    });
});

/* global d3 */

sap.ui.define([
    "sap/ui/core/Control"
], function(Control) {
    "use strict";

    return Control.extend("fokin.chart.control.Chart1", {
        metadata: {
            properties: {
                padding: "int",
                width: "int",
                height: "int",
                xScaleBandPadding: "float",
                min: "float",
                max: "float",
                y: "float"
            },
            aggregations: {
                series: { type: "fokin.chart.control.Series", multiple: true },
                axisBottomTicks: { type: "fokin.chart.control.AxisTick", multiple: true }
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

            var iPadding = this.getPadding();
            var iWidth = this.getWidth() - 2 * iPadding;
            var iHeight = this.getHeight() - 2 * iPadding;

            var svg = d3.select('svg')
                .attr("width", iWidth + 100)
                .attr("height", iHeight + 100);

            var chart = svg.append("g")
                .attr("transform", `translate(${iPadding}, ${iPadding})`);
            this.oChart = chart;

            var fMin = this.getMin();
            var fMax = this.getMax();

            var yScale = d3.scaleLinear()
                .range([iHeight, 0])
                .domain([fMin, fMax]);
            this.oScaleY = yScale;

            chart.append('g')
                .call(d3.axisLeft(yScale));

            var fXScaleBandPadding = this.getXScaleBandPadding(); // вроде лишнее, нужно только для гистограммы

            var aAxisBottomTicks = this.getAxisBottomTicks(); // вынести в отдельный метод
            var xScale = d3.scaleBand()
                .range([0, iWidth])
                .domain(aAxisBottomTicks.map((e) => e.getValue()))
                .padding(fXScaleBandPadding);
            this.oScaleX = xScale;

            chart.append('g')
                .attr('transform', `translate(0, ${iHeight})`)
                .call(d3.axisBottom(xScale));

            this.getSeries()[0].generate();
        }
    });
});

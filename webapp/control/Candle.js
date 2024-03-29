sap.ui.define([
    "sap/ui/core/Control"
], function(Control) {
    "use strict";

    return Control.extend("fokin.chart.control.Candle", {
        metadata: {
            properties: {
                x: "any",
                open: "float",
                high: "float",
                low: "float",
                close: "float",
                buy: "boolean",
                sell: "boolean"
            }
        },

        getTrend: function() {
            return this.getClose() - this.getOpen();
        }
    });
});

sap.ui.define([
    "sap/ui/core/Control"
], function(Control) {
    "use strict";

    return Control.extend("fokin.chart.control.Candlestick", {
        metadata: {
            properties: {
                x: "any",
                open: "float",
                high: "float",
                low: "float",
                close: "float",
            }
        }
    });
});

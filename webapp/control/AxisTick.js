sap.ui.define([
    "sap/ui/core/Control"
], function(Control) {
    "use strict";

    return Control.extend("fokin.chart.control.AxisTick", {
        metadata: {
            properties: {
                value: "any"
            }
        }
    });
});

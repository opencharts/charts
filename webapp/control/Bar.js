sap.ui.define([
    "sap/ui/core/Control"
], function(Control) {
    "use strict";

    return Control.extend("fokin.chart.control.Bar", {
        metadata: {
            properties: {
                x: "any",
                y: "float"
            }
        }
    });
});

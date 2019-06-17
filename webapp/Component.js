sap.ui.define([
    "sap/ui/core/UIComponent",
    "fokin/chart/assets/d3.min",
    "fokin/chart/assets/moment-with-locales.min"
], function(UIComponent, d3, momentjs) {
    "use strict";

    return UIComponent.extend("fokin.chart.Component", {
        metadata: {
            manifest: "json"
        },

        init: function() {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        }
    });
});

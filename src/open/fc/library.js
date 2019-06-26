sap.ui.define(["sap/ui/core/library"], function() {
  "use strict";

  return sap.ui.getCore().initLibrary({
    name: "openu.fc",
    dependencies: ["sap.ui.core", "sap.m"],
    interfaces: [],
    controls: ["openu.fc.CandlestickChart", "openu.fc.Candle"],
    elements: [],
    noLibraryCSS: true,
    version: "1.0.0"
  });
});

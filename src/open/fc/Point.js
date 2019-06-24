sap.ui.define(["sap/ui/core/Control"], function(Control) {
  "use strict";

  return Control.extend("open.fc.Point", {
    metadata: {
      properties: {
        x: "any",
        y: "float"
      }
    }
  });
});

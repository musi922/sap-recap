sap.ui.define([
    "./BaseController", 
], function (BaseController) {
    "use strict";

    return BaseController.extend("saprecap.controller.Contact", {

        onHomePress: function() {
            this.getRouter().navTo("main");
        },
        onAboutPress(){
			this.getRouter().navTo("about")
		},
        onContactPress(){
			this.getRouter().navTo("contact")
		}
      
        
        
        
    });
});
sap.ui.define([
    "./BaseController", 
], function (BaseController) {
    "use strict";

    return BaseController.extend("saprecap.controller.About", {

        onHomePress() {
            this.getRouter().navTo("main");
            console.log("dd");
            
        },
        onAboutPress(){
			this.getRouter().navTo("about")
		},
        onContactPress(){
			this.getRouter().navTo("contact")
		}
      
        
        
        
    });
});
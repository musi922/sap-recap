sap.ui.define([
    "./BaseController", 
    "sap/ui/model/json/JSONModel"
], function (BaseController,JSONModel) {
    "use strict";

    return BaseController.extend("saprecap.controller.About", {
        onInit(){
            const oModel = new JSONModel();
            oModel.loadData("model/data.json")
            this.getView().setModel(oModel,"userModel")
        },
        onHomePress() {
            this.getRouter().navTo("main");
            console.log("dd");
            
        },
        onAboutPress(){
			this.getRouter().navTo("about")
		},
        onContactPress(){
			this.getRouter().navTo("contact")
		},
        OnNavigateToCart(){
            this.getRouter().navTo("cart");
        }
        
        
        
    });
});
sap.ui.define([
    "./BaseController", 
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/odata/OperationMode"
], function (BaseController, MessageToast, JSONModel, ODataModel, Filter, FilterOperator, OperationMode) {
    "use strict";

    return BaseController.extend("saprecap.controller.Main", {
        onInit: function () {
            if (!this.checkRole("user")) {
                return;
            }
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData);
            


            const oModel = new ODataModel({
                serviceUrl: "http://localhost:4000/odata/",
                synchronizationMode: "None",
                operationMode: OperationMode.Server,
                httpHeaders: {
                    "Authorization": `Bearer ${userData.token}`
                }
            });
            this.getView().setModel(oModel, "products");
            
            this._applyProductFilter();

          this.getRouter().getRoute("main").attachPatternMatched(this._onRouteMatched, this);
          
        },
        onLogoutPress: function() {
            this.logout();
        },

        _onRouteMatched: function() {
           this._applyProductFilter();
        },

        _applyProductFilter: async function() {
            try {
                const oList = this.byId("idProductsTable");
                const oBinding = oList.getBinding("items");
                
                if (oBinding) {
                    const oFilter = new Filter("isInCart", FilterOperator.EQ, false);
                    
                    // Refresh the binding before applying the filter
                    await oBinding.refresh();
                    await oBinding.filter([oFilter]);
                }
            } catch (error) {
                console.error("Error applying filter:", error);
                MessageBox.error("Failed to filter products");
            }
        },

        onProductPress: function(oEvent) {
            let oContext = oEvent.getSource().getBindingContext("products");
            let oProductId = oContext.getProperty("ProductId");
            this.getRouter().navTo("details", {
                ProductId: oProductId
            });
        },

        onHomePress: function() {
            this.getRouter().navTo("");
        },
        onAboutPress(){
			this.getRouter().navTo("about")
		},
        onContactPress(){
			this.getRouter().navTo("about")
		},
		onCustomButtonPress:function (oEvent) {
            var sData = oEvent.getParameter("customData");
            MessageToast.show(sData);},
      
        
        
			onSubmissionStart: function () {
				console.log("Submission Started!");
			},
			onSubmissionEnd: function () {
				console.log("Submission Ended!");
			},
    });
});
sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/TabContainerItem",
    "sap/ui/model/odata/v4/ODataModel"
], function (BaseController, MessageBox, TabContainerItem, ODataModel) {
    "use strict";
    
    return BaseController.extend("saprecap.controller.AdminProduct", {
        onInit: function() {
            this.oEventBus = sap.ui.getCore().getEventBus();
            this.getView().attachModelContextChange(this._onModelContextChange, this);
        },

        _onModelContextChange: function(oEvent) {
            try {
                const oContext = this.getView().getBindingContext("products");
                
                if (oContext) {
                    console.log("Product details loaded:");
                    
                    
                }
            } catch (error) {
                console.error("Error loading product details:", error);
                MessageBox.error("Failed to load product details");
            }
        },

        onCloseDetailPress: function() {
            const oFlexibleColumnLayout = this.getView().getParent().getParent();
            oFlexibleColumnLayout.setLayout("OneColumn");
        },

        _refreshBindings: function() {
            const oView = this.getView();
            if (oView) {
                oView.getElementBinding("products")?.refresh();
            }
        }
    });
});
sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/TabContainerItem",
    "sap/ui/model/odata/v4/ODataModel"
], function (BaseController, MessageBox, TabContainerItem, ODataModel) {
    "use strict";
    
    return BaseController.extend("saprecap.controller.AdminProduct", {
        onInit: function() {
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData);
            
            const oViewModel = new ODataModel({
                serviceUrl: "http://localhost:4000/odata/",
                synchronizationMode: "None",
                httpHeaders: {
                    "Authorization": `Bearer ${userData.token}`
                }
            });
            
            this.getView().setModel(oViewModel);
        },

        onCloseDetailPress: function() {
            const oFlexibleColumnLayout = this.getView().getParent().getParent();
            oFlexibleColumnLayout.setLayout("OneColumn");
        },

        onTabSelect: function(oEvent) {
            var sSelectedProductId = oEvent.getParameter("key");
            
            this.getRouter().navTo("details", {
                ProductId: sSelectedProductId
            }, false);
        }
    });
});
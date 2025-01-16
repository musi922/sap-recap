sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/TabContainerItem",
    "sap/ui/model/odata/v4/ODataModel"
], function (BaseController, MessageBox, TabContainerItem, ODataModel) {
    "use strict";
    return BaseController.extend("saprecap.controller.Details", {
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
            this.getRouter().getRoute("details").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: async function(oEvent) {
            try {
                const sProductId = oEvent.getParameter("arguments").ProductId;
                
                this.getView().bindElement({
                    path: `/Products('${sProductId}')`,
                });

                const oModel = this.getView().getModel();
                const oContext = oModel.bindList("/Products").getContexts();
                console.log(oContext);

              

            } catch (oError) {
                console.error("Error:", oError);
                MessageBox.error("Failed to load data");
            }
        },

        onTabSelect: function(oEvent) {
            var sSelectedProductId = oEvent.getParameter("key");
            
            this.getRouter().navTo("details", {
                ProductId: sSelectedProductId
            }, false); 
        },
        onAddToCart(){
            this.byId("addToCart").open();
        },
        onCancelDialog(){
            this.byId("addToCart").close();
        },
        onConfirmAddToCart: async function() {
            try {
                const oModel = this.getView().getModel();
                const oContext = this.getView().getBindingContext();
                const sProductId = oContext.getProperty("ProductId");

                await oModel.bindContext("/addToCart(...)")
                    .setParameter("ProductId", sProductId)
                    .execute();

                this.byId("addToCart").close();
                MessageBox.success("Product added to cart");
                
                
                this.getRouter().navTo("cart",{},true);
                //refresh the cart page

            } catch (error) {
                MessageBox.error("Failed to add product to cart");
                console.error(error);
            }
        }
    });
});
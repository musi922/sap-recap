sap.ui.define([
    "./BaseController", 
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/odata/OperationMode"

], function (BaseController, MessageBox, JSONModel, ODataModel,OperationMode) {
    "use strict";
    return BaseController.extend("saprecap.controller.Cart", {
        onInit: function() {
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
            
            this.getView().setModel(oModel);
            
            const oCartModel = new JSONModel({
                cartItems: []
            });
            this.getView().setModel(oCartModel, "cart");
            
            this.getRouter().getRoute("cart").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function() {
            this._loadCartItems();
        },

        _loadCartItems: async function() {
            try {
                const oModel = this.getView().getModel();
                
                const oContext = await oModel.bindList("/getCartItems").requestContexts();
                
                const aCartItems = oContext.map(oContext => oContext.getObject());
                console.log(aCartItems);

                const oCartModel = this.getView().getModel("cart");
                oCartModel.setProperty("/getCartItems", aCartItems);
                
            } catch (error) {
                MessageBox.error("Failed to load cart items");
                console.error(error);
            }
        },

        handleDelete: async function(oEvent) {
            try {
                const oItem = oEvent.getParameter("listItem");
                const oContext = oItem.getBindingContext("cart");
                const sCartId = oContext.getProperty("CartId");
                const sProductId = oContext.getProperty("product_ProductId/ProductId");
        
                const oModel = this.getView().getModel();
                const sCartPath = `/Cart(CartId='${sCartId}')`; 
        
                await oModel.delete(sCartPath);

        
                await this._loadCartItems();
        
                MessageBox.success("Item removed from cart");
            } catch (error) {
                MessageBox.error("Failed to remove item from cart");
                console.error("Delete error:", error);
            }
        }
        ,

        onNavBack: function() {
            this.getRouter().navTo("main");
        }
    });
});
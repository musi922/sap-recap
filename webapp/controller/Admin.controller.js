sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
], function (BaseController, MessageToast) {
    "use strict";

    return BaseController.extend("saprecap.controller.Admin", {
        onInit: function () {
            if (!this.checkRole("admin")) {
                return;
            }
        },

        onUpdateProduct: async function(oEvent) {
            const oItem = oEvent.getSource().getBindingContext("products").getObject();
            try {
                const response = await fetch("http://localhost:4000/odata/Products" + oItem.ProductId, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token
                    },
                    body: JSON.stringify({
                        name: oItem.name,
                        price: oItem.price
                    })
                });

                if (response.ok) {
                    MessageToast.show("Product updated successfully");
                }
            } catch (error) {
                MessageToast.show("Error updating product");
            }
        },

        onLogoutPress: function() {
            this.logout();
        }
    });
});
sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/odata/OperationMode"
], function (BaseController, MessageBox, MessageToast, ODataModel, OperationMode) {
    "use strict";

    return BaseController.extend("saprecap.controller.Admin", {
        onInit: function () {
            if (!this.checkRole("admin")) {
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
        },

        onDeletePress: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("products");
            const oProductId = oContext.getProperty("ProductId");

            MessageBox.confirm("Are you sure you want to delete this product?", {
                title: "Confirm Deletion",
                onClose: async (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        try {
                            const oModel = this.getView().getModel("products");
                            await oModel.delete(`/Products('${oProductId}')`);
                            MessageToast.show("Product deleted successfully.");
                        } catch (error) {
                            console.error("Error deleting product:", error);
                            MessageBox.error("Failed to delete the product.");
                        }
                    }
                }
            });
        },

        onEditPress: function(oEvent) {
            const button = oEvent.getSource();
            const listItem = button.getParent();
            const oContext = listItem.getBindingContext("products");
            const productData = oContext.getObject();
            
            this._oEditContext = oContext;
            
            this.byId("supplierName").setValue(productData.supplierName);
            this.byId("category").setValue(productData.category);
            this.byId("rating").setValue(productData.rating);
            this.byId("price").setValue(productData.price);
            this.byId("productId").setValue(productData.ProductId);
            this.byId("productPicUrl").setValue(productData.productPicUrl);
            this.byId("productName").setValue(productData.name);
            this.byId("availability").setValue(productData.status);

            this.byId("editDiolog").open();
        },

        onConfirmEdit: async function() {
            try {
                if (!this._oEditContext) {
                    MessageBox.error("Product context is missing. Cannot update.");
                    return;
                }

                const updatedData = {
                    supplierName: this.byId("supplierName").getValue(),
                    category: this.byId("category").getValue(),
                    rating: parseFloat(this.byId("rating").getValue()),
                    price: parseFloat(this.byId("price").getValue()),
                    ProductId: this.byId("productId").getValue(),
                    productPicUrl: this.byId("productPicUrl").getValue(),
                    name: this.byId("productName").getValue(),
                    status: this.byId("availability").getValue()
                };

                const userData = JSON.parse(localStorage.getItem("user"));
                if (!userData || !userData.token) {
                    throw new Error("Authentication token is missing");
                }

                const response = await fetch(
                    `http://localhost:4000/odata/Products('${updatedData.ProductId}')`, 
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userData.token}`
                        },
                        body: JSON.stringify(updatedData)
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error: ${response.statusText}`);
                }

                this.byId("editDiolog").close();
                await this.getView().getModel("products").refresh();
                MessageBox.success("Product updated successfully.");
                
            } catch (error) {
                console.error("Error updating product:", error);
                MessageBox.error(error.message || "Failed to update the product.");
            }
        },

        onCancelDialog: function() {
            this.byId("editDiolog").close();
        },

        onLogoutPress: function() {
            this.logout();
        }
    });
});
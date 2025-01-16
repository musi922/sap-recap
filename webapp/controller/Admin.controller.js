sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("saprecap.controller.Admin", {
        onInit: function () {
            if (!this.checkRole("admin")) {
                return;
            }

            const oModel = this.getOwnerComponent().getModel("products");
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

        onEditPress: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("products");
            const oProduct = oContext.getObject();

            this._oEditContext = oContext;

            const dialog = this._getEditDialog();
            dialog.setModel(new sap.ui.model.json.JSONModel(oProduct));
            dialog.open();
        },

        _getEditDialog: function () {
            if (!this._oEditDialog) {
                this._oEditDialog = sap.ui.xmlfragment("saprecap.view.EditDialog", this);
                this.getView().addDependent(this._oEditDialog);
            }
            return this._oEditDialog;
        },

        onConfirmEdit: async function () {
            const oModel = this.getView().getModel("products");
            const oProduct = this._oEditDialog.getModel().getData();

            try {
                await oModel.update(`/Products('${oProduct.ProductId}')`, oProduct);
                this._oEditDialog.close();
                MessageToast.show("Product updated successfully.");
            } catch (error) {
                console.error("Error updating product:", error);
                MessageBox.error("Failed to update the product.");
            }
        },

        onCancelDialog: function () {
            this._oEditDialog.close();
        },

        onLogoutPress: function () {
            this.logout();
        }
    });
});

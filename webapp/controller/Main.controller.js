sap.ui.define([
    "./BaseController", 
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/odata/OperationMode"
], function (BaseController, MessageBox, JSONModel, ODataModel, Filter, FilterOperator, OperationMode) {
    "use strict";

    return BaseController.extend("saprecap.controller.Main", {
        onInit: function () {
            const oModel = new ODataModel({
                serviceUrl: "http://localhost:4000/odata/",
                synchronizationMode: "None",
                operationMode: OperationMode.Server
            });
            this.getView().setModel(oModel, "products");
            
            this._applyProductFilter();

          this.getRouter().getRoute("main").attachPatternMatched(this._onRouteMatched, this);
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

        OnNavigateToCart: function() {
            this.getRouter().navTo("cart");
        },
        onDeletePress: function(oEvent) {
            const oContext = oEvent.getSource().getBindingContext("products");
            const oProductId = oContext.getProperty("ProductId");
        
            MessageBox.confirm("Are you sure you want to delete this product?", {
                title: "Confirm Deletion",
                onClose: async (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        try {
                            const oModel = this.getView().getModel("products");
                            
                            await oModel.delete(`/Products('${oProductId}')`);
                            
                            this._applyProductFilter();
        
                            MessageBox.success("Product deleted successfully.");
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
            console.log(productData);
            
        
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
        onCancelDialog: function() {
            this.byId("editDiolog").close();
        }
        ,
        
        onConfirmEdit: async function() {
            const Name = this.byId("productName").getValue();
            const SupplierName = this.byId("supplierName").getValue();
            const Category = this.byId("category").getValue();
            const Rating = this.byId("rating").getValue();
            const Price = this.byId("price").getValue();
            const ProductId = this.byId("productId").getValue();
            const ProductPicUrl = this.byId("productPicUrl").getValue();
            const Availability = this.byId("availability").getValue();
           

            
            if (!this._oEditContext) {
                MessageBox.error("Product context is missing. Cannot update.");
                return;
            }
        
            const oProductId = this._oEditContext.getProperty("ProductId");
        
            try {
                const bodyProduct = JSON.stringify({
                    supplierName: SupplierName,
                    category: Category,
                    rating: Rating,
                    price: Price,
                    ProductId: ProductId,
                    productPicUrl: ProductPicUrl,
                    name: Name,
                    status: Availability
                });
        
                const response = await fetch(`http://localhost:4000/odata/Products('${oProductId}')`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: bodyProduct
                });
        
                if (response.ok) {
                    this.byId("editDiolog").close();
                    this._applyProductFilter();
                    MessageBox.success("Product updated successfully.");
                } else {
                    throw new Error(`Error: ${response.statusText}`);
                }
                    } catch (error) {
                console.error("Error updating product:", error);
                MessageBox.error("Failed to update the product.");
            }
        },
        onLiveSearch: function(oEvent) {
            let query = oEvent.getParameter("newValue");
            let list = this.byId("idProductsTable");
            let binding = list.getBinding("items");
        
            let aFilters = [];
        
            aFilters.push(new Filter("isInCart", FilterOperator.EQ, false));
        
            if (query) {
                let queryNumber = parseInt(query);
        
                if (!isNaN(queryNumber)) {
                    aFilters.push(
                        new Filter({
                            filters: [
                                new Filter("price", FilterOperator.EQ, queryNumber),
                            ],
                            and: false
                        })
                    );
                } else {
                    aFilters.push(
                        new Filter({
                            filters: [
                                new Filter("category", FilterOperator.Contains, query),
                                new Filter("ProductId", FilterOperator.Contains, query),
                                new Filter("name", FilterOperator.Contains, query),
                                new Filter("supplierName", FilterOperator.Contains, query),
                            ],
                            and: false
                        })
                    );
                }
            }
        
            binding.filter(aFilters);
        }
        
        
        
        
    });
});
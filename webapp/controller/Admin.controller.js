sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/odata/OperationMode",
    "sap/ui/model/json/JSONModel"
], function (BaseController, MessageBox, MessageToast, ODataModel, OperationMode,JSONModel) {
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

            this.oFlexibleColumnLayout = this.byId("flexibleColumnLayout");
            this.getRouter().getRoute("admin").attachPatternMatched(this._onRouteMatched, this);

            const usersModel = new JSONModel({
                Users:[]
            })
            this.getView().setModel(usersModel,"user")
        },

        _onRouteMatched: function() {
            this._updateFlexibleColumnLayout("OneColumn");
        },

        onProductItemPress: function(oEvent) {
            try {
                const oItem = oEvent.getSource();
                const oContext = oItem.getBindingContext("products");
                
                if (!oContext) {
                    console.error("No binding context found");
                    return;
                }

                const oProduct = oContext.getObject();
                
                if (!oProduct || !oProduct.ProductId) {
                    console.error("Product data or ProductId not found", oProduct);
                    return;
                }

                this._updateFlexibleColumnLayout("TwoColumnsMidExpanded");
                
                const oDetailView = this.byId("flexibleColumnLayout").getMidColumnPages()[0];
                if (oDetailView) {
                    oDetailView.bindElement({
                        path: `/Products('${oProduct.ProductId}')`,
                        model: "products"
                    });
                } else {
                    console.error("Detail view not found");
                }
            } catch (error) {
                console.error("Error in onProductItemPress:", error);
                MessageBox.error("Error displaying product details");
            }
        },

        _updateFlexibleColumnLayout: function(sLayout) {
            if (this.oFlexibleColumnLayout) {
                this.oFlexibleColumnLayout.setLayout(sLayout);
            }
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
        },
        onCreateUserDialog: function() {
            this.byId("createUserDialog").open(); 
        },
        onCancelCreate: function() {
            this.byId("createUserDialog").close();
            },

        onConfirmCreate: async function() {
            try {
                const username = this.byId("userName").getValue();
                const password = this.byId("passwor").getValue();
                const role = this.byId("role").getValue();

                if (!username || !password || !role) {
                    MessageBox.error("Please fill all fields")
                    return;
                }
                if (role !== 'user') {
                    MessageBox.error("Role must be user")
                    return
                }
            const userData  = JSON.parse(localStorage.getItem("user"))
            if (!userData || !userData.token) {
                throw new Error("Authontication is missing")
                
            }

            const response = await fetch('http://localhost:4000/odata/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    role: role
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.statusText}`);
            }
            MessageBox.success("User created successfully", {
                onClose: () => {
                    this.byId("createUserDialog").close();
                    this.byId("userName").setValue("");
                    this.byId("passwor").setValue("");
                    this.byId("role").setValue("");
                }
            });
        }
        catch (error){
            console.log("there was error while create a user", error);
            MessageBox.error(error.message || "failed to create user")
            
        }},
        onUserDialogShow: async function(){
            try {
                await this.loadUsers()
                this.byId("usersListDialog").open()
                
            } catch (error) {
                console.log("failed to load users", error);
                MessageBox.error(error || "failed to load data")
                
            }
        },
        loadUsers: async function () {
            try {
                const userData = JSON.parse(localStorage.getItem("user"))
            if (!userData || !userData.token) {
                throw new Error("Authentication token is missing");
            }   

            const response = await fetch("http://localhost:4000/odata/Users",{
                method: 'Get',
                headers:{
                    'Authorization': `Bearer ${userData.token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.statusText}`);
            }

            const data = await response.json()
            console.log("Data",data);
            
            const usersModel = this.getView().getModel("user")
            console.log(usersModel);
            
            
            usersModel.setProperty("/Users", data.value)
            } catch (error) {
                console.error("Error loading users:", error);
                throw error;
            }         
        }
        ,
        onCloseUsersDialog: function(){
            this.byId("usersListDialog").close()
        }
    });
});
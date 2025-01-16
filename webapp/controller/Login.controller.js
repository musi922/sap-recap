sap.ui.define([
    "./BaseController", 
    "sap/ui/model/json/JSONModel"
], function (BaseController,JSONModel) {
    "use strict";

    return BaseController.extend("saprecap.controller.About", {
        onLogin: async function () {
            const username = this.byId("username").getValue();
            const password = this.byId("password").getValue();
        
            try {
                const response = await fetch("http://localhost:4000/odata/login", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password }),
                });
        
                if (response.ok) {
                    const userData = await response.json();
                    // Store the token and role
                    localStorage.setItem("user", JSON.stringify({
                        token: userData.token,
                        role: userData.role
                    }));
        
                    if (userData.role === "admin") {
                        this.getRouter().navTo("admin");
                    } else {
                        this.getRouter().navTo("main");
                    }
                } else {
                    sap.m.MessageToast.show("Login failed");
                }
            } catch (error) {
                console.error("Login error:", error);
                sap.m.MessageToast.show("Login failed");
            }
        }
        
        
        
    });
});
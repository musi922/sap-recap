sap.ui.define([
    "./BaseController", 
    "sap/ui/model/json/JSONModel"
], function (BaseController,JSONModel) {
    "use strict";

    return BaseController.extend("saprecap.controller.About", {
        onLogin: async function () {
            const username = this.byId("username").getValue();
            const password = this.byId("password").getValue();
        
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
        
            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem("user", JSON.stringify(userData));
                const role = userData.role;
        
                if (role === "admin") {
                    this.getRouter().navTo("admin");
                } else {
                    this.getRouter().navTo("main");
                }
            } else {
                sap.m.MessageToast.show("Login failed");
            }
        }
        
        
        
    });
});
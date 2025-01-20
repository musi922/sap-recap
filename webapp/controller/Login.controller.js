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
                    console.log("Login Response:", userData);
                    
                    if (!userData.role) {
                        console.error("No role received from server");
                        sap.m.MessageToast.show("Server error: No role assigned");
                        return;
                    }
                    localStorage.removeItem("user");
                    localStorage.setItem("user", JSON.stringify({
                        token: userData.token,
                        role: userData.role
                    }));
        
                    if (userData.role === "admin") {
                        this.getRouter().navTo("admin");
                    } else if (userData.role === "user") {
                        this.getRouter().navTo("main");
                    } else {
                        console.error("Unexpected role:", userData.role);
                        sap.m.MessageToast.show("Invalid user role");
                    }
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error("Login failed:", errorData);
                    sap.m.MessageToast.show(errorData.message || "Login failed");
                }
            } catch (error) {
                console.error("Login error:", error);
                sap.m.MessageToast.show("Login failed");
            }
        }
        
        
    });
});
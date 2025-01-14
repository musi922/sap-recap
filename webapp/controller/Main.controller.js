sap.ui.define(["./BaseController", "sap/m/MessageBox"], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("saprecap.controller.Main", {
		sayHello: function () {
			MessageBox.show("Hello World!");
		},
		onButtonPress: function(){
			MessageBox.show("Hello World!");
			console.log("Ddddd");
			
		}
	});
});

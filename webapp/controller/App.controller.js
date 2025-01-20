sap.ui.define(["./BaseController"], function (BaseController) {
	"use strict";

	return BaseController.extend("saprecap.controller.App", {
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});
});

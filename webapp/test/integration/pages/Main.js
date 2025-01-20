sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/actions/Press"], function (Opa5, Press) {
	"use strict";

	Opa5.createPageObjects({
		onTheMainPage: {
			actions: {
				iPressTheSayHelloButton: function () {
					return this.waitFor({
						id: "helloButton",
						viewName: "saprecap.view.Main",
						actions: new Press(),
						errorMessage: "Did not find the 'Say Hello With Dialog' button on the App view"
					});
				},

				iPressTheOkButtonInTheDialog: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						viewName: "saprecap.view.Main",
						actions: new Press(),
						errorMessage: "Did not find the 'OK' button in the Dialog"
					});
				}
			},

			assertions: {
				iShouldSeeTheHelloDialog: function () {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						success: function () {
							Opa5.assert.ok(true, "The dialog is open");
						},
						errorMessage: "Did not find the dialog control"
					});
				},

				iShouldNotSeeTheHelloDialog: function () {
					return this.waitFor({
						controlType: "sap.m.App",
						check: function () {
							return document.querySelectorAll(".sapMDialog").length === 0;
						},
						success: function () {
							Opa5.assert.ok(true, "No dialog is open");
						}
					});
				}
			}
		}
	});
});

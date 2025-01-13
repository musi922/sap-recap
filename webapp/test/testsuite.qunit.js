sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: saprecap",
		defaults: {
			page: "ui5://test-resources/saprecap/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "saprecap/",
				never: "test-resources/saprecap/"
			},
			loader: {
				paths: {
					"saprecap": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for saprecap"
			},
			"integration/opaTests": {
				title: "Integration tests for saprecap"
			}
		}
	};
});

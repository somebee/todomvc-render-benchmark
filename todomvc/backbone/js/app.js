/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

$(function () {
	'use strict';

	// Drop localStorage for benchmarks
	Backbone.sync = function () {};

	// kick things off by creating the `App`
	API.AppView = new app.AppView();
	API.AppView.render();
	API.isReady = true;
});

'use strict';

var KEY = 'todos-riotjs';
window.todoStorage = {
	get: function () {
		return JSON.parse(localStorage.getItem(KEY) || '[]');
	},
	put: function (todos) {
		localStorage.setItem(KEY, JSON.stringify(todos));
	}
};

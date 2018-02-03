
Manager = {
	_apps: [],
	_suites: []
};

Manager.add = function (suite){
	return this._suites.push(suite);
};

Manager.suites = function (){
	return this._suites;
};

Manager.chart = function (series){
	if (this._chart) {
		this._chart.addSeries(series);
		return this._chart;
	};
	
	var categories = this._suites.map(function(suite) { return suite.option('label'); });
	
	return this._chart = new Highcharts.Chart({
		chart: {type: 'bar',renderTo: 'chart'},
		title: {text: "Results"},
		loading: {showDuration: 50},
		xAxis: {
			categories: [] // categories
		},
		
		yAxis: {
			min: 0,
			title: {text: 'ops / sec (higher is better)'}
		},
		
		tooltip: {
			pointFormatter: function(v) { return ("" + (this.category) + " <b>") + this.y.toFixed(2) + "</b> ops/sec<br>"; },
			shared: true
		},
		
		plotOptions: {bar: {dataLabels: {enabled: false}}},
		credits: {enabled: false},
		series: [series]
	});
};

function div(cls,text){
	var el = document.createElement('div');
	el.className = cls || '';
	el.textContent = text || '';
	return el;
};

function Framework(name,o){
	if(o === undefined) o = {};
	dict[name] = this;
	all.push(this);
	this._name = name;
	this._title = o.title || name;
	this._options = o;
	this._ready = false;
};

var dict = {};
var all = [];

Framework.get = function (name){
	return dict[name];
};

Framework.map = function (fn){
	return all.map(fn);
};

Framework.count = function (){
	return all.length;
};

Framework.build = function (){
	return this._build || (this._build = Promise.reduce(all,function(curr,next) {
		return curr.build().then(function() {
			return Promise.delay(10).then(function() { return next.build(); });
		});
	}));
};

Framework.prototype.name = function (){
	return this._name;
};
Framework.prototype.title = function (){
	return this._title;
};
Framework.prototype.color = function (){
	return this._options.color || 'red';
};
Framework.prototype.url = function (){
	return this._options.url || ("todomvc/" + (this._name) + "/" + (this._options.index || 'index.html'));
};

Framework.prototype.node = function (){
	return this._node || (this._node = div());
};

Framework.prototype.iframe = function (){
	return this._iframe || (this._iframe = document.createElement('iframe'));
};
Framework.prototype.doc = function (){
	return this._iframe.contentDocument;
};
Framework.prototype.win = function (){
	return this._win || (this._win = this._iframe.contentWindow);
};
Framework.prototype.api = function (){
	return this._api || (this._api = this._iframe.contentWindow.API);
};

Framework.prototype.build = function (){
	var self = this;
	return self._build || (self._build = new Promise(function(resolve) {
		self.iframe().style.minHeight = '400px';
		self.iframe().src = self.url();
		self.iframe().id = ("" + (self._name) + "_frame");
		
		var wait = function() {
			if (self.doc().querySelector('#header h1,.header h1') && self.api().RENDERCOUNT > 0) {
				self.api().ready();
				self.prepare();
				
				return resolve(self);
			};
			console.log("not ready yet");
			return setTimeout(wait,10);
		};
		
		self.iframe().onload = wait;
		window.apps.appendChild(self.node());
		self.node().appendChild(self._header = div('header',self.title()));
		return self.node().appendChild(self.iframe());
	}));
};

Framework.prototype.prepare = function (){
	return this.reset(6);
};

Framework.prototype.reset = function (count){
	this.api().AUTORENDER = false;
	for (let len = count, i = 1, rd = len - i; (rd > 0) ? (i <= len) : (i >= len); (rd > 0) ? (i++) : (i--)) {
		this.api().addTodo(("Todo " + i));
	};
	this._todoCount = count;
	this.api().render(true);
	this.api().AUTORENDER = true;
	return this;
};

Framework.prototype.deactivate = function (){
	return this.node().classList.remove('running');
};

Framework.prototype.activate = function (){
	return this.node().classList.add('running');
};

Framework.prototype.setStatus = function (status){
	this._header.textContent = status;
	this;
	return this;
};


function Bench(o){
	var self = this;
	if(o === undefined) o = {};
	self._name = o.title;
	self._suite = new Benchmark.Suite(self._name);
	self._options = o;
	self._step = -1;
	self._current = null;
	self._benchmarks = [];
	
	if (o.step instanceof Function) {
		Framework.map(function(app) {
			self._suite.add(app.name(),o.step);
			var bm = self._suite[self._suite.length - 1];
			bm.App = app;
			return self._benchmarks.push(bm);
		});
	};
	
	console.log(self._suite);
	Manager.add(self);
	self.bind();
	self;
};

Bench.prototype.option = function (key){
	return this._options[key];
};

Bench.prototype.step = function (idx){
	this._step = idx;
	if (this._current) {
		this._current.App.deactivate();
	};
	
	if (this._current = this._benchmarks[idx]) {
		this._current.App.activate();
	};
	return this;
};


Bench.prototype.bind = function (){
	
	var self = this;
	self._suite.on('start',function(e) {
		console.log("start");
		document.body.classList.add('running');
		
		Framework.map(function(ex) {
			ex.api().FULLRENDER = true;
			ex.api().RENDERCOUNT = -1;
			return ex.api().render(true);
		});
		self.step(0);
		return;
	});
	
	self._suite.on('reset',function(e) {
		console.log('suite onReset');
		return;
	});
	
	self._suite.on('cycle',function(event) {
		console.log("cycle!");
		Framework.get(event.target.name).setStatus(String(event.target));
		self.step(self._step + 1);
		return;
	});
	
	return self._suite.on('complete',function() {
		console.log('Fastest is ' + this.filter('fastest').pluck('name'));
		document.body.classList.remove('running');
		self.present();
		return;
	});
};

Bench.prototype.run = function (){
	var self = this;
	return Framework.build().then(function() { return self._suite.run({async: true,queued: false}); });
};

Bench.prototype.reset = function (){
	Framework.map(function(ex) {
		ex.api().FULLRENDER = true;
		ex.api().RENDERCOUNT = -1;
		return ex.api().render(true);
	});
	return this;
};

Bench.prototype.warmup = function (times){
	var self = this;
	if(times === undefined) times = 1000;
	self.reset();
	setTimeout(function() {
		
		var fn = self._options.step;
		var apps = Framework.map(function(app) { return app; });
		var step = function() {
			var app;
			if (app = apps.shift()) {
				var i = 0;
				var bm = {App: app};
				var start = new Date();
				while (i++ < times){
					fn.call(bm);
				};
				var elapsed = new Date() - start;
				app.setStatus(("" + (app.title()) + " - " + (self._name) + " - " + times + " iterations - " + elapsed + "ms"));
				return setTimeout(function() { return step(); },50);
			};
		};
		
		return step();
	},50);
	
	return self;
};


Bench.prototype.present = function (){
	var el = div('chart');
	window.analysis.appendChild(el);
	
	// find slowest
	var sorted = this._benchmarks.slice().sort(function(a,b) { return a.hz - b.hz; });
	var base = sorted[0].hz;
	var series = this._benchmarks.map(function(b) { return {type: 'bar',borderWidth: 0,name: b.App.title(),data: [b.hz]}; });
	
	return this._chart = new Highcharts.Chart({
		chart: {type: 'bar',renderTo: el},
		title: {text: this.option('title'),style: {fontSize: "14px"}},
		loading: {showDuration: 0},
		
		xAxis: {
			categories: [this.option('title')],
			tickColor: 'transparent',
			labels: {enabled: false}
		},
		
		yAxis: {min: 0,title: {text: 'ops / sec (higher is better)'}},
		
		tooltip: {
			pointFormatter: function(v) { return "<b>" + this.y.toFixed(2) + ("</b> ops/sec (<b>" + (this.y / base).toFixed(2) + "x</b>)<br>"); }
		},
		
		legend: {verticalAlign: 'top',y: 20},
		plotOptions: {bar: {dataLabels: {enabled: true,formatter: function(v) { return ("<b>" + (this.y / base).toFixed(2) + "x</b>"); }}}},
		credits: {enabled: false},
		series: series.reverse()
	});
};


new Framework('imba-1.3.0',{title: 'imba@1.3.0'});
new Framework('react-16',{title: 'react@16 (production.min)'});
new Framework('react-16',{title: 'react@16 (development)',index: "index.dev.html"});
// Framework.new('imba-1.2.1', title: 'imba v1.2.1')
// Framework.new('imba-1.0.0', title: 'imba v1.0.0')
// Framework.new('imba-0.14.3', title: 'imba v0.14.3')
// Framework.new('react-15.5.4', title: 'react v15.5.4')


EVERYTHING = new Bench(
	{label: 'Bench Everything',
	title: 'Everything (remove, toggle, append, rename)',
	step: function() {
		var len = this.App._todoCount;
		var api = this.App.api();
		var idx = Math.round(Math.random() * (len - 1));
		
		// moving a random task
		idx = api.RENDERCOUNT % len;
		idx = Math.min(0,len - 2);
		var todo = api.removeTodoAtIndex(idx);
		api.insertTodoAtIndex(todo,1000);
		
		api.render(true);
		api.toggleTodoAtIndex((idx) % len);
		api.render(true);
		api.renameTodoAtIndex((idx + 1) % len,("Todo - " + (api.RENDERCOUNT)));
		api.render(true);
		return;
	}}
);

new Bench(
	{label: 'Reorder',
	title: 'Reorder (shift+push)',
	step: function() {
		var api = this.App.api();
		var todo = api.removeTodoAtIndex(0);
		api.render(true);
		api.insertTodoAtIndex(todo,1000); // at the end
		api.render(true);
		return;
	}}
);

// full rendering including todo-renaming
new Bench(
	{label: 'Rename todo',
	title: 'Rename random todo',
	step: function() {
		var api = this.App.api();
		var i = 0;
		var c = api.RENDERCOUNT;
		var idx = Math.round(Math.random() * (this.App._todoCount - 1));
		api.renameTodoAtIndex(idx,("Todo " + (idx + 1) + " " + c),false);
		api.render(true); // render at the very end
		return;
	}}
);

new Bench(
	{label: 'Toggle todo',
	title: 'Toggle random todo',
	step: function() {
		var api = this.App.api();
		var idx = Math.round(Math.random() * (this.App._todoCount - 1));
		api.toggleTodoAtIndex(idx);
		api.render(true);
		return;
	}}
);


// full rendering
new Bench(
	{label: 'Unchanged render',
	title: 'Unchanged render',
	step: function() { return this.App.api().render(true); }}
);


Manager.suites().map(function(suite) {
	var btn = document.createElement('button');
	btn.textContent = suite.option('label');
	btn.onclick = function() {
		btn.disabled = "disabled";
		return suite.run();
	};
	return window.controls.appendChild(btn);
});


// window:runFullRender:onclick = do full.run
// Suites.fullRender.run({ async: true, queued: false })

window.apps.setAttribute("data-count",Framework.count());

Framework.build().then(function(res) {
	console.log("built",res);
	return Promise.delay(200).then(function() {
		return document.getElementsByTagName('button')[0].focus();
	});
});

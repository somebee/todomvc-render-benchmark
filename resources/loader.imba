
Manager =
	_apps: []
	_suites: []

def Manager.add suite
	@suites.push(suite)

def Manager.suites
	@suites

def Manager.chart series
	if @chart
		@chart.addSeries(series)
		return @chart

	var categories = @suites.map(|suite| suite.option('label') )

	@chart = Highcharts.Chart.new({
		chart: { type: 'bar', renderTo: 'chart' }
		title: { text: "Results" }
		loading: {showDuration: 50 }
		xAxis:
			categories: [] # categories

		yAxis:
			min: 0
			title: { text: 'ops / sec (higher is better)'}

		tooltip:
			pointFormatter: do |v| "{this:category} <b>" + this:y.toFixed(2) + "</b> ops/sec<br>"
			shared: true

		plotOptions: {bar: {dataLabels: { enabled: false}}}
		credits: { enabled: false }
		series: [series]
	})

def div cls, text
	var el = document.createElement('div')
	el:className = cls or ''
	el:textContent = text or ''
	return el

class Framework

	var dict = {}
	var all = []

	def self.get name
		dict[name]

	def self.map fn
		all.map(fn)

	def self.count
		all:length

	def self.build
		@build ||= Promise.reduce(all) do |curr,next|
			curr.build.then do 
				Promise.delay(10).then do next.build

	def initialize name, o = {}
		dict[name] = self
		all.push(self)
		@name = name
		@title = o:title or name
		@options = o
		@ready = false

	def name do @name
	def title do @title
	def color do @options:color or 'red'
	def url do @options:url || "todomvc/{@name}/{@options:index or 'index.html'}"

	def node
		@node ||= div()

	def iframe do @iframe ||= document.createElement('iframe')
	def doc do @iframe:contentDocument
	def win do @win ||= @iframe:contentWindow
	def api do @api ||= @iframe:contentWindow.API

	def build
		@build ||= Promise.new do |resolve|
			iframe:style:minHeight = '400px'
			iframe:src = url
			iframe:id = "{@name}_frame"

			var wait = do
				if doc.querySelector('#header h1,.header h1') && api.RENDERCOUNT > 0
					api.ready
					prepare

					return resolve(self)
				console.log "not ready yet"
				setTimeout(wait,10)

			iframe:onload = wait
			window:apps.appendChild(node)
			node.appendChild(@header = div('header',title))
			node.appendChild(iframe)

	def prepare
		reset(6)

	def reset count
		api.AUTORENDER = no
		api.addTodo(("Todo " + i)) for i in [1..count]
		@todoCount = count
		api.render(true)
		api.AUTORENDER = yes
		self

	def deactivate
		node:classList.remove('running')

	def activate
		node:classList.add('running')

	def status= status
		@header:textContent = status
		self


class Bench

	def option key
		@options[key]

	def initialize o = {}
		@name = o:title
		@suite = Benchmark.Suite.new @name
		@options = o
		@step = -1
		@current = null
		@benchmarks = []

		if o:step isa Function
			Framework.map do |app|
				@suite.add(app.name, o:step)
				var bm = @suite[@suite:length - 1]
				bm.App = app
				@benchmarks.push(bm)

		console.log @suite
		Manager.add self
		bind
		self

	def step idx
		@step = idx
		if @current
			@current.App.deactivate

		if @current = @benchmarks[idx]
			@current.App.activate
		self
	

	def bind

		@suite.on 'start' do |e|
			console.log "start"
			document:body:classList.add('running')

			Framework.map do |ex|
				ex.api.FULLRENDER = yes
				ex.api.RENDERCOUNT = -1
				ex.api.render(yes)
			step(0)
			return

		@suite.on 'reset' do |e|
			console.log 'suite onReset'
			return

		@suite.on 'cycle' do |event|
			console.log "cycle!"
			Framework.get(event:target:name).status = String(event:target)
			step(@step + 1)
			return
	
		@suite.on 'complete' do
			console.log('Fastest is ' + this.filter('fastest').pluck('name'))
			document:body:classList.remove('running')
			present
			return

	def run
		Framework.build.then do @suite.run { async: true, queued: false }

	def reset
		Framework.map do |ex|
			ex.api.FULLRENDER = yes
			ex.api.RENDERCOUNT = -1
			ex.api.render(yes)
		self
		
	def warmup times = 1000
		reset
		setTimeout(&,50) do

			var fn = @options:step
			var apps = Framework.map do |app| app
			var step = do
				if var app = apps.shift
					var i = 0
					var bm = {App: app}
					var start = Date.new
					while i++ < times
						fn.call(bm)
					var elapsed = Date.new - start
					app.status = "{app.title} - {@name} - {times} iterations - {elapsed}ms"
					setTimeout(&,50) do step()

			step()

		return self
		

	def present
		var el = div('chart')
		window:analysis.appendChild(el)

		# find slowest
		var sorted = @benchmarks.slice.sort do |a,b| a:hz - b:hz
		var base = sorted[0][:hz]
		var series =  @benchmarks.map do |b| {type: 'bar', borderWidth: 0, name: b.App.title, data: [b:hz] }

		@chart = Highcharts.Chart.new({
			chart: { type: 'bar', renderTo: el }
			title: {text: option('title'), style: {fontSize: "14px"}}
			loading: {showDuration: 0}

			xAxis:
				categories: [option('title')]
				tickColor: 'transparent'
				labels: { enabled: false }

			yAxis: {min: 0, title: { text: 'ops / sec (higher is better)'}}

			tooltip:
				pointFormatter: do |v| "<b>" + this:y.toFixed(2) + "</b> ops/sec (<b>{(this:y / base).toFixed(2)}x</b>)<br>"

			legend: {verticalAlign: 'top', y: 20}
			plotOptions: {bar: {dataLabels: { enabled: true, formatter: (|v| "<b>{(this:y / base).toFixed(2)}x</b>") }}}
			credits: { enabled: false }
			series: series.reverse
		})


Framework.new('imba-1.3.0', title: 'imba@1.3.0')
Framework.new('react-16', title: 'react@16 (production.min)')
Framework.new('react-16', title: 'react@16 (development)', index: "index.dev.html")
# Framework.new('imba-1.2.1', title: 'imba v1.2.1')
# Framework.new('imba-1.0.0', title: 'imba v1.0.0')
# Framework.new('imba-0.14.3', title: 'imba v0.14.3')
# Framework.new('react-15.5.4', title: 'react v15.5.4')


EVERYTHING = Bench.new
	label: 'Bench Everything'
	title: 'Everything (remove, toggle, append, rename)'
	step: do
		var len = this.App.@todoCount
		var api = this.App.api
		var idx = Math.round(Math.random * (len - 1))

		# moving a random task
		var idx = api.RENDERCOUNT % len
		var idx = Math.min(0,len - 2)
		var todo = api.removeTodoAtIndex(idx)
		api.insertTodoAtIndex(todo,1000)

		api.render(yes)
		api.toggleTodoAtIndex((idx) % len)
		api.render(yes)
		api.renameTodoAtIndex((idx + 1) % len,"Todo - {api.RENDERCOUNT}")
		api.render(yes)
		return

Bench.new
	label: 'Reorder'
	title: 'Reorder (shift+push)'
	step: do
		var api  = this.App.api
		var todo = api.removeTodoAtIndex(0)
		api.render(true)
		api.insertTodoAtIndex(todo,1000) # at the end
		api.render(true)
		return

# full rendering including todo-renaming
Bench.new
	label: 'Rename todo'
	title: 'Rename random todo'
	step: do
		var api = this.App.api
		var i = 0
		var c = api.RENDERCOUNT
		var idx = Math.round(Math.random * (this.App.@todoCount - 1))
		api.renameTodoAtIndex(idx,"Todo {idx + 1} {c}",no)
		api.render(true) # render at the very end
		return

Bench.new
	label: 'Toggle todo'
	title: 'Toggle random todo'
	step: do
		var api  = this.App.api
		var idx = Math.round(Math.random * (this.App.@todoCount - 1))
		api.toggleTodoAtIndex(idx)
		api.render(true)
		return


# full rendering
Bench.new
	label: 'Unchanged render'
	title: 'Unchanged render'
	step: do this.App.api.render(yes)


Manager.suites.map do |suite|
	var btn = document.createElement('button')
	btn:textContent = suite.option('label')
	btn:onclick = do
		btn:disabled = "disabled"
		suite.run
	window:controls.appendChild(btn)


# window:runFullRender:onclick = do full.run
# Suites.fullRender.run({ async: true, queued: false })

window:apps.setAttribute("data-count",Framework.count)

Framework.build.then do |res| 
	console.log "built",res
	Promise.delay(200).then do
		document.getElementsByTagName('button')[0].focus

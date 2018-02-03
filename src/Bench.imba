
extern Benchmark

export class Bench
	
	prop name
	prop apps
	prop state
	prop suite
	prop results
	
	def option key
		@options[key]

	def initialize o, apps
		@options = o
		@name = o:title
		
		@step = -1
		@current = null
		@benchmarks = []
		@apps = apps
		@count = @options:count or 6
		
		var fn = do
			var api = this:app.api
			o:step.call(this,api,api.RENDERCOUNT)
			return
		
		# let fn = o:step
		# @i = 0
		# @fn = do fn(@i++,this:app
		window.S = @suite = Benchmark.Suite.new(@name)
		# add each benchmark
		apps.map do |app| @suite.add(app.name, fn, app: app)

		console.log @suite
		bind
		self

	def step idx
		@step = idx
		if @current
			@current:app.deactivate

		if @current = @suite[idx]
			@current:app.activate
		self
		
	def currentApp
		@apps[@step]

	def bind
		@suite.on 'start' do |e|
			console.log "start"
			document:body:classList.add('running')
			
			apps.map do |app|
				# app.api.FULLRENDER = yes
				# app.api.RENDERCOUNT = -1
				# app.api.render(yes)
				console.log "reset!"
				app.reset(@count)
				
			step(0)
			Imba.commit
			return

		@suite.on 'reset' do |e|
			console.log 'suite onReset'
			Imba.commit
			return

		@suite.on 'cycle' do |event|
			console.log "cycle!"
			currentApp.status = String(event:target)
			currentApp.api.AUTORENDER = yes
			step(@step + 1)
			Imba.commit
			return
	
		@suite.on 'complete' do
			console.log('Fastest is ' + this.filter('fastest').pluck('name'))
			document:body:classList.remove('running')
			# present
			Imba.commit
			return

	def run
		Promise.all(apps.map(|app| app.build)).then do
			console.log "ready to run!"
			@suite.run { async: true, queued: false }

	def reset
		apps.map do |app| app.reset(@count)
		self
		
	def warmup times = 1000
		reset
		
		var fn = @options:step
		var nr = 0
		
		var step = do
			var app = apps[nr++]
			return unless app
			var i = 0
			var bm = {app: app}
			var start = Date.new
			console.log "render times",app.api.RENDERCOUNT
			while i++ < times
				fn.call(bm,app.api,app.api.RENDERCOUNT)
			var elapsed = Date.new - start
			app.api.AUTORENDER = yes
			app.status = "{app.title} - {@name} - {times} iterations - {elapsed}ms"
			setTimeout(step,100)
		setTimeout(step,100)
		return self

	def present
		@results = <div.chart>
		# find slowest
		var sorted = @benchmarks.slice.sort do |a,b| a:hz - b:hz
		var base = sorted[0][:hz]
		var series =  @benchmarks.map do |b| {type: 'bar', borderWidth: 0, name: b.App.title, data: [b:hz] }
		@series = series.reverse

		@chart = Highcharts.Chart.new({
			chart: { type: 'bar', renderTo: @results.dom }
			title: {text: option('title'), style: {fontSize: "12px"}}
			loading: {showDuration: 0}

			xAxis:
				categories: [option('title')]
				tickColor: 'transparent'
				labels: { enabled: false }

			yAxis: {min: 0, title: { text: 'ops/sec'}}

			tooltip:
				pointFormatter: do |v| "<b>" + this:y.toFixed(2) + "</b> ops/sec (<b>{(this:y / base).toFixed(2)}x</b>)<br>"

			legend: {verticalAlign: 'top', y: 20}
			plotOptions: {bar: {dataLabels: { enabled: true, formatter: (|v| "<b>{(this:y / base).toFixed(2)}x</b>") }}}
			credits: { enabled: false }
			series: series
		})
extern Highcharts


import {Bench} from './Bench.imba'
import {Framework} from './Framework'

var store = {
	runs: []
}

var apps = [
	{name: 'imba@1.3.0', path: "imba-1.3.0/index.html", color: '#709CB2', libSize: '49kb'}
	{name: 'vue@2.5.13', path: "vue-2.5/index.html", color: '#4fc08d', libSize: '87kb'}
	{name: 'react@16.prod', path: "react-16/index.html", color: 'rgb(15, 203, 255)', libSize: '101kb'}
	{name: 'react@16.dev', path: "react-16/index.dev.html", color: 'rgb(15, 203, 255)'}
].map do |options| Framework.new(options)

var tests = {}

		
		
tests:main =
	label: 'Main'
	title: 'remove,add,rename,toggle'
	step: do |app,i|
		var count = app.@todoCount
		var idx = i % count
		var action = i % 5
		var cycle = Math.floor(i / 5)
		# console.log(i,idx,action)
		
		switch action
			when 0 # remove remove first item
				app.removeTodoAtIndex(0)
			when 1 # insert again
				# append an item
				app.addTodo("Added {cycle}")
				# app.insertTodoAtIndex(this:todo,cycle % count)
			when 2 # rename todo
				app.renameTodoAtIndex((cycle + 2) % count,"Todo - {i}")
			when 3 # toggle todo
				app.toggleTodoAtIndex(cycle % count)
			when 4 # no changes to data
				yes

		app.forceUpdate(yes)
		return

tag App
	
	prop bench

	def count
		parseInt(@itemcount.value)
		
	def run
		var bench = tests:main
		bench:count = count
		bench:title = "{count} todos"
		store:runs.push(store:run = Bench.new(bench, apps))
		store:run.run
		
	def reset
		for app in apps
			app.reset(count)
		self
		
	def step times = 100
		
		for app in apps
			let i = times
			app.api.AUTORENDER = no
			while i > 0
				tests:main:step(app.api,app.api:store:counter)
				i--
			app.api.AUTORENDER = yes
		self

	def render
		<self.benchmark>
			<header#header>
				<input@itemcount type="number" value="6">
				<span> "todos "
				<button :tap='reset'> "reset"
				<button :tap.alt=['step',1] :tap=['step',13]> "step"
				<span.flex>
				<button :tap='run'> "Run benchmark"

			<section.apps>
				for app in apps
					app.node
			<section.runs>
				<div#chart>

Imba.mount <App>

# Imba.mount <div.benchmark ->
# 	<header#header>
# 		<input#itemcount type="number" value="6">
# 		<span> "todos "
# 		<button :tap=[run,tests:main]> "Run"
# 		<button :tap=reset> "reset"
# 		<button :tap=step> "step"
# 
# 	<section.apps>
# 		for app in apps
# 			app.node
# 	<section.runs>
# 		<div#chart>
			
	

# var chart = Highcharts.chart('chart',{
# 	type: 'bar'
# 	# title: {text: option('title'), style: {fontSize: "12px"}}
# 	loading: {showDuration: 0}
# 
# 	xAxis:
# 		categories: [option('title')]
# 		tickColor: 'transparent'
# 		labels: { enabled: false }
# 
# 	yAxis: {min: 0, title: { text: 'ops/sec'}}
# 
# 	tooltip:
# 		pointFormatter: do |v| "<b>" + this:y.toFixed(2) + "</b> ops/sec (<b>{(this:y / base).toFixed(2)}x</b>)<br>"
# 
# 	legend: {verticalAlign: 'top', y: 20}
# 	plotOptions: {bar: {dataLabels: { enabled: true, formatter: (|v| "<b>{(this:y / base).toFixed(2)}x</b>") }}}
# 	credits: { enabled: false }
# 	series: []
# })

# Manager.suites.map do |suite|
# 	var btn = document.createElement('button')
# 	btn:textContent = suite.option('label')
# 	btn:onclick = do
# 		btn:disabled = "disabled"
# 		suite.run
# 	window:controls.appendChild(btn)# 
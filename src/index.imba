extern Highcharts


import {Bench} from './Bench.imba'
import {Framework} from './Framework'

var store = {
	runs: []
}

var apps = [
	{name: 'imba@1.3.0', path: "imba-1.3.0/index.html"}
	# {name: 'imba@1.0.0', path: "imba-1.0.0/index.html"}
	{name: 'react@16.prod', path: "react-16/index.html"}
	{name: 'react@16.dev', path: "react-16/index.dev.html"}
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

		app.render(yes)
		return



class Chart
	def initialize id
		@series = apps.map do |app| {type: 'bar', borderWidth: 0, name: app.name, data: []}
		
		@categories = apps.map do |app| app.name
			
		var k = do |val|
			return Math.round(val)
			Math.round(val / 1000) + 'k'

		var options = 
			type: 'bar'
			animation: false,
			chart: {
				type: 'bar',
				renderTo: document.getElementById(id),
				animation: false,
				title: null
			}
			loading: {showDuration: 0}
			xAxis: {id: 'cats', categories: @categories, tickColor: 'transparent', labels: { enabled: true }}
			yAxis: {min: 0, title: { text: 'ops/sec'}}
			tooltip:
				pointFormatter: do |v| "<b>{k(this:y)}/s</b><br>" #  (<b>{(this:y / base).toFixed(2)}x</b>)
			plotOptions: {bar: {dataLabels: { enabled: true, formatter: (|v| "<b>{k(this:y)}/s</b>") }}}
			credits: { enabled: false }
			series: []

		# @categories = []
		@suites = []
		@chart = window.C = Highcharts.Chart.new(options)
		
	def add suite
		let nr = @suites.push(suite)
		if true
			var points = for bm in suite.suite
				bm:hz
			var series = {type: 'bar', borderWidth: 0, name: suite.name, data: points}
			@chart.addSeries(series)


var chart
var run = do |bench, times|
	console.log "run test!!"
	var count = parseInt(#itemcount.value)
	bench:count = count
	bench:title = "{count} todos"
	store:runs.push(store:run = Bench.new(bench, apps))
	store:run.suite.on('complete') do
		console.log "completede benchmark!"
		chart ||= Chart.new('chart')
		chart.add(store:run)
	
	if times isa Number
		store:run.warmup(times)
	else
		store:run.run
		
var step = do |times|
	for app in apps
		app.api.AUTORENDER = no
		tests:main:step(app.api,app.api.RENDERCOUNT)
		app.api.AUTORENDER = yes
	return
	
var reset = do
	for app in apps
		app.reset(parseInt(#itemcount.value))


Imba.mount <div ->
	<header#header>
		<input#itemcount type="number" value="6">
		for own name, desc of tests
			<button :tap=[run,desc]> name
			<button :tap=[run,desc,19234]> "warmup"
		<button :tap=step> "step"
		<button :tap=reset> "reset"
	<section.apps>
		for app in apps
			app.node
	<section.runs>
		<div#chart>
			
	

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

import Store from './store'
Todos = Store.new('imba-todos')

import Todo from './todo'

var ENTER_KEY = 13

tag App

	def hash
		@hash

	def model
		@model

	def build
		@model = Todos
		@model.load
		@model.subscribe do render
		window.addEventListener 'hashchange' do
			@hash = window:location:hash
			render
		render
		self

	def onkeydown e
		return unless e.which == ENTER_KEY

		if let value = e.target.value.trim
			model.addTodo(value)
			e.target.value = ""


	def toggleAll e
		model.toggleAll e.target.checked
	
	# remove all completed todos
	def clearCompleted
		@toggler.checked = no
		model.clearCompleted

	def list items
		for todo,i in items
			<Todo[todo]>

	def render
		API.RENDERCOUNT++

		var all    = Todos.@items
		var items  = all
		var done   = []
		var active = []

		for todo in all
			todo:completed ? done.push(todo) : active.push(todo)

		if @hash == '#/completed'
			items = done

		elif @hash == '#/active'
			items = active

		<self>
			<header.header>
				<h1> "todos {API.RENDERCOUNT}"
				<input.new-todo type='text' placeholder='What needs to be done?' autofocus=true>

			if all:length > 0
				<section.main>
					<input@toggler.toggle-all type='checkbox' :change='toggleAll'>
					<ul.todo-list> for todo in items
						<Todo[todo]>

			if all:length > 0
				<footer.footer>
					<span.todo-count>
						<strong> "{active:length} "
						active:length == 1 ? 'item left' : 'items left'
					<ul.filters>
						<li> <a .selected=(items == all)    href='#/'> 'All'
						<li> <a .selected=(items == active) href='#/active'> 'Active'
						<li> <a .selected=(items == done)   href='#/completed'> 'Completed'
					if done:length > 0
						<button.clear-completed :tap='clearCompleted'> 'Clear completed'



# create an instance of the app (with id app)
var app = <App#app>

def API.addTodo title
	Todos.addTodo(title)

def API.renameTodoAtIndex index, title
	var todo = Todos.@items[index]
	todo:title = title

def API.clearAllTodos
	Todos.clearAll

def API.render
	app.render
	return API.RENDERCOUNT

def API.getTodoAtIndex index
	Todos.@items[index]

def API.removeTodoAtIndex index
	var todo = API.getTodoAtIndex(index)
	Todos.@items.splice(index,1)
	return todo

def API.insertTodoAtIndex todo, index
	var len = Todos.@items:length
	var from = Todos.@items.indexOf(todo)
	if index >= len
		Todos.@items.push(todo)
	else
		Todos.@items.splice(index,0,todo)
	return todo

def API.toggleTodoAtIndex index, autorender
	var todo = Todos.@items[index]
	todo:completed = !todo:completed
	API.render(true) if autorender

var step = do |i|
	var api = API
	var len = api.@todoCount
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

def API.bench times = 100000, &fn
	let count = 10

	API.AUTORENDER = no
	# api.clearAllTodos
	API.addTodo(("Todo " + i)) for i in [1..count]
	API.@todoCount = count
	API.FULLRENDER = yes
	var i = 0
	var start = Date.new
	while i++ < times
		step(i)

	var elapsed = Date.new - start
	API.render(true)
	console.log "took",elapsed
	self


# append it to the dom
document.querySelector('.todoapp').appendChild(app.dom)
API:READY = true
# $$(.todoapp).append app
	



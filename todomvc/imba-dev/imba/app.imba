var ESCAPE_KEY = 27
var ENTER_KEY = 13

Todos = TodoModel.new('imba-todos')

tag app

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
		%%(.toggle-all).checked = no
		model.clearCompleted

	def list items
		for todo,i in items
			<todo[todo]@{todo:id}>

	def render
		API.RENDERCOUNT++

		var all    = Todos.@items
		var len    = all:length
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
					<input.toggle-all type='checkbox' :change='toggleAll'>
					<ul.todo-list> list(items)

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
var app = <app#app>

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

# append it to the dom
$$(.todoapp).append app
	



extern localStorage

global class TodoModel
	
	var id = 0

	prop items
	
	def initialize key
		@key = key
		@items = []
		@listeners = []

	def subscribe fn
		@listeners.push(fn)

	def inform
		if API.AUTORENDER
			fn(self) for fn in @listeners

		if API.AUTOPERSIST
			store

		self

	def addTodo title
		items.push(id: id++, title: title, completed: no)
		inform

	def toggleAll state
		for item in items
			item:completed = state
		inform

	def toggle item
		item:completed = !item:completed
		inform

	def destroy item
		items.splice(items.indexOf(item),1)
		inform

	def rename item, title
		item:title = title
		inform

	def save item, title
		item:title = title
		inform

	def clearCompleted
		items = items.filter do |item| !item:completed
		inform

	def clearAll
		items = []
		inform
	
	def load
		items = JSON.parse(localStorage.getItem(@key) or '[]')
		(item:id = id++) for item in items # setting unique id
		inform

	# persist todos to localstorage
	def store
		var json = JSON.stringify(items)
		localStorage.setItem(@key,@json = json) if json != @json
		self
		


		
		
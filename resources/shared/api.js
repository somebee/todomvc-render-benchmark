
API = {
	store: {
		counter: 0,
		todos: []
	},
	// Always on for now
	AUTORENDER: true, 

	AUTOPERSIST: false,

	// Force full render / reconcile for apps
	// that include manual shortcuts like
	// React.shouldComponentUpdate (same in Imba)
	FULLRENDER: true,

	// This counter should always increase by one whenever
	// the implmenentation rerenders, and be displayed in
	// the actual view as part of the title (<h1>)
	// <h1>todos</h1> in regular TodoMVC becomes:
	// <h1>todos {{API.RENDERCOUNT}}</h1> or similar
	RENDERCOUNT: 0
}

// clear the whole localStorage on load
localStorage.clear();

API.ready = function(){
	// called after TodoMVC has been loaded
	// Could be useful for overriding stuff
}

API.render = function(i){

}

// synchronous render
// should bring the view in sync with models++
// no matter how or where the models have changed
API.forceUpdate = function(force){
	this.render(this.store.counter);
	this.store.counter++;
	return this.store.counter;
}

// Add todo with title
// app should NOT render or persist to localstorage
API.addTodo = function(title) {
	this.store.addTodo(title);
}

// expose interface for renaming todo
API.renameTodoAtIndex = function(index,title) {
	var todo = this.store.todos[index];
	todo.title = title;
	return todo;
}

API.getTodoAtIndex = function (index){
	return this.store.todos[index];
};

API.insertTodoAtIndex = function (todo,index){
	var list = this.store.todos;
	var len  = list.length;
	var from = list.indexOf(todo);

	if (index >= len) {
		list.push(todo);
	} else {
		list.splice(index,0,todo);
	};

	return todo;
};

API.removeTodoAtIndex = function (index){
	var todo = API.getTodoAtIndex(index);
	this.store.todos.splice(index,1);
	return todo;
};

API.clearAllTodos = function() {
	this.store.todos.length = 0; // clearAll();
}

// return plain array of actual todo items
API.getTodos = function(){
	return this.store.todos;
}

API.toggleTodoAtIndex = function(index) {
	var todo = this.store.todos[index];
	todo.completed = !todo.completed;
	return todo;
}

API = {
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

// synchronous render
// should bring the view in sync with models++
// no matter how or where the models have changed
API.render = function(force){
	// render app
	return API.RENDERCOUNT;
}

// Add todo with title
// app should NOT render or persist to localstorage
API.addTodo = function(title) {
	app.model.addTodo(title);
}

// expose interface for renaming todo
API.renameTodoAtIndex = function(index,title) {
	var todo = app.model.todos[index];
	todo.title = title;
	return todo;
}

API.getTodoAtIndex = function (index){
	return app.model.todos[index];
};

API.insertTodoAtIndex = function (todo,index){
	var list = app.model.todos;
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
	app.model.todos.splice(index,1);
	return todo;
};

API.clearAllTodos = function() {
	app.model.clearAll();
}

// return plain array of actual todo items
API.getTodos = function(){
	return app.model.todos;
}

API.toggleTodoAtIndex = function(index) {
	var todo = API.getTodos()[index];
	todo.completed = !todo.completed;
}

// Public api for benchmark
API.render = function(force){
	m.redraw(force);
}

API.getModels = function(){
	return app.appController.list;
}

API.addTodo = function(title) {
	app.appController.list.push(new app.Todo({title: title, completed: false}));
	app.storage.put(app.appController.list);
	// does not render automatically
}

API.renameTodoAtIndex = function(index,title) {
	app.appController.list[index].title(title);
}

API.getTodoAtIndex = function (index){
	return app.appController.list[index];
};

API.insertTodoAtIndex = function (todo,index){
	var list = app.appController.list;
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
	app.appController.list.splice(index,1);
	return todo;
};

API.toggleTodoAtIndex = function(index) {
	var todo = API.getTodoAtIndex(index);
	todo.completed(!todo.completed());
}

API.clearAllTodos = function(force){
	app.appController.list.length = 0;
	app.storage.put(this.list);
}

API.list = [];

// Override storage
API.ready = function(){
	var list = [];
	return; 
	
	app.storage = {
		get: function () {
			return list;
		},
		put: function (todos) {
			list = todos;
			return
		}
	}
}
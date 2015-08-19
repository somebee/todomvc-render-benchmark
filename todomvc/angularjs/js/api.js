
API.render = function(force){
	API.$scope.renderCount = API.RENDERCOUNT++;
	API.$scope.$apply();
}

API.addTodo = function(text, autorender) {
	var newTodo = {
		title: text,
		completed: false
	};

	// API.$scope.saving = true;
	API.$store.insert(newTodo);
	// API.$scope.saving = false;
	//	.finally(function () { API.$scope.saving = false; });
}

// expose interface for renaming todo
API.renameTodoAtIndex = function(index,text,autorender) {
	var todo = API.$store.todos[index];
	todo.title = text;
	API.$store.put(index,todo);
	return;
}

API.getTodoAtIndex = function (index){
	return API.$store.todos[index];
};

API.insertTodoAtIndex = function (todo,index,autorender){
	var list = API.$store.todos;
	var len  = list.length;
	var from = list.indexOf(todo);

	if (index >= len) {
		list.push(todo);
	} else {
		list.splice(index,0,todo);
	};

	if (autorender) API.render(true);
	return todo;
};

API.removeTodoAtIndex = function (index,autorender){
	var todo = API.getTodoAtIndex(index);
	API.$store.todos.splice(index,1);
	if (autorender) API.render(true);
	return todo;
};

API.clearAllTodos = function(autorender) {
	app.model.clearAll();
	if (autorender) API.render(true);
}

API.getTodos = function(){
	return app.model.todos;
}

API.toggleTodoAtIndex = function(index, autorender) {
	var todo = API.$store.todos[index];
	todo.completed = !todo.completed;
	API.$store.put(index,todo);
}
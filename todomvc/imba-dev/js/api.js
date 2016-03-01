
API.toggleTodoAtIndex = function(index, autorender) {
	var todo = Todos._items[index];
	todo.completed = !todo.completed;
	if(autorender) API.render(true);
}
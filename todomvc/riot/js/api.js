console.log('hi');

API.render = function (force) {
  app.update();
};

API.getModels = function(){
  return app.todos;
}

API.addTodo = function(title) {
  app.todos.push({title: title, completed: false});
  todoStorage.put(app.todos);
  // does not render automatically
}

API.renameTodoAtIndex = function(index,title) {
  var todo = app.todos[index];
  todo.title = title;
  return todo;
}

API.getTodoAtIndex = function (index){
  return app.todos[index];
};

API.insertTodoAtIndex = function (todo,index){
  var list = app.todos;
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
  app.todos.splice(index,1);
  return todo;
};

API.getTodos = function(){
  return app.todos;
}

API.clearAllTodos = function(force){
  app.todos = [];
  todoStorage.put(app.todos);
}

API.list = [];

// Override storage
API.ready = function(){
  var list = [];
  return;

  todoStorage = {
    get: function () {
      return list;
    },
    put: function (todos) {
      list = todos;
      return
    }
  }
}

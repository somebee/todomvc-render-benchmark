// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~120 effective lines of JavaScript.

// localStorage persistence
var STORAGE_KEY = 'todos-vuejs-2.0'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed
    })
  }
}

var data = {
  todos: todoStorage.fetch(),
  newTodo: '',
  editedTodo: null,
  visibility: 'all'
}

// app Vue instance
var app = new Vue({

  created: function() {
    this.counter = 0;
    this.newTodo = '';
    // this.todos = todoStorage.fetch();
    this.editedTodo = null;
    this.visibility = 'all';
    // this._watcher.async = false;
  },
  // app initial state
  data: {todos: todoStorage.fetch()},

  // watch todos change for localStorage persistence
  /*watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },*/

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.todos)
    },
    remaining: function () {
      return filters.active(this.todos).length
    },
    allDone: {
      get: function () {
        return this.remaining === 0
      },
      set: function (value) {
        this.todos.forEach(function (todo) {
          todo.completed = value
        })
      }
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo: function () {
      var value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        title: value,
        completed: false
      })
      this.newTodo = ''
    },

    removeTodo: function (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    },

    editTodo: function (todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function (todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      }
    },

    cancelEdit: function (todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },

    removeCompleted: function () {
      this.todos = filters.active(this.todos)
    }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
})

// handle routing
function onHashChange () {
  var visibility = window.location.hash.replace(/#\/?/, '')
  if (filters[visibility]) {
    app.visibility = visibility
  } else {
    window.location.hash = ''
    app.visibility = 'all'
  }
}

window.addEventListener('hashchange', onHashChange)
onHashChange()


// integrate with the api

// Public api for benchmark
API.render = function(force){
  API.RENDERCOUNT++;
  app.counter = API.RENDERCOUNT;
  // app._render();
  // app.$forceUpdate();
  return API.RENDERCOUNT;
}

API.getModels = function(){
  return app.todos;
}

API.addTodo = function(text) {
  app.todos.push({
    id: todoStorage.uid++,
    title: text,
    completed: false
  });
}

// expose interface for renaming todo
API.renameTodoAtIndex = function(index,text) {
  var todo = app.todos[index];
  todo.title = text;
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

API.clearAllTodos = function() {
  app.todos = [];
}

API.toggleTodoAtIndex = function(index) {
  var todo = app.todos[index];
  todo.completed = !todo.completed;
}

window.A = app;
// mount
app.$mount('.todoapp')
// Make watcher synchronous so that it actually renders
// after each change
app._watcher.sync = true;
API.READY = true;


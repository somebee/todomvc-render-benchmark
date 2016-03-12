/*global riot, todoStorage */
<todo>
	<section class="todoapp">
		<header class="header">
			<h1>todos { API.RENDERCOUNT }</h1>
			<input class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?" onkeyup={ addTodo }>
		</header>
		<section class="main" show={ todos.length }>
			<input class="toggle-all" type="checkbox" checked={ allDone } onclick={ toggleAll }>
			<ul class="todo-list">
				<li riot-tag="todoitem" class="todo { completed: t.completed, editing: t.editing }"
						each={ t, i in filteredTodos() } todo={ t } parentview={ parent }></li>
			</ul>
		</section>
		<footer class="footer" show={ todos.length }>
			<span class="todo-count">
				<strong>{ remaining }</strong> { remaining === 1 ? 'item' : 'items' } left
			</span>
			<ul class="filters">
				<li><a class={ selected: activeFilter=='all' } href="#/all">All</a></li>
				<li><a class={ selected: activeFilter=='active' } href="#/active">Active</a></li>
				<li><a class={ selected: activeFilter=='completed' } href="#/completed">Completed</a></li>
			</ul>
			<button class="clear-completed" onclick={ removeCompleted } show={ todos.length > remaining }>
				Clear completed</button>
		</footer>
	</section>
	<footer class="info">
		<p>Double-click to edit a todo</p>
		<p>Written by <a href="http://github.com/txchen">Tianxiang Chen</a></p>
		<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
	</footer>
	<script>
		'use strict';
		var ENTER_KEY = 13;
		var self = this;
		window.app = self;
		self.todos = opts.data || [];
		riot.route.exec(function(base, filter) {
			self.activeFilter = filter || 'all';
		});
		self.on('update', function() {
			API.RENDERCOUNT++;
			self.remaining = self.todos.filter(function(t) {
				return !t.completed;
			}).length;
			self.allDone = self.remaining === 0;
			self.saveTodos();
		});
		saveTodos() {
			todoStorage.put(self.todos);
		};
		filteredTodos() {
			if (self.activeFilter === 'active') {
				return self.todos.filter(function(t) {
					return !t.completed;
				});
			} else if (self.activeFilter === 'completed') {
				return self.todos.filter(function(t) {
					return t.completed;
				});
			} else {
				return self.todos;
			}
		};
		addTodo(e) {
			if (e.which === ENTER_KEY) {
				var value = e.target.value && e.target.value.trim();
				if (!value) {
					return;
				}
				self.todos.push({ title: value, completed: false });
				e.target.value = '';
			}
		};
		removeTodo(todo) {
			self.todos.some(function (t) {
				if (todo === t) {
					self.todos.splice(self.todos.indexOf(t), 1);
				}
			});
		};
		toggleAll(e) {
			self.todos.forEach(function (t) {
				t.completed = e.target.checked;
			});
			return true;
		};
		removeCompleted() {
			self.todos = self.todos.filter(function(t) {
				return !t.completed;
			});
		};
		riot.route(function(base, filter) {
			self.activeFilter = filter;
			self.update();
		});
	</script>
</todo>

<todoitem>
	<div class="view">
		<input class="toggle" type="checkbox" checked={ opts.todo.completed } onclick={ toggleTodo }>
		<label ondblclick={ editTodo }>{ opts.todo.title }</label>
		<button class="destroy" onclick={ removeTodo }></button>
	</div>
	<input name="todoeditbox" class="edit" type="text" onblur={ doneEdit } onkeyup={ editKeyUp }>
	<script>
	'use strict';
	var ENTER_KEY = 13;
	var ESC_KEY = 27;
	var self = this;
	opts.todo.editing = false;
	toggleTodo() {
		opts.todo.completed = !opts.todo.completed;
		opts.parentview.saveTodos();
		return true;
	};
	editTodo() {
		opts.todo.editing = true;
		self.todoeditbox.value = opts.todo.title;
	};
	removeTodo() {
		opts.parentview.removeTodo(opts.todo);
	};
	doneEdit() {
		if (!opts.todo.editing) {
			return;
		}
		opts.todo.editing = false;
		var enteredText = self.todoeditbox.value && self.todoeditbox.value.trim();
		if (enteredText) {
			opts.todo.title = enteredText;
			opts.parentview.saveTodos();
		} else {
			self.removeTodo();
		}
	};
	editKeyUp(e) {
		if (e.which === ENTER_KEY) {
			self.doneEdit();
		} else if (e.which === ESC_KEY) {
			self.todoeditbox.value = opts.todo.title;
			self.doneEdit();
		}
	};
	self.on('update', function() {
		if (opts.todo.editing) {
			opts.parentview.update();
			self.todoeditbox.focus();
		}
	});
	</script>
</todoitem>

/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/

app.ALL_TODOS = 'all';
app.ACTIVE_TODOS = 'active';
app.COMPLETED_TODOS = 'completed';

var TodoModel = require('./todoModel').TodoModel;
var TodoItem = require('./todoItem').TodoItem;
var TodoFooter = require('./footer').TodoFooter;

var ENTER_KEY = 13;

var store = API.store;

class TodoApp extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			nowShowing: app.ALL_TODOS,
			editing: null
		};
	}
	getInitialState() {
		return {
			nowShowing: app.ALL_TODOS,
			editing: null
		};
	}

	componentDidMount() {
		var setState = this.setState;
		var router = Router({
			'/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
			'/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
			'/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
		});
		router.init('/');
	}

	handleNewTodoKeyDown(event) {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}

		event.preventDefault();

		var val = this.newField.value.trim();

		if (val) {
			this.props.model.addTodo(val);
			this.newField.value = '';
		}
	}

	toggleAll(event) {
		var checked = event.target.checked;
		this.props.model.toggleAll(checked);
	}

	toggle(todoToToggle) {
		this.props.model.toggle(todoToToggle);
	}

	destroy(todo) {
		this.props.model.destroy(todo);
	}

	edit(todo) {
		this.setState({editing: todo.id});
	}

	save(todoToSave, text) {
		this.props.model.save(todoToSave, text);
		this.setState({editing: null});
	}

	cancel() {
		this.setState({editing: null});
	}

	clearCompleted() {
		this.props.model.clearCompleted();
	}

	render() {
		var footer;
		var main;
		var todos = this.props.model.todos;

		var shownTodos = todos.filter(function (todo) {
			switch (this.state.nowShowing) {
			case app.ACTIVE_TODOS:
				return !todo.completed;
			case app.COMPLETED_TODOS:
				return todo.completed;
			default:
				return true;
			}
		}, this);

		var todoItems = shownTodos.map(function (todo,index) {
			return (
				React.createElement(TodoItem, {
					key: index, 
					todo: todo, 
					onToggle: this.toggle.bind(this, todo), 
					onDestroy: this.destroy.bind(this, todo), 
					onEdit: this.edit.bind(this, todo), 
					editing: this.state.editing === todo.id, 
					onSave: this.save.bind(this, todo), 
					onCancel: this.cancel}
				)
			);
		}, this);

		var activeTodoCount = todos.reduce(function (accum, todo) {
			return todo.completed ? accum : accum + 1;
		}, 0);

		var completedCount = todos.length - activeTodoCount;

		if (activeTodoCount || completedCount) {
			footer =
				React.createElement(TodoFooter, {
					count: activeTodoCount, 
					completedCount: completedCount, 
					nowShowing: this.state.nowShowing, 
					onClearCompleted: this.clearCompleted}
				);
		}

		if (todos.length) {
			main = (
				React.createElement("section", {className: "main"}, 
					React.createElement("input", {
						className: "toggle-all", 
						type: "checkbox", 
						onChange: this.toggleAll, 
						checked: activeTodoCount === 0}
					), 
					React.createElement("ul", {className: "todo-list"}, 
						todoItems
					)
				)
			);
		}

		return (
			React.createElement("div", null, 
				React.createElement("header", {className: "header"}, 
					React.createElement("h1", null, "todos " + store.counter),
					React.createElement("input", {
						ref: (input => this.newField = input ),
						className: "new-todo", 
						placeholder: "What needs to be done?", 
						onKeyDown: this.handleNewTodoKeyDown.bind(this), 
						autoFocus: true}
					)
				), 
				main, 
				footer
			)
		);
	}
};

var model = new TodoModel('react-todos');

function render() {
	ReactDOM.render(
		React.createElement(TodoApp, {model: model}),
		document.getElementsByClassName('todoapp')[0]
	);
}

model.subscribe(render);
render();

app.model = model;
app.render = render;
API.READY = true;

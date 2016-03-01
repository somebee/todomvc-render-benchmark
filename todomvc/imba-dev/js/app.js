(function(){
	function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;
	
	Todos = new TodoModel('imba-todos');
	
	tag$.defineTag('app', function(tag){
		
		tag.prototype.hash = function (){
			return this._hash;
		};
		
		tag.prototype.model = function (){
			return this._model;
		};
		
		tag.prototype.build = function (){
			var self = this;
			self._model = Todos;
			self._model.load();
			self._model.subscribe(function() { return self.render(); });
			window.addEventListener('hashchange',function() {
				self._hash = window.location.hash;
				return self.render();
			});
			self.render();
			return self;
		};
		
		tag.prototype.onkeydown = function (e){
			var value, v_;
			if (e.which() != ENTER_KEY) { return };
			
			if (value = e.target().value().trim()) {
				this.model().addTodo(value);
				return (e.target().setValue(v_ = ""),v_);
			};
		};
		
		
		tag.prototype.toggleAll = function (e){
			return this.model().toggleAll(e.target().checked());
		};
		
		// remove all completed todos
		tag.prototype.clearCompleted = function (){
			q$$('.toggle-all',this).setChecked(false);
			return this.model().clearCompleted();
		};
		
		tag.prototype.list = function (items){
			var __ = (this.__._list = this.__._list || {});
			for (var i = 0, ary = iter$(items), len = ary.length, todo, res = []; i < len; i++) {
				todo = ary[i];
				res.push((__[todo.id] = __[todo.id] || tag$.$todo()).setObject(todo).end());
			};
			return res;
		};
		
		tag.prototype.render = function (){
			var self = this, __ = self.__;
			API.RENDERCOUNT++;
			
			var all = Todos._items;
			var len = all.length;
			var items = all;
			var done = [];
			var active = [];
			
			for (var i = 0, ary = iter$(all), len_ = ary.length, todo; i < len_; i++) {
				todo = ary[i];
				todo.completed ? (done.push(todo)) : (active.push(todo));
			};
			
			if (this._hash == '#/completed') {
				items = done;
			} else if (this._hash == '#/active') {
				items = active;
			};
			
			return this.setChildren([
				(__.A = __.A || tag$.$header().flag('header')).setContent([
					(__.AA = __.AA || tag$.$h1()).setContent(("todos " + (API.RENDERCOUNT)),3).end(),
					(__.AB = __.AB || tag$.$input().flag('new-todo').setType('text').setPlaceholder('What needs to be done?').setAutofocus(true)).end()
				],2).end(),
				
				(all.length > 0) ? (
					(__.B = __.B || tag$.$section().flag('main')).setContent([
						(__.BA = __.BA || tag$.$input().flag('toggle-all').setType('checkbox').setHandler('change','toggleAll',self)).end(),
						(__.BB = __.BB || tag$.$ul().flag('todo-list')).setContent(self.list(items),3).end()
					],2).end()
				) : void(0),
				
				(all.length > 0) ? (
					(__.C = __.C || tag$.$footer().flag('footer')).setContent([
						(__.CA = __.CA || tag$.$span().flag('todo-count')).setContent([
							(__.CAA = __.CAA || tag$.$strong()).setContent(("" + (active.length) + " "),3).end(),
							active.length == 1 ? ('item left') : ('items left')
						],1).end(),
						(__.CB = __.CB || tag$.$ul().flag('filters')).setContent([
							(__.CBA = __.CBA || tag$.$li()).setContent((__.CBAA = __.CBAA || tag$.$a().setHref('#/')).flag('selected',(items == all)).setText('All').end(),2).end(),
							(__.CBB = __.CBB || tag$.$li()).setContent((__.CBBA = __.CBBA || tag$.$a().setHref('#/active')).flag('selected',(items == active)).setText('Active').end(),2).end(),
							(__.CBC = __.CBC || tag$.$li()).setContent((__.CBCA = __.CBCA || tag$.$a().setHref('#/completed')).flag('selected',(items == done)).setText('Completed').end(),2).end()
						],2).end(),
						(done.length > 0) ? (
							(__.CC = __.CC || tag$.$button().flag('clear-completed').setHandler('tap','clearCompleted',self)).setText('Clear completed').end()
						) : void(0)
					],1).end()
				) : void(0)
			],1).synced();
		};
	});
	
	
	
	// create an instance of the app (with id app)
	var app = tag$.$app().setId('app').end();
	
	API.addTodo = function (title){
		return Todos.addTodo(title);
	};
	
	API.renameTodoAtIndex = function (index,title){
		var todo = Todos._items[index];
		return todo.title = title;
	};
	
	API.clearAllTodos = function (){
		return Todos.clearAll();
	};
	
	API.render = function (){
		app.render();
		return API.RENDERCOUNT;
	};
	
	API.getTodoAtIndex = function (index){
		return Todos._items[index];
	};
	
	API.removeTodoAtIndex = function (index){
		var todo = API.getTodoAtIndex(index);
		Todos._items.splice(index,1);
		return todo;
	};
	
	API.insertTodoAtIndex = function (todo,index){
		var len = Todos._items.length;
		var from = Todos._items.indexOf(todo);
		if (index >= len) {
			Todos._items.push(todo);
		} else {
			Todos._items.splice(index,0,todo);
		};
		return todo;
	};
	
	// append it to the dom
	return q$$('.todoapp').append(app);
	
	
	

})();
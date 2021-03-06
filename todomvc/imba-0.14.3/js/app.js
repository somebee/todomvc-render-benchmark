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
			for (var i = 0, ary = iter$(items), len = ary.length, res = []; i < len; i++) {
				res.push((this['_' + i] = this['_' + i] || tag$.$todo()).setObject(ary[i]).end());
			};
			return res;
		};
		
		tag.prototype.render = function (){
			var t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
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
				(t0 = this.$a=this.$a || tag$.$header().flag('header')).setContent([
					(t1 = t0.$$a=t0.$$a || tag$.$h1()).setContent(("todos " + (API.RENDERCOUNT)),3).end(),
					(t0.$$b = t0.$$b || tag$.$input().flag('new-todo').setType('text').setPlaceholder('What needs to be done?').setAutofocus(true)).end()
				],2).end(),
				
				(all.length > 0) ? (
					(t2 = this.$b=this.$b || tag$.$section().flag('main')).setContent([
						(t2.$$a = t2.$$a || tag$.$input().flag('toggle-all').setType('checkbox').setHandler('change','toggleAll',this)).end(),
						(t3 = t2.$$b=t2.$$b || tag$.$ul().flag('todo-list')).setContent(this.list(items),3).end()
					],2).end()
				) : void(0),
				
				(all.length > 0) ? (
					(t4 = this.$c=this.$c || tag$.$footer().flag('footer')).setContent([
						(t5 = t4.$$a=t4.$$a || tag$.$span().flag('todo-count')).setContent([
							(t6 = t5.$$a=t5.$$a || tag$.$strong()).setContent(("" + (active.length) + " "),3).end(),
							active.length == 1 ? ('item left') : ('items left')
						],1).end(),
						(t7 = t4.$$b=t4.$$b || tag$.$ul().flag('filters')).setContent([
							(t8 = t7.$$a=t7.$$a || tag$.$li()).setContent((t8.$$a = t8.$$a || tag$.$a().setHref('#/')).flag('selected',(items == all)).setText('All').end(),2).end(),
							(t9 = t7.$$b=t7.$$b || tag$.$li()).setContent((t9.$$a = t9.$$a || tag$.$a().setHref('#/active')).flag('selected',(items == active)).setText('Active').end(),2).end(),
							(t10 = t7.$$c=t7.$$c || tag$.$li()).setContent((t10.$$a = t10.$$a || tag$.$a().setHref('#/completed')).flag('selected',(items == done)).setText('Completed').end(),2).end()
						],2).end(),
						(done.length > 0) ? (
							(t4.$$c = t4.$$c || tag$.$button().flag('clear-completed').setHandler('tap','clearCompleted',this)).setText('Clear completed').end()
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
	
	
	

})()
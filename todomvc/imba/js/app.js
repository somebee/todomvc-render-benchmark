(function(){
	function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;
	
	Todos = new TodoModel('imba-todos');
	
	Imba.defineTag('app', function(tag){
		
		tag.prototype.hash = function (){
			return this._hash;
		};
		
		tag.prototype.model = function (){
			return this._model;
		};
		
		tag.prototype.build = function (){
			var self=this;
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
				return (e.target().setValue(v_=""),v_);
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
			for (var i=0, ary=iter$(items), len=ary.length, res=[]; i < len; i++) {
				res.push((this['_' + i] = this['_' + i] || t$('todo')).setObject(ary[i]).end());
			};
			return res;
		};
		
		tag.prototype.render = function (){
			var t0, t1, t2;
			API.RENDERCOUNT++;
			
			var all = Todos._items;
			var len = all.length;
			var items = all;
			var done = [];
			var active = [];
			
			for (var i=0, ary=iter$(all), len_=ary.length, todo; i < len_; i++) {
				todo = ary[i];
				todo.completed ? (done.push(todo)) : (active.push(todo));
			};
			
			if (this._hash == '#/completed') {
				items = done;
			} else if (this._hash == '#/active') {
				items = active;
			};
			
			return this.setChildren(Imba.static([
				(t0 = this.$a || (this.$a = t$('header').flag('header'))).setContent(Imba.static([
					(t0.$$a = t0.$$a || t$('h1')).setText(("todos " + (API.RENDERCOUNT))).end(),
					(t0.$$b = t0.$$b || t$('input').flag('new-todo').setType('text').setPlaceholder('What needs to be done?').setAutofocus(true)).end()
				],1)).end(),
				
				(all.length > 0) && (
					(t0 = this.$b || (this.$b = t$('section').flag('main'))).setContent(Imba.static([
						(t0.$$a = t0.$$a || t$('input').flag('toggle-all').setType('checkbox').setHandler('change','toggleAll',this)).end(),
						(t0.$$b = t0.$$b || t$('ul').flag('todo-list')).setContent(this.list(items)).end()
					],1)).end()
				),
				
				(all.length > 0) && (
					(t0 = this.$c || (this.$c = t$('footer').flag('footer'))).setContent(Imba.static([
						(t1 = t0.$$a || (t0.$$a = t$('span').flag('todo-count'))).setContent(Imba.static([
							(t1.$$a = t1.$$a || t$('strong')).setText(("" + (active.length) + " ")).end(),
							active.length == 1 ? ('item left') : ('items left')
						],1)).end(),
						(t1 = t0.$$b || (t0.$$b = t$('ul').flag('filters'))).setContent(Imba.static([
							(t2 = t1.$$a || (t1.$$a = t$('li'))).setContent((t2.$$a = t2.$$a || t$('a').setHref('#/')).flag('selected',(items == all)).setText('All').end()).end(),
							(t2 = t1.$$b || (t1.$$b = t$('li'))).setContent((t2.$$a = t2.$$a || t$('a').setHref('#/active')).flag('selected',(items == active)).setText('Active').end()).end(),
							(t2 = t1.$$c || (t1.$$c = t$('li'))).setContent((t2.$$a = t2.$$a || t$('a').setHref('#/completed')).flag('selected',(items == done)).setText('Completed').end()).end()
						],1)).end(),
						(done.length > 0) && (
							(t0.$$c = t0.$$c || t$('button').flag('clear-completed').setHandler('tap','clearCompleted',this)).setText('Clear completed').end()
						)
					],1)).end()
				)
			],1)).synced();
		};
	});
	
	
	
	// create an instance of the app (with id app)
	var app = ti$('app','app').end();
	
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
	q$$('.todoapp').append(app);

})()
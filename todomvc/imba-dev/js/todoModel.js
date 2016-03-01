(function(){
	function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
	// externs;
	
	function TodoModel(key){
		this._key = key;
		this._items = [];
		this._listeners = [];
	};
	
	global.TodoModel = TodoModel; // global class 
	var id = 0;
	
	TodoModel.prototype.items = function(v){ return this._items; }
	TodoModel.prototype.setItems = function(v){ this._items = v; return this; };
	
	TodoModel.prototype.subscribe = function (fn){
		return this._listeners.push(fn);
	};
	
	TodoModel.prototype.inform = function (){
		if (API.AUTORENDER) {
			for (var i = 0, ary = iter$(this._listeners), len = ary.length; i < len; i++) {
				ary[i](this);
			};
		};
		
		if (API.AUTOPERSIST) {
			this.store();
		};
		
		return this;
	};
	
	TodoModel.prototype.addTodo = function (title){
		this.items().push({id: id++,title: title,completed: false});
		return this.inform();
	};
	
	TodoModel.prototype.toggleAll = function (state){
		for (var i = 0, ary = iter$(this.items()), len = ary.length; i < len; i++) {
			ary[i].completed = state;
		};
		return this.inform();
	};
	
	TodoModel.prototype.toggle = function (item){
		item.completed = !item.completed;
		return this.inform();
	};
	
	TodoModel.prototype.destroy = function (item){
		this.items().splice(this.items().indexOf(item),1);
		return this.inform();
	};
	
	TodoModel.prototype.rename = function (item,title){
		item.title = title;
		return this.inform();
	};
	
	TodoModel.prototype.save = function (item,title){
		item.title = title;
		return this.inform();
	};
	
	TodoModel.prototype.clearCompleted = function (){
		this.setItems(this.items().filter(function(item) { return !item.completed; }));
		return this.inform();
	};
	
	TodoModel.prototype.clearAll = function (){
		this.setItems([]);
		return this.inform();
	};
	
	TodoModel.prototype.load = function (){
		this.setItems(JSON.parse(localStorage.getItem(this._key) || '[]'));
		for (var i = 0, ary = iter$(this.items()), len = ary.length; i < len; i++) {
			ary[i].id = id++;
		}; // setting unique id
		return this.inform();
	};
	
	// persist todos to localstorage
	TodoModel.prototype.store = function (){
		var json = JSON.stringify(this.items());
		if (json != this._json) { localStorage.setItem(this._key,this._json = json) };
		return this;
	};
	return TodoModel;
	
	
	
	

})();
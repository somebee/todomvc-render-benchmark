
tests:reorder =
	label: 'Reorder'
	title: 'Reorder (shift+push)'
	step: do |app,i|
		var todo = app.removeTodoAtIndex(0)
		app.render(true)
		app.insertTodoAtIndex(todo,1000) # at the end
		app.render(true)
		return

# full rendering including todo-renaming
tests:rename =
	label: 'Rename todo'
	title: 'Rename random todo'
	step: do |app,i|
		var idx = i % app.@todoCount
		app.renameTodoAtIndex(idx,"Todo {idx + 1} {i}",no)
		app.render(true)
		return

tests:toggle =
	label: 'Toggle todo'
	title: 'Toggle random todo'
	step: do |app,i|
		app.toggleTodoAtIndex(i % app.@todoCount)
		app.render(true)
		return

tests:unchanged =
	label: 'Unchanged render'
	title: 'Unchanged render'
	step: do this:app.api.render(yes)
		

# create the benchmarks
tests:all =
	label: 'Bench Everything'
	title: 'Everything (remove, toggle, append, rename)'
	step: do |app,i|
		var len = app.@todoCount
		var idx = i % len
		var todo = app.removeTodoAtIndex(idx)
		app.insertTodoAtIndex(todo,1000)
		app.render(yes)
		app.toggleTodoAtIndex((idx) % len)
		app.render(yes)
		app.renameTodoAtIndex((idx + 1) % len,"Todo - {i}")
		app.render(yes)
		return
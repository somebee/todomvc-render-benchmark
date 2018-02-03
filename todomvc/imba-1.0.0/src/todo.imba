var ESCAPE_KEY = 27
var ENTER_KEY = 13

# this way of caching is not the 'Imba way' - it is merely a very simple way
# to do something similar to React 'shouldComponentUpdate'. You can implement
# this however you want - you merely try to figure out whether anything have
# changed inside tag#commit, and then rerender if it has.
tag todo < li

	def model
		up('._app').model

	# commit is always called when a node is rendered as part of an outer tree
	# this is where we decide whether to cascade the render through to inner
	# parts of this.

	# improvised alternative to React shouldComponentUpdate
	# you can do this however you want. In Imba there is really no reason
	# not to render (since it is so fast) - but to make it behave like
	# the react version we only render the content if we know it has changed

	def commit
		return render if API.FULLRENDER 

		if @hash != hash(data)
			@hash = hash(data)
			render

		return self


	def hash o
		"" + o:title + o:completed + @editing

	def render
		var todo = @data

		<self .completed=(todo:completed) >
			<div.view>
				<label :dblclick='edit'> "{todo:title}"
				<input@toggle type='checkbox' :change='toggle' checked=(todo:completed)>
				<button.destroy :tap='drop'>
			<input@input.edit type='text'>

	def edit
		@editing = yes
		flag(:editing)
		@input.value = data:title
		setTimeout(&,10) do @input.focus
		render # only need to render this

	def drop
		model.destroy(data)

	def toggle e
		data:completed = @toggle.checked
		model.inform

	def submit
		@editing = no
		unflag(:editing)
		var title = @input.value.trim
		title ? model.rename(data,title) : model.destroy(data)

	def onfocusout e
		submit if @editing

	def cancel
		@editing = no
		unflag(:editing)
		@input.blur
		render

	# onkeydown from inner element cascade through
	def onkeydown e
		e.halt
		submit if e.which == ENTER_KEY
		cancel if e.which == ESCAPE_KEY


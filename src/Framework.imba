

export class Framework

	prop performance
	prop timings
	
	def initialize o = {}
		@options = o
		@title = @name = o:name
		@ready = false
		@timings = {}
		@node = <div.app>
			<header@header> name
			<iframe@frame src=url css:minHeight='400px'>
		build

	def node do @node
	def name do @name
	def title do @title
	def color do @options:color or 'red'
	def url do @options:url || "todomvc/{@options:path}"
	def doc do @frame.dom:contentDocument
	def win do @win ||= @frame.dom:contentWindow
	def api do @api ||= @frame.dom:contentWindow.API

	def build
		@build ||= Promise.new do |resolve|
			var wait = do
				if doc and doc.querySelector('#header h1,.header h1') && api.RENDERCOUNT > 0
					let p = @performance = win:performance
					api.ready
					reset(6)
					api.AUTORENDER = yes
					setTimeout(&,10) do
						@timings:ready = p:timing:domComplete - p:timing:domLoading
						status = "{name} - domComplete {@timings:ready}ms"
					return resolve(self)
				setTimeout(wait,10)
			wait()

	def prepare
		# should be done by benchmarks
		reset(6)

	def reset count = 10
		api.AUTORENDER = no
		api.RENDERCOUNT = 0
		api.FULLRENDER = yes
		# reset / remove all todos
		api.clearAllTodos
		api.addTodo("Todo " + i) for i in [1..count]
		api.@todoCount = count
		api.render(true)
		api.RENDERCOUNT = 0
		self

	def deactivate
		node.unflag('running')

	def activate
		node.flag('running')

	def status= status
		@header.text = status
		self
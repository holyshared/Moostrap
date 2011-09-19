(function(global, doc){

	var Application = function(options){
		for (var key in options){
			this[key] = options[key];
		}
		var decorater = new MessageDecorator(this);
		for (var key in this.messages){
			decorater.applyDecorater(key, this.messages[key]);
		}
		this.status = new MessageList();
	};

	Application.implement({

		messages: {
			boot: 'application boot.....',
			progress: function(process, index, total){
				return process + ' ' + index + '/' + total;
			},
			start: 'application boot done',
			abort: 'application abort'
		},

//		feeds: {},

		boot: function(){
		},

		progress: function(process, index, total){
		},

		start: function(){
		},

		abort: function(){
		},

		getContainer: function(){
			return this.container;
		},

		setContainer: function(container){
			return this.container = container;
		},

		run: function(){

            var bootstrapper = new Bootstrap({
            	strategy: this.strategy,
                module: this.module,
				onStart: this.boot,
				onProgress: this.progress,
				onSuccess: this.start,
            	onFailture: this.abort
			});

			bootstrapper.execute(this);

		},

		print: function(message){
			this.status.printMessage(message);
		},

		registerFeed: function(key, entries){
			this.feeds[key] = entries;
		}

	});

	global.Application = Application;

}(this, document));

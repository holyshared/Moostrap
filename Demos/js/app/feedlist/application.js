(function(global, doc){

	var Application = function(options){
		for (var key in options){
			this[key] = options[key];
		}
		var decorater = new MessageDecorator(this);
		for (var key in this.messages){
			decorater.applyDecorater(key, this.messages[key]);
		}
		this.dialog = new ProgressDialog();
	};

	Application.implement({

		messages: {
			boot: 'Application is initialized......',
			progress: function(process, index, total){
				return index + '/' + total + ' ' + ' - Initialization of ' + process + ' was completed.';
			},
			start: 'Initialization of application was completed.',
			abort: 'Initialization of application went wrong.'
		},

		getContainer: function(){
			return this.container;
		},

		setContainer: function(container){
			return this.container = container;
		},

		boot: function(){ this.dialog.open(); },
		start: function(){ this.dialog.close(); },
		abort: function(){ this.dialog.close(); },

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
			this.dialog.print(message);
		}

	});

	global.Application = Application;

}(this, document));

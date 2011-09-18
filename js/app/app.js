(function(global, doc){

	var Application = function(options){
		for (var key in options){
			this[key] = options[key];
		}
		var decorater = new MessageDecorator(this);
		for (var key in this.messages){
			decorater.applyDecorater(key, this.messages[key]);
		}
		this.status = new ProgressView();
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

		boot: function(){
		},

		progress: function(process, index, total){
		},

		start: function(){
		},

		abort: function(){
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

		printMessage: function(message){
			this.status.printMessage(message);
		}

	});

	global.Application = Application;



	var MessageDecorator = function(target){
		this.target = target;
	}

	MessageDecorator.implement({

		applyDecorater: function(key, message){
			var handler = null;
			var args = [key, message];
			if (typeof message === 'string'){
				handler = this.stringDecorater(key, message);
			} else {
				handler = this.handlerDecorater(key, message);

			}
			this.target[key] = handler;
		},

		stringDecorater: function(key, message){
			var app = this.target;
			var beforeHandler = this.target[key];
			var handler = function(){
				app.printMessage(message);
				beforeHandler();
			};
			return handler;
		},

		handlerDecorater: function(key, message){
			var app = this.target;
			var beforeHandler = this.target[key];
			var handler = function(){
				var output = message.apply(app, arguments);
				app.printMessage(output);
				beforeHandler.apply(app, arguments);
			};
			return handler;
		}

	});


	/**
	 * ProgressView
	 */
	var ProgressView = function(){
		this._view = doc.getElementById('message');
	}
	ProgressView.implement({

		printMessage: function(message){
			var li = doc.createElement('li');
			var text = doc.createTextNode(message);
			li.appendChild(text);
			this._view.appendChild(li);
		}

	});

}(this, document));

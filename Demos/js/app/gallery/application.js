(function(global, doc){

	var Application = function(options){
		for (var key in options){
			this[key] = options[key];
		}
		var decorater = new MessageDecorator(this);
		for (var key in this.messages){
			decorater.applyDecorater(key, this.messages[key]);
		}
		this.container = new Container();
		this.dialog = new ProgressDialog();
	};

	Application.implement({

		messages: {
			boot: 'Application is initialized......',
			beforeBootstrap: function(key, title, index, total){
				return index + '/' + total + ' ' + ' - Initialization of ' + key + ' was started.';
			},
			onAfterBootstrap: function(key, title, index, total){
				return index + '/' + total + ' ' + ' - Initialization of ' + key + ' was completed.';
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

		start: function(){
			this.dialog.close();

			var container = this.getContainer();
			var photos = $('photos');

			var iter = container.getIterator();
			while (iter.hasNext()) {
				var current = iter.current();

				var h3 = new Element('h3', { html: current.key });
				var ul = new Element('ul', { 'class': 'photos' });

				var list = [];
				var images = current.images;
				images.each(function(image, key){
					var li = new Element('li');
					var img = new Element('img', {
						title: image.title,
						src: image.src
					});
					img.inject(li);
					list.push(li);
				});
				ul.adopt(list);

				h3.inject(photos);
				ul.inject(photos);

				iter.next();
			}

		},

		abort: function(){ this.dialog.close(); },

		run: function(){

            var bootstrapper = new Moostrap(this.strategy, this.module, {
				onStart: this.boot,
				onBeforeBootstrap: this.beforeBootstrap,
				onAfterBootstrap: this.afterBootstrap,
				onSuccess: this.start,
            	onFailture: this.abort
			});
			bootstrapper.execute(this.container);

		},

		print: function(message){
			this.dialog.print(message);
		}

	});

	global.Application = Application;

}(this, document));

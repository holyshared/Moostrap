(function(win, doc, bootstrap){

bootstrap.register('proccessA', {

	options: {
		key1: 'key1',
		key2: 'key2'
	},

	handler: function(){
		this.success();
	}

});


this.Bootstrapper = bootstrap;

}(window, document, new Bootstrap()));



(function(win, doc, Bootstrapper){

	var Application = this.Application = function(configurations){
		this.configurations = configurations;
	};

	Application.implement({

		run: function(){
			var configurations = this.configurations;

			var syncBootstrapper = Bootstrapper.create('Sync', {
				configurations: configurations,
				onStart: function(){
					log('start');
				},
				onProgress: function(key, index, total){
					log('process: ' + key + ' ' + index + '/' + total);
				},
				onComplete: function(){
					log('complete');
				}
			});
	
			syncBootstrapper.setResource(this)
				.execute();

		}

	});

}(window, document, Bootstrapper));



(function(win, doc){

	win.addEventListener('load', function(){

		var app = new Application({
			proccessA: {
				key1: 'key1',
				key2: 'key2'
			},
			proccessB: {
				key1: 'key1',
				key2: 'key2'
			}
		});
		app.run();

	}, false);

}(window, document));
(function(global, module){

	global.addEventListener('load', function(){
		var app = new Application({
			strategy: 'async',
			module: module
		});
		app.run();
	}, false);

}(this, Application.Module));

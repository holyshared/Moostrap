(function(global, module){

	global.addEventListener('load', function(){
		var app = new Application({
			strategy: 'sync',
			module: module
		});
		app.run();
	}, false);

}(this, Application.Module));

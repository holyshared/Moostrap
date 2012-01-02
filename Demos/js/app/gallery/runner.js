(function(global, doc, module){

	global.addEventListener('load', function(){

		var app = new Application({
			strategy: Moostrap.ASYNC_EXECUTER,
			module: module
		});
		app.run();

	}, false);

}(this, document, Application.Module));

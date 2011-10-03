(function(global, doc, module){

	global.addEventListener('load', function(){
		var container = doc.getElementById('feeds');
		var app = new Application({
			container: container,
			strategy: 'sync',
			module: module
		});
		app.run();
	}, false);

}(this, document, Application.Module));

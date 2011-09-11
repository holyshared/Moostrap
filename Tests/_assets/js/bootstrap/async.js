(function(win, doc, Bootstrap){

	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({

			title: 'bootstrap',
			description : 'bootstrap sync testcase.',
			fn: function(){
				var resource = {};

				var bootstrapper = Application.Bootstrap.create('Async', {
					resource: resource,
					configurations: {
						proccessA: {
							key1: 'key1',
							key2: 'key2'
						},
						proccessB: {
							key1: 'key1',
							key2: 'key2'
						}
					},
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
				bootstrapper.execute();

			}

		});

		makeActions(testcases);

	}, false);

}(window, document, Bootstrap));
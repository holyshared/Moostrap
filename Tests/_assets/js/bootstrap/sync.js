(function(win, doc, Bootstrap){

	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({

			title: 'bootstrap - success',
			description : 'bootstrap sync testcase - success.',
			fn: function(){
				var resource = {};

				var bootstrapper = App.SuccessBootstrap.create('Sync', {
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


		testcases.push({

			title: 'bootstrap - failture',
			description : 'bootstrap sync testcase - failture.',
			fn: function(){
				var resource = {};

				var bootstrapper = App.FailureBootstrap.create('Sync', {
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
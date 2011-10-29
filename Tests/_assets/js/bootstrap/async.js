(function(win, doc, Bootstrap, SuccessTestModule, FailureTestModule){

	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({

			title: 'bootstrap - success',
			description : 'bootstrap async testcase - success.',
			fn: function(){
				var resource = {};

				var bootstrap = new Bootstrap('async', SuccessTestModule, {
					configurations: {
						proccessA: {
							key1: 'key1-value',
							key2: 'key2-value'
						},
						proccessB: {
							key3: 'key3-value',
							key4: 'key4-value'
						}
					},
					onStart: function(){
						log('start');
					},
					onProgress: function(key, index, total){
						log('process: ' + key + ' ' + index + '/' + total);
					},
					onSuccess: function(){
						log('success');

						log( (resource.key1 == 'key1-value') ? 'resource.key1 OK' : 'resource.key1 NG' );
						log( (resource.key2 == 'key2-value') ? 'resource.key2 OK' : 'resource.key2 NG' );
						log( (resource.key3 == 'key3-value') ? 'resource.key3 OK' : 'resource.key3 NG' );
						log( (resource.key4 == 'key4-value') ? 'resource.key4 OK' : 'resource.key4 NG' );

					},
					onComplete: function(){
						log('complete');
					}
				});
				bootstrap.execute(resource);

			}

		});


		testcases.push({

			title: 'bootstrap - failture',
			description : 'bootstrap async testcase - failture.',
			fn: function(){
				var resource = {};

				var bootstrap = new Bootstrap('async', FailureTestModule, {

					configurations: {
						proccessA: {
							key1: 'key1-value',
							key2: 'key2-value'
						},
						proccessB: {
							key3: 'key3-value',
							key4: 'key4-value'
						}
					},
					onStart: function(){
						log('start');
					},
					onProgress: function(key, index, total){
						log('process: ' + key + ' ' + index + '/' + total);
					},
					onFailure: function(){
						log('failure');

						log( (!resource.key3) ? 'resource.key3 OK' : 'resource.key3 NG' );
						log( (!resource.key4) ? 'resource.key4 OK' : 'resource.key4 NG' );
					},
					onComplete: function(){
						log('complete');
					}
				});
				bootstrap.execute(resource);

			}

		});

		makeActions(testcases);

	}, false);

}(window, document, Bootstrap, SuccessTestModule, FailureTestModule));
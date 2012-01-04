(function(win, doc, Moostrap, SuccessTestModule, FailureTestModule){

	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({

			title: 'bootstrap - success',
			description : 'bootstrap async testcase - success.',
			fn: function(){
				var resource = {};

				var bootstrap = new Moostrap(Moostrap.ASYNC_EXECUTER, SuccessTestModule, {
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
					onBeforeBootstrap: function(key, title, index, total){
						log('before: ' + key + ' ' + index + '/' + total);
					},
					onAfterBootstrap: function(key, title, index, total){
						log('after: ' + key + ' ' + index + '/' + total);
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

				var bootstrap = new Moostrap(Moostrap.ASYNC_EXECUTER, FailureTestModule, {

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
					onBeforeBootstrap: function(key, title, index, total){
						log('before: ' + key + ' ' + index + '/' + total);
					},
					onAfterBootstrap: function(key, title, index, total){
						log('after: ' + key + ' ' + index + '/' + total);
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

}(window, document, Moostrap, SuccessTestModule, FailureTestModule));
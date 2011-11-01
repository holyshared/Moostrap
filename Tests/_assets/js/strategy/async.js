(function(win, doc, Bootstrap, Executer){

	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({

			title: 'Asynchronous',
			description : 'Asynchronous testcase.',
			fn: function(){

				var resource = {};

				var strategy = new Executer.Async({
					module: TestModule,
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
					}
				});
				strategy.addEvent('complete', function(){
					log( (resource['bootstrapperA'].name == 'a') ? 'proccessA result OK' : 'proccessA result NG - name' );
					log( (resource['bootstrapperB'].name == 'a') ? 'proccessB result OK' : 'proccessB result NG - name' );
				});
				strategy.init();
				strategy.execute();

				var a = TestModule.getBootstrapper('proccessA');

				log( (a.getConfiguration().key1 == 'key1') ? 'proccessA configuration key1 OK' : 'proccessA configuration NG - key1' );
				log( (a.getConfiguration().key2 == 'key2') ? 'proccessA configuration key2 OK' : 'proccessA configuration NG - key2' );

			}

		});

		makeActions(testcases);

	}, false);

}(window, document, Bootstrap, Bootstrap.Executer));
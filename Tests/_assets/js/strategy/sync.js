(function(win, doc, Bootstrap, Strategy){

	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({

			title: 'Synchronize',
			description : 'Synchronize testcase.',
			fn: function(){

				var resource = {};
				var a = new BootstrapperA(), b = new BootstrapperB();
				var collection = new Bootstrap.Bootstrappers();

				collection.addItem('proccessA', a)
					.addItem('proccessB', b);

				var strategy = new Strategy.Sync({
					resource: resource,
					bootstrappers: collection,
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

					log( (resource['bootstrapperA'].name == 'a') ? 'assert OK' : 'proccessA result NG - name' );
					log( (resource['bootstrapperB'].name == 'a') ? 'assert OK' : 'proccessB result NG - name' );

				});
				strategy.init();
				strategy.execute();

				log( (a.getOptions().key1 == 'key1') ? 'assert OK' : 'proccessA configuration NG - key1' );
				log( (a.getOptions().key2 == 'key2') ? 'assert OK' : 'proccessA configuration NG - key2' );

			}

		});

		makeActions(testcases);

	}, false);

}(window, document, Bootstrap, Bootstrap.Strategy));
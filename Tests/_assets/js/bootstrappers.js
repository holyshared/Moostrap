(function(win, doc){

/*
* execute
*/


	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({

			title: 'addBootstrapper/addBootstrappers/getLength',
			description : 'addBootstrapper/addBootstrappers/getLength testcase.',
			fn: function(){

				var b1 = new Bootstrap.Bootstrapper({ bootstrap: function(resource, params){} });
				var b2 = new Bootstrap.Bootstrapper({ bootstrap: function(resource, params){} });
				var b3 = new Bootstrap.Bootstrapper({ bootstrap: function(resource, params){} });

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addBootstrapper('b1', b1);

				log( (bootstrappers.getLength() == 1) ? 'assert OK.' : 'addBootstrapper NG.' );

				bootstrappers.addBootstrappers({ b2: b2, b3: b3 });

				log( (bootstrappers.getLength() == 3) ? 'assert OK.' : 'addBootstrappers NG.' );

			}

		});


		testcases.push({

			title: 'removeBootstrapper/removeBootstrappers',
			description : 'removeBootstrapper/removeBootstrappers testcase.',
			fn: function(){

				var b1 = new Bootstrap.Bootstrapper({ bootstrap: function(resource, params){} });
				var b2 = new Bootstrap.Bootstrapper({ bootstrap: function(resource, params){} });
				var b3 = new Bootstrap.Bootstrapper({ bootstrap: function(resource, params){} });

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addBootstrappers({ b1: b1, b2: b2, b3: b3 });

				bootstrappers.removeBootstrapper('b1');

				log( (bootstrappers.getLength() == 2) ? 'assert OK.' : 'removeBootstrapper NG.' );

				bootstrappers.removeBootstrappers('b2', 'b3');

				log( (bootstrappers.getLength() == 0) ? 'assert OK.' : 'removeBootstrappers NG.' );

			}

		});

		testcases.push({

			title: 'getBootstrapper/getBootstrappers/hasBootstrapper',
			description : 'getBootstrapper/getBootstrappers/hasBootstrapper testcase.',
			fn: function(){

				var b1 = new Bootstrap.Bootstrapper({ bootstrap: function(resource, params){} });
				var b2 = new Bootstrap.Bootstrapper({ bootstrap: function(resource, params){} });
				var b3 = new Bootstrap.Bootstrapper({ bootstrap: function(resource, params){} });

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addBootstrappers({ b1: b1, b2: b2, b3: b3 });

				log( (bootstrappers.hasBootstrapper('b1')) ? 'assert OK.' : 'hasBootstrapper NG.' );

				log( (bootstrappers.getBootstrapper('b1') == b1) ? 'assert OK.' : 'getBootstrapper NG.' );

				var collection = bootstrappers.getBootstrappers('b2', 'b3');

				log( (collection.shift() == b2) ? 'assert OK.' : 'getBootstrappers at first NG.' );
				log( (collection.shift() == b3) ? 'assert OK.' : 'getBootstrappers at second NG.' );

			}

		});



		testcases.push({

			title: 'setResource/setParams',
			description : 'setResource/setParams testcase.',
			fn: function(){

				var b1 = new Bootstrap.Bootstrapper({ bootstrap: function(resource, params){} });
				var b2 = new Bootstrap.Bootstrapper({ bootstrap: function(resource, params){} });

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addBootstrappers({ b1: b1, b2: b2 });

				var resource = {};
				var params = { name: 'foo' };

				bootstrappers.setResource(resource)
					.setParams(params);

				var collection = bootstrappers.getBootstrappers('b1', 'b2');


				log( (collection[0].getResource() == resource) ? 'assert OK.' : 'getResource at first NG.' );
				log( (collection[1].getResource() == resource) ? 'assert OK.' : 'getResource at second NG.' );

				log( (collection[0].getParams().name == params.name) ? 'assert OK.' : 'getParams at first NG.' );
				log( (collection[1].getParams().name == params.name) ? 'assert OK.' : 'getParams at second NG.' );

			}

		});


		makeActions(testcases);

	}, false);

}(window, document));
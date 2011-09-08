(function(win, doc, Bootstrap, Strategy){

	var BootstrapperA = new Class({

		Extends: Bootstrap.Bootstrapper,

		_params: {
		},

		_bootstrap: function(){
		}

	});


	var BootstrapperB = new Class({

		Extends: Bootstrap.Bootstrapper,

		_params: {
		},

		_bootstrap: function(){
		}

	});




	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({

			title: 'Asynchronous',
			description : 'Asynchronous testcase.',
			fn: function(){

				var resource = {};

				var collection = new Bootstrap.Bootstrappers();

				collection.addBootstrapper('proccessA', new BootstrapperA())
					.addBootstrapper('proccessB', new BootstrapperB());

				var strategy = new Strategy.Asynchronous({
					bootstrappers: collection,
					resource: resource
				});
				strategy.execute();

			}

		});

		makeActions(testcases);

	}, false);

}(window, document, Bootstrap, Bootstrap.Strategy));
(function(win, doc, Bootstrap){

	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({

			title: 'bootstrap',
			description : 'bootstrap sync testcase.',
			fn: function(){

				var bootstrapper = Application.Bootstrap.create('Synchronize', {
					resource: resource,
					configurations: {




					}
				});
				bootstrapper.execute();

			}

		});

		makeActions(testcases);

	}, false);

}(window, document, Bootstrap));
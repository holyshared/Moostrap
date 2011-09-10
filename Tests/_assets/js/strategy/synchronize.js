(function(win, doc, Bootstrap, Strategy){

	var BootstrapperA = new Class({

		Extends: Bootstrap.Bootstrapper,

		_options: {
		},

		_handler: function(){
			var that = this;
			var req = new Request.JSON({
				method: 'get',
				url: '/echo/json/',
				data:{
					json: '{ "name" : "a", "value" : "b" }'
				},
				onSuccess: function(response){
					that.success();
				},
				onFailture: function(response){
					that.failture();
				}
			});
			req.send();
		}

	});


	var BootstrapperB = new Class({

		Extends: Bootstrap.Bootstrapper,

		_options: {
		},

		_handler: function(){
			var that = this;
			var request = new Request.JSON({
				method: 'get',
				url: '/echo/json/',
				data:{
					json: '{ "name" : "a", "value" : "b" }'
				},
				onSuccess: function(response){
					that.success();
				},
				onFailture: function(response){
					that.failture();
				}
			});
			request.send();

		}

	});



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

				var strategy = new Strategy.Synchronize({
					bootstrappers: collection,
					resource: resource
				});
				strategy.init();
				strategy.execute();

			}

		});

		makeActions(testcases);

	}, false);

}(window, document, Bootstrap, Bootstrap.Strategy));
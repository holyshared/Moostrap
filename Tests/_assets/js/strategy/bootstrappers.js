(function(win, doc, Bootstrap){

	var BootstrapperA = this.BootstrapperA = new Class({

		Extends: Bootstrap.Bootstrapper,

		_options: {
			key1: null,
			key2: null
		},

		_handler: function(resource, options){
			var that = this;
			var request = new Request.JSON({
				method: 'get',
				url: '/echo/json/',
				data:{
					json: '{ "name" : "a", "value" : "b" }'
				},
				onSuccess: function(response){
					resource['bootstrapperA'] = response;
					that.success();
				},
				onFailture: function(response){
					that.failture();
				}
			});
			request.send();
		}

	});


	var BootstrapperB = this.BootstrapperB = new Class({

		Extends: Bootstrap.Bootstrapper,

		_options: {
			key1: null,
			key2: null
		},

		_handler: function(resource, options){
			var that = this;
			var request = new Request.JSON({
				method: 'get',
				url: '/echo/json/',
				data:{
					json: '{ "name" : "a", "value" : "b" }'
				},
				onSuccess: function(response){
					resource['bootstrapperB'] = response;
					that.success();
				},
				onFailture: function(response){
					that.failture();
				}
			});
			request.send();

		}

	});

}(window, document, Bootstrap));
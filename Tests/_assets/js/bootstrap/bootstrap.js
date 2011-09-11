(function(win, doc, Bootstrap){

	var App = this.App = function(){};
	App.SuccessBootstrap = new Bootstrap();
	App.FailureBootstrap = new Bootstrap();

	App.SuccessBootstrap.register('Bootstrap proccess A', {

		options: {
		},

		handler: function(resource, options){
			this.success();
		}

	});

	App.SuccessBootstrap.register('Bootstrap proccess B', {

		options: {
		},

		handler: function(resource, options){
			this.success();
		}

	});

	App.FailureBootstrap.register('Bootstrap proccess A', {

		options: {
		},

		handler: function(resource, options){
			this.success();
		}

	});

	App.FailureBootstrap.register('Bootstrap proccess B', {

		options: {
		},

		handler: function(resource, options){
			this.failure();
		}

	});

}(window, document, Bootstrap));
(function(win, doc, Bootstrap){

	var Application = this.Application = function(){};
	Application.Bootstrap = new Bootstrap();

	Application.Bootstrap.register('Bootstrap proccess A', {

		options: {
		},

		handler: function(resource, options){
			this.success();
		}

	});

	Application.Bootstrap.register('Bootstrap proccess B', {

		options: {
		},

		handler: function(resource, options){
			this.success();
		}

	});

}(window, document, Bootstrap));
(function(win, doc, TestModule){

this.TestModule = TestModule;

TestModule.register('proccessA', {

	options: {
		key1: null,
		key2: null
	},

	handler: function(resource, options){
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

TestModule.register('proccessB', {

	options: {
		key1: null,
		key2: null
	},

	handler: function(resource, options){
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

}(window, document, new Bootstrap.Module()));
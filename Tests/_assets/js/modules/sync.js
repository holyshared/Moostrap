(function(win, doc, bootstrap){

bootstrap.register('proccessA', {

	configuration: {
		key1: 'key1',
		key2: 'key2'
	},

	handler: function(resource, options){

		var that = this;
		var request = new Request.JSON({
			method: 'get',
			url: '/echo/json/',
			data:{
				json: '{ "key1" : "' + options.key1 + '", "key2": "' + options.key2 + '" }'
			},
			onSuccess: function(response){
				resource['key1'] = response.key1;
				resource['key2'] = response.key2;
				that.success();
			},
			onFailture: function(response){
				that.failture();
			}
		});
		request.send();

	}

});

bootstrap.register('proccessB', {

	configuration: {
		key3: 'key3',
		key4: 'key4'
	},

	handler: function(resource, options){

		var that = this;
		var request = new Request.JSON({
			method: 'get',
			url: '/echo/json/',
			data:{
				json: '{ "key3" : "' + options.key3 + '", "key4": "' + options.key4 + '" }'
			},
			onSuccess: function(response){
				resource['key3'] = response.key3;
				resource['key4'] = response.key4;
				that.success();
			},
			onFailture: function(response){
				that.failture();
			}
		});
		request.send();

	}

});

this.SuccessTestModule = bootstrap;

}(window, document, new Moostrap.Module()));


(function(win, doc, bootstrap){

bootstrap.register('proccessA', {

	configuration: {
		key1: 'key1',
		key2: 'key2'
	},

	handler: function(resource, options){

		var that = this;
		var request = new Request.JSON({
			method: 'get',
			url: '/echo/json/',
			data:{
				json: '{ "key1" : "' + options.key1 + '", "key2": "' + options.key2 + '" }'
			},
			onSuccess: function(response){
				resource['key1'] = response.key1;
				resource['key2'] = response.key2;
				that.success();
			},
			onFailture: function(response){
				that.failture();
			}
		});
		request.send();

	}

});

bootstrap.register('proccessB', {

	configuration: {
		key3: 'key3',
		key4: 'key4'
	},

	handler: function(resource, options){
		this.failure();
	}

});


this.FailureTestModule = bootstrap;

}(window, document, new Moostrap.Module()));

(function(win, doc, bootstrap){

bootstrap.register('proccessA', {

	options: {
		key1: 'key1',
		key2: 'key2'
	},

	handler: function(resource, options){

		resource['key1'] = options.key1;
		resource['key2'] = options.key2;

		this.success();
	}

});

bootstrap.register('proccessB', {

	options: {
		key3: 'key3',
		key4: 'key4'
	},

	handler: function(resource, options){

		resource['key3'] = options.key3;
		resource['key4'] = options.key4;

		this.success();
	}

});

this.SuccessTestModule = bootstrap;

}(window, document, new Bootstrap.Module()));



(function(win, doc, bootstrap){

bootstrap.register('proccessA', {

	options: {
		key1: 'key1',
		key2: 'key2'
	},

	handler: function(resource, options){

		resource['key1'] = options.key1;
		resource['key2'] = options.key2;

		this.success();
	}

});

bootstrap.register('proccessB', {

	options: {
		key3: 'key3',
		key4: 'key4'
	},

	handler: function(resource, options){
		this.failure();
	}

});


this.FailureTestModule = bootstrap;

}(window, document, new Bootstrap.Module()));

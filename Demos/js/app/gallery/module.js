(function(global, Bootstrapper){

var conditions = {
	'Cat': 'cat',
	'Dog': 'dog',
	'Bird': 'bird',
	'Insect': 'insect'
};

for (var key in conditions) {

	var defaultKeyword = conditions[key];

	Bootstrapper.register(key, {

		configuration: {
			key: key,
			text: defaultKeyword
		},

		handler: function(container, options){
			var that = this; 
			var keyword = options.text;
			var loader = new FlickrImageLoader({
				success: function(images){
					container.register(options.key, images);
					that.success();
				},
				failure: function(error){
					that.failure();
				}
			});
			loader.load(keyword);
		}

	});

}

global.Application.Module = Bootstrapper;

}(this, new Bootstrap.Module()));

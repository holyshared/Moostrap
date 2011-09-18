(function(global, Bootstrapper){

Bootstrapper.register('Proccess A', {

	options: {
	},

	handler: function(app, options){
		var that = this;
		setTimeout(function(){
			that.success();
		}, 1000);
	}

});


Bootstrapper.register('Proccess B', {

	options: {
	},

	handler: function(application, options){
		var that = this;
		setTimeout(function(){
			that.success();
		}, 1000);
	}

});


Bootstrapper.register('Proccess C', {

	options: {
	},

	handler: function(application, options){
		var that = this;
		setTimeout(function(){
			that.success();
		}, 1000);
	}

});

global.Application.Module = Bootstrapper;

}(this, new Bootstrap.Module()));

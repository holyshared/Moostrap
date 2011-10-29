/*
---
name: Bootstrap.Executer.Async

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.Executer.Executer

provides:
  - Bootstrap.Executer.Async
...
*/

(function(namespace){

namespace.Async = new Class({

	Extends: namespace.Executer,

	init: function(){
		var that = this;
		var module = this.getModule();
		var bootstrappers = module.getBootstrappers();
		if (that.getResource()) {
			Object.each(bootstrappers, function(bootstrapper, key){
				bootstrapper.setResource(that.getResource());
			});
		}
		Object.each(bootstrappers, function(bootstrapper, key){
			this._setupBootstrapper(key, bootstrapper);
		}, this);
	},

	bootstrap: function(){
		var module = this.getModule();
		var executeOrder = this.getExecuteOrder();
		while(executeOrder.hasNext()){
			if (this.isCompleted()){
				return;
			}
			var bootstrapperKey = executeOrder.current();
			var bootstrapper = module.getBootstrapper(bootstrapperKey);
			bootstrapper.execute();
			executeOrder.next();
		};
	},

	_setupBootstrapper: function(key, bootstrapper){
		var args = [key];
		var events = {
			success: this.onSuccess.bind(this, args),
			failure: this.onFailure.bind(this, args)
		};
		var options = this.getConfiguration(key) || {};
		bootstrapper.setConfigurations(options)
			.addEvents(events);
	},

	onSuccess: function(key){
		this._progress(key);
	}

});

}(Bootstrap.Executer));

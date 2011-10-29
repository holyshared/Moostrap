/*
---
name: Bootstrap.Executer.Sync

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.Executer.Executer

provides:
  - Bootstrap.Executer.Sync
...
*/

(function(namespace){

namespace.Sync = new Class({

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
		var bootstrapperKey = executeOrder.current();
		var bootstrapper = module.getBootstrapper(bootstrapperKey);
		bootstrapper.execute();
	},

	_setupBootstrapper: function(key, bootstrapper){
		var args = [key];
		var events = {
			success: this.onSuccess.bind(this, args),
			failure: this.onFailure.bind(this, args)
		};
		var options = this.getConfiguration(key) || {};
		bootstrapper.setOptions(options)
			.addEvents(events);
	},

	_nextBoostrap: function(){
		var module = this.getModule();
		var executeOrder = this.getExecuteOrder();
		executeOrder.next();
		if (executeOrder.hasNext()){
			var bootstrapperKey = executeOrder.current();
			var bootstrapper = module.getBootstrapper(bootstrapperKey);
			bootstrapper.execute();
		}
	},

	onSuccess: function(bootstrapperKey){
		this._progress(bootstrapperKey);
		this._nextBoostrap();
	}

});

}(Bootstrap.Executer));

/*
---
name: Bootstrap.Strategy.Sync

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.BootstrapStrategy

provides:
  - Bootstrap.Strategy.Sync
...
*/

(function(StrategyNamespace){

StrategyNamespace.Sync = new Class({

	Extends: StrategyNamespace.BootstrapStrategy,

	init: function(){
		var collection = this.getBootstrappers();
		collection.setResource(this.getResource());

		collection.each(function(bootstrapper, key){
			this._setupBootstrapper(key, bootstrapper);
		}, this);
	},

	bootstrap: function(){
		var collection = this.getBootstrappers();
		var bootstrapper = collection.current();
		bootstrapper.execute();
	},

	_setupBootstrapper: function(key, bootstrapper){
		var args = [key];
		var events = {
			success: this.onSuccess.bind(this, args),
			failure: this.onFailture.bind(this, args)
		};
		var options = this.getConfiguration(key) || {};
		bootstrapper.setOptions(options)
			.addEvents(events);
	},

	_nextBoostrap: function(){
		var collection = this.getBootstrappers();
		if (collection.hasNext()){
			var bootstrapper = collection.next();
			bootstrapper.execute();
		}
	},

	onSuccess: function(key){
		this._progress(key);
		this._nextBoostrap();
	}

});

}(Bootstrap.Strategy));

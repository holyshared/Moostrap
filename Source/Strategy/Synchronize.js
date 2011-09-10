/*
---
name: Bootstrap.Strategy.Synchronize

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.BootstrapStrategy

provides:
  - Bootstrap.Strategy.Synchronize
...
*/

(function(StrategyNamespace){

StrategyNamespace.Synchronize = new Class({

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
	    	onSuccess: this.onSuccess.bind(this, args),
	        onFailture: this.onFailture.bind(this, args)
	    };
		bootstrapper.addEvents(events);
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
	},

	onFailture: function(key){
		this._progress(key);
	}

});

}(Bootstrap.Strategy));

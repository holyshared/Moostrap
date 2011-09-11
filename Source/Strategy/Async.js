/*
---
name: Bootstrap.Strategy.Async

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.BootstrapStrategy

provides:
  - Bootstrap.Strategy.Async
...
*/

(function(StrategyNamespace){

StrategyNamespace.Async = new Class({

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
		collection.each(function(bootstrapper, key){
			if (this.isCompleted()){
				return;
			}
			bootstrapper.execute();
		}, this);
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

    onSuccess: function(key){
		this._progress(key);
    }

});

}(Bootstrap.Strategy));

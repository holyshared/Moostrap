/*
---
name: Bootstrap.Strategy.Asynchronous

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.BootstrapStrategy

provides:
  - Bootstrap.Strategy.Asynchronous
...
*/

(function(StrategyNamespace){

StrategyNamespace.Asynchronous = new Class({

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
			bootstrapper.execute();
		}, this);
    },

	_setupBootstrapper: function(key, bootstrapper){
		var args = [key];
	    var events = {
	    	onSuccess: this.onSuccess.bind(this, args),
	        onFailture: this.onFailture.bind(this, args)
	    };
		bootstrapper.addEvents(events);
	},

    onSuccess: function(key){
        this._progress(key);
    },

    onFailture: function(key){
        this._progress(key);
    }

});

}(Bootstrap.Strategy));

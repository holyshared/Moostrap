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

		collection.each(function(boostrapper, key){
			this._setupBoostrapper(key, boostrapper);
		}, this);
	},

    bootstrap: function(){
		var collection = this.getBootstrappers();
		collection.each(function(boostrapper, key){
			boostrapper.execute();
		}, this);
    },

	_setupBoostrapper: function(key, boostrapper){
		var args = [key];
	    var events = {
	    	onSuccess: this.onSuccess.bind(this, args),
	        onFailture: this.onFailture.bind(this, args)
	    };
		boostrapper.addEvent(events);
	},

    onSuccess: function(key){
        this._progress(key);
    },

    onFailture: function(key){
        this._progress(key);
    }

});

}(Bootstrap.Strategy));

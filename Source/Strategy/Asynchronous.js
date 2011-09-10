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

    onSuccess: function(key){
        this._progress(key);
    },

    onFailture: function(key){
        this._progress(key);
    },

    execute: function(){
        if (this.isCompleted()){
            return;
        }

        if (!this.isStarted()){
            this._started = true;
        }

        this.fireEvent('start');
//        this._initStrategy();

		var collection = this.getBootstrappers();
		collection.each(function(boostrapper, key){
			boostrapper.execute();
		}, this);



//        this._aaa();
        /*
        var boostrappers = this.getBootstrappers();
        Object.each(boostrappers.getBootstrappers(), function(bootstrap, key){
        	var args = [key];
            var events = {
                onSuccess: this.onSuccess.bind(this, args),
                onFailture: this.onFailture.bind(this, args)
            };
            bootstrap.setResource(this.getResource());
            bootstrap.addEvents(events);
            bootstrap.execute();
        }, this); */
    },

	init: function(){
		var collection = this.getBootstrappers();
		collection.setResource(this.getResource());

		collection.each(function(boostrapper, key){
			this._setupBoostrapper(key, boostrapper);
		}, this);
	},

	_setupBoostrapper: function(key, boostrapper){
		var args = [key];
	    var events = {
	    	onSuccess: this.onSuccess.bind(this, args),
	        onFailture: this.onFailture.bind(this, args)
	    };
		boostrapper.addEvent(events);
	}

});

}(Bootstrap.Strategy));

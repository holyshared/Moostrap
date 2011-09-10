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

	onSuccess: function(key){
		this._progress(key);
		this._nextBoostrap();
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

//		this._initStrategy();
		this._nextBoostrap();
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
	},

	_nextBoostrap: function(){
		var collection = this.getBootstrappers();
		var boostrapper = collection.next();
		boostrapper.execute();
	}

});

}(Bootstrap.Strategy));

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

		var boostrappers = this.getBootstrappers();
		var key = this.keys.shift();

		var bootstrapper = boostrappers.getBootstrapper(key);
		bootstrapper.execute();
	},

	onFailture: function(){
	},

    execute: function(){
        if (this.isCompleted()){
            return;
        }

        if (!this.isStarted()){
            this._started = true;
        }

        this.fireEvent('start');

		var boostrappers = this.getBootstrappers();
		boostrappers.setResource(this.getResource());

		this.keys = boostrappers.getKeys();

		var collection = boostrappers.getBootstrappers();
		Object.each(collection, function(boostrapper, key){
			var args = [key];
	        var events = {
	        	onSuccess: this.onSuccess.bind(this, args),
	            onFailture: this.onFailture.bind(this, args)
	        };
			boostrapper.addEvent(events);
		}, this);

		collection[this.keys.shift()].execute();
    }

});

}(Bootstrap.Strategy));

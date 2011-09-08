/*
---
name: Bootstrap.BootstrapStrategy

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.Bootstrappers
  - Bootstrap.Strategy

provides:
  - Bootstrap.BootstrapStrategy
...
*/

(function(StrategyNamespace){

StrategyNamespace.BootstrapStrategy = new Class({

	Implements: [Events],

    _counter: 0,
	_bootstrappers: null,
    _started: false,
    _completed: false,

	initialize: function(options){
		var setter;
		for (var key in options){
			setter = 'set' + key.capitalize();
			if (this[setter]) {
				this[setter].call(this, options[key]);
				delete options[key];
			}
		}
	},

    setBootstrappers: function(bootstrappers){
		if (!Type.isBootstrappers(bootstrappers)){
			throw new TypeError('invalid bootstrappers');
		}
        this._bootstrappers = bootstrappers;
        return this;
    },

    getBootstrappers: function(){
        return this._bootstrappers;
    },

    setResource: function(resource){
        this.resource = resource;
        return this;
    },

    getResource: function(){
        return this.resource;
    },

    getBootstrapper: function(key){
        var bootstrappers = this.getBootstrappers();
        return bootstrappers.getBootstrapper(key);
    },

    getBootstrapperKeys: function(){
		var bootstrappers = this.getBootstrappers();
		return bootstrappers.getKeys();
    },

    getLength: function(){
        var bootstrappers = this.getBootstrappers();
        return bootstrappers.getLength();
    },

    isCompleted: function(){
        return this._completed;
    },

    isStarted: function(){
        return this._started;
    },

    _progress: function(bootstrapperName){
        var args = [
            this._counter,
            this.getResource(),
            this.getLength()
        ];
        this.fireEvent('progress', args);

        if (this._counter++ >= this.getLength() - 1) {
            this._completed = true;
            this.fireEvent('complete');
            return;
        }
    },

    onSuccess: function(key){
        this._progress(key);
    },

    onFailture: function(key){
        this._progress(key);
    },

	//abstract
    execute: function(){
    }

});

}(Bootstrap.Strategy));
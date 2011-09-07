/*
---
name: Bootstrap.Strategy

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.Bootstrappers

provides:
  - Bootstrap.Strategy
...
*/

(function(Bootstrap){


Bootstrap.Strategy = new Class({

	Implements: [Events],

    _counter: 0,
	_bootstrappers: null,
    _started: false,
    _completed: false,

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

}(Bootstrap));
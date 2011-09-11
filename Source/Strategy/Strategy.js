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

	Implements: [Events, Options],

    _counter: 0,
	_bootstrappers: null,
	_configurations: null,
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
		this.setOptions(options);
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

    setConfigurations: function(configurations){
        this.configurations = configurations;
        return this;
    },

    getConfigurations: function(){
        return this.configurations;
    },

    getConfiguration: function(key){
        return this.configurations[key];
    },

    getBootstrapper: function(key){
        var bootstrappers = this.getBootstrappers();
        return bootstrappers.getItem(key);
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

    execute: function(){
        if (this.isCompleted()){
            return;
        }

        if (!this.isStarted()){
            this._started = true;
        }
		this.fireEvent('start');
		this.bootstrap();
	},

	//abstract
    bootstrap: function(){
	}

});

}(Bootstrap.Strategy));
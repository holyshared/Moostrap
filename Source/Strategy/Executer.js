/*
---
name: Bootstrap.Strategy.Executer

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.Bootstrappers
  - Bootstrap.Strategy

provides:
  - Bootstrap.Strategy.Executer
...
*/

(function(StrategyNamespace){

StrategyNamespace.Executer = new Class({

	Implements: [Events, Options],

	_counter: 0,
	_bootstrappers: null,
	_configurations: null,
	_started: false,
	_status: Bootstrap.NONE,

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

	_setResultStatus: function(type){
		var status = [Bootstrap.NONE, Bootstrap.SUCCESS, Bootstrap.FAILURE];
		if (!status.contains(type)) {
			throw new TypeError('invalid status');
		}
		this._status = type;
	},

	getResultStatus: function(){
		return this._status;
	},

	isStarted: function(){
		return this._started;
	},

	isSuccessed: function(){
		return (this.getResultStatus() == Bootstrap.SUCCESS) ? true : false;
	},

	isFailured: function(){
		return (this.getResultStatus() == Bootstrap.FAILURE) ? true : false;
	},

	isCompleted: function(){
		return (this.getResultStatus() != Bootstrap.NONE) ? true : false;
	},

	_progress: function(bootstrapperName){
		var args = [
			bootstrapperName,
			this._counter + 1,
			this.getLength()
		];
		this.fireEvent('progress', args);

		if (this._counter++ >= this.getLength() - 1) {
			if (this.isFailured()) {
				return;
			}
			this._setResultStatus(Bootstrap.SUCCESS);
			this.fireEvent('complete');
			this.fireEvent('success');
			return;
		}
	},

	execute: function(resource){
		if (this.isCompleted()){
			return;
		}

		if (!this.isStarted()){
			this._started = true;
		}

		if (resource){
			this.setResource(resource);
			this.getBootstrappers().setResource(resource);
		}

		this.fireEvent('start');
		this.bootstrap();
	},

	//abstract
	bootstrap: function(){
	},

	onFailure: function(key){
		this._setResultStatus(Bootstrap.FAILURE);
		this.fireEvent('complete');
		this.fireEvent('failure');
	}

});

}(Bootstrap.Strategy));
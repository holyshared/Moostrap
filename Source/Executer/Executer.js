/*
---
name: Bootstrap.Executer.Executer

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.Module
  - Bootstrap.Executer

provides:
  - Bootstrap.Executer.Executer
...
*/

(function(namespace){

namespace.Executer = new Class({

	Implements: [Events, Options],

	_completed: 0,
	_module: null,
	_configurations: {},
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

	setModule: function(module){
		this._module = module;
		return this;
	},

	getModule: function(){
		return this._module;
	},

	setResource: function(resource){
		this._resource = resource;
		return this;
	},

	getResource: function(){
		return this._resource;
	},

	setConfigurations: function(configurations){
		this._configurations = configurations;
		return this;
	},

	getConfigurations: function(){
		return this._configurations;
	},

	getConfiguration: function(key){
		if (!this._configurations[key]) {
			return;
		}
		return this._configurations[key];
	},

	getExecuteOrder: function(){
		if (this._executeOrder){
			return this._executeOrder;
		}
		this._executeOrder = this.getModule().getRegisteredKeys();
		return this._executeOrder;
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

	getCompletedCount: function(){
		return this._completed;
	},

	_progress: function(bootstrapperKey){

		var completed = this.getCompletedCount();
		var total = this.getModule().getLength();
		var args = [ bootstrapperKey, completed, total ];

		this.fireEvent('progress', args);

		this._completed++;
		if (completed >= total - 1) {
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

}(Bootstrap.Executer));
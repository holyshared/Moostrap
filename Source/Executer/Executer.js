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

	/* properties */
	_resource: null,
	_module: null,
	_configurations: {},

	_completed: 0,
	_started: false,
	_status: Bootstrap.NONE,

	initialize: function(options){
		this.setOptions(this._prepare(options));
	},

	_prepare: function(options){
		var executer = this,
			method = '',
			setter = '',
			handler = null;

		if (!options) {
			return;
		}

		['resource', 'configurations', 'module'].each(function(key){
			if (!options[key]){
				return;
			}
            method = key.capitalize();
            setter = 'set' + method;

			handler = executer[setter];
            handler.call(executer, options[key]);

            delete options[key];
		});
		return options;
	},

	init: function(){
		var model = this,
			module = this.getModule(),
			bootstrappers = null;

		bootstrappers = module.getBootstrappers();

		if (model.getResource()) {
			Object.each(bootstrappers, function(bootstrapper, key){
				bootstrapper.setResource(model.getResource());
			});
		}
		Object.each(bootstrappers, function(bootstrapper, key){
			model._setupBootstrapper(key, bootstrapper);
		});
	},

	setModule: function(module){
		if (!Type.isBootstrapModule(module)) {
			throw new TypeError('The specified module is not valid.');
		}
		this._module = module;
		return this;
	},

	getModule: function(){
		return this._module;
	},

	setResource: function(resource){
		if (!Type.isObject(resource)) {
			throw new TypeError('The specified resource is not valid.');
		}
		this._resource = resource;
		return this;
	},

	getResource: function(){
		return this._resource;
	},

	setConfigurations: function(configurations){
		if (!Type.isObject(configurations)) {
			throw new TypeError('The specified configurations is not valid.');
		}
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
			throw new TypeError('The specified status is not valid.');
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

	_notifyBootstrap: function(type, key){
		var args = [],
			completed = 0,
			module = this.getModule(),
			handler = null;

		handler = module.getBootstrapper(key);
		completed = this.getCompletedCount() + 1;

		args = [
			key,
			handler.getTitle(),
			completed,
			module.getLength()
		];
		this.fireEvent(type, args);
	},

	_beforeBootstrap: function(key){
		this._notifyBootstrap('beforeBootstrap', key);
	},

	_afterBootstrap: function(key){
		this._notifyBootstrap('afterBootstrap', key);
		if (this.getCompletedCount() >= this.getModule().getLength() - 1) {
			if (this.isFailured()) {
				return;
			}
			this._setResultStatus(Bootstrap.SUCCESS);
			this.fireEvent('complete');
			this.fireEvent('success');
			return;
		}
		this._completed++;
	},

	execute: function(resource){
		var module = this.getModule(),
			bootstrappers = {};

		if (this.isCompleted()){
			return;
		}

		if (!this.isStarted()){
			this._started = true;
		}

		if (resource){
			bootstrappers = module.getBootstrappers();
			Object.each(bootstrappers, function(bootstrapper, key){
				bootstrapper.setResource(resource);
			});
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
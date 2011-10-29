/*
---
name: Bootstrap

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Core
  - Core/Object
  - Core/Type
  - Core/Options
  - Core/Events

provides:
  - Bootstrap
  - Bootstrap.Bootstrapper
  - Bootstrap.Module
  - Bootstrap.Executer
...
*/

(function(){

var Bootstrap = this.Bootstrap = function(opts){

	var type, strategy, strategyKey, bootstrappers;
	var optionalOptions = ['resource', 'configurations', 'onStart', 'onProgress', 'onComplete', 'onSuccess', 'onFailure'];
	

	type = (opts.strategy) ? opts.strategy : 'async';
	strategyKey = type.capitalize(); 
	if (!Bootstrap.Strategy[strategyKey]) {
		throw new Error(strategyKey + ' is not found');
	}
	strategy = Bootstrap.Strategy[strategyKey];

	if (!opts.module) {
		throw new Error('module is not found');
	}
	bootstrappers = opts.module.getContainer();

	var optionals = Object.subset(opts, optionalOptions);
	var strategyOptions = Object.merge({
		'strategy': strategy,
		'bootstrappers': bootstrappers
	}, optionals);

	var boot = new strategy(strategyOptions);
	boot.init();
	return boot;

};

/*
 * var module = new Bootstrap.Module();
 * module.register('processe1', {
 * 	
 *     handler: function(resource, options){
 *     }
 * 
 * });
 * module.register('processe2', {
 * 	
 *     handler: function(resource, options){
 *     }
 * 
 * });
 * module.register('processe3', {
 * 	
 *     handler: function(resource, options){
 *     }
 * 
 * });
 * 
 * 
 * var executeOrder = module.getRegisteredKeys();
 * 
 * while(executeOrder.hasNext()) {
 * 
 *     var key = executeOrder.current();
 *     var bootstrapper = module.getBootstrapper(key);
 *     bootstrapper.execute();

 *     executeOrder.next();
 * }
 * 
 * 
 * 
 */

Bootstrap.Module = new Class({

	_executeOrder: [],
	_bootstrappers: {},

	register: function(key, options){
		if (this.isRegistered(key) === true){
			throw new Error(key + ' is already registered');
		}
		var bootstrapper = new Bootstrap.Bootstrapper(options);
		this._bootstrappers[key] = bootstrapper;
		this._executeOrder.push(key);
		return this;
	},

	unregister: function(key){
		if (this.isRegistered(key) === false){
			throw new Error(key + ' is not registered');
		}
		delete this._bootstrappers[key];
		this._executeOrder.erase(key);
		return this;
	},

	isRegistered: function(key){
		if (!this._bootstrappers[key]){
			return false;
		}
		return true;
	},

	getBootstrapper: function(key){
		if (this.isRegistered(key) === false){
			throw new Error(key + ' is not registered');
		}
		return this._bootstrappers[key];
	},

	getBootstrappers: function(){
		return this._bootstrappers;
	},

	getLength: function(){
		return this._executeOrder.length;
	},

	getRegisteredKeys: function(){
		var iterator = {
			_cursor: 0,
			_collection: this._executeOrder,
			hasNext: function(){
				return (this._collection.length - 1 >= this._cursor);
			},
			current: function(){
				return this._collection[this._cursor];
			},
			next: function(){
		        if (this.hasNext() === false){
					return;
		        }
				this._cursor++;
			},
			index: function(){
				return this._cursor;
			},
			length: function(){
				return this._collection.length;
			}
		};
		return iterator;
	}

});












Bootstrap.Executer = {};

Bootstrap.NONE = 0;
Bootstrap.SUCCESS = 1;
Bootstrap.FAILURE = 2;

Bootstrap.Bootstrapper = new Class({

	Implements: [Events],

	_status: null,
	_started: false,

	initialize: function(options){
		var props = { resource: null, options: null, handler: null };
		var opts = Object.merge(props, options);
		for (var key in opts){
			var name = '_' + key;
			if (opts[key]){
				this[name] = opts[key];
			}
			delete opts[key];
		}
	},

	success: function(){
		this._setResultStatus(Bootstrap.SUCCESS);
		this.fireEvent('complete');
		this.fireEvent('success');
	},

	failure: function(){
		this._setResultStatus(Bootstrap.FAILURE);
		this.fireEvent('complete');
		this.fireEvent('failure');
	},

	setResource: function(resource){
		if (!Type.isObject(resource)){
			throw new TypeError('invalid resurce');
		}
		this._resource = resource;
		return this;
	},

	getResource: function(){
		return this._resource;
	},

	getOptions: function(){
		return this._options;
	},

	setOptions: function(values){
		if (!Type.isObject(values)){
			throw new TypeError('invalid resurce');
		}
		this._options = Object.merge(this._options || {}, values);
		return this;
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

	isSuccessed: function(){
		return (this.getResultStatus() == Bootstrap.SUCCESS) ? true : false;
	},

	isFailured: function(){
		return (this.getResultStatus() == Bootstrap.FAILURE) ? true : false;
	},

	isCompleted: function(){
		return (this.getResultStatus() != Bootstrap.NONE) ? true : false;
	},

	isStarted: function(){
		return this._started;
	},

	execute: function(){
		this._started = true;
		this.fireEvent('start');

		this._handler.call(this, this.getResource(), this.getOptions());
	}

});

var BootstrapperType = new Type('Bootstrapper', Bootstrap.Bootstrapper);

}());
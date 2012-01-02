/*
---
name: Moostrap

description: The core module of Moostrap

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
  - Moostrap
  - Moostrap.Bootstrapper
  - Moostrap.Module
  - Moostrap.Executer
...
*/

(function(){

var Moostrap = this.Moostrap = function(executer, module, options){

	var executerType = executer,
		executerClass = null,
		instance = null;

	if (!Moostrap.Executer[executerType]){
		throw new Error(executerType + ' is not found');
	}
	executerClass = Moostrap.Executer[executerType];

	instance = new executerClass(options);
	instance.setModule(module).init();

	return instance;

};

Moostrap.Module = new Class({

	_executeOrder: [],
	_bootstrappers: {},

	register: function(key, options){
		if (this.isRegistered(key) === true){
			throw new Error(key + ' is already registered');
		}
		var bootstrapper = new Moostrap.Bootstrapper(options);
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

new Type('BootstrapModule', Moostrap.Module);


Moostrap.Executer = {};

Moostrap.NONE = 0;
Moostrap.SUCCESS = 1;
Moostrap.FAILURE = 2;

Moostrap.Bootstrapper = new Class({

	Implements: [Events, Options],

	_title: null,
	_resource: null,
	_configuration: null,
	_handler: null,

	_status: null,
	_started: false,

	initialize: function(options){
		this.setOptions(this._prepare(options));
	},

	_prepare: function(options){
		var bootstrapper = this
			method = null,
			setter = null,
			handler = null;

		['title', 'resource', 'configuration', 'handler'].each(function(key){
			if (!options[key]){
				return;
			}

			method = key.capitalize();
			setter = 'set' + method;

			handler = bootstrapper[setter];
			handler.call(bootstrapper, options[key]);

			delete options[key];
		});
		return options;
	},

	success: function(){
		this._setResultStatus(Moostrap.SUCCESS);
		this.fireEvent('complete');
		this.fireEvent('success');
	},

	failure: function(){
		this._setResultStatus(Moostrap.FAILURE);
		this.fireEvent('complete');
		this.fireEvent('failure');
	},

	setTitle: function(title){
		if (!Type.isString(title)){
			throw new TypeError('The specified title is not valid.');
		}
		this._title = title;
	},

	getTitle: function(){
		return this._title;
	},

	setResource: function(resource){
		if (!Type.isObject(resource)){
			throw new TypeError('The specified resource is not valid.');
		}
		this._resource = resource;
		return this;
	},

	getResource: function(){
		return this._resource;
	},

	getConfiguration: function(){
		return this._configuration;
	},

	setConfiguration: function(value){
		if (!value){
			throw new TypeError('The specified configuration is not valid.');
		}
		switch(typeOf(value)){
			case 'object':
				this._configuration = Object.merge(this._configuration || {}, value);
				break;
			case 'array':
				if (!this._configuration){
					this._configuration = [];
				}
				this._configuration.combine(value);
				break;
			default:
				this._configuration = value;
				break;
		}
		return this;
	},

	setHandler: function(handler){
		if (!Type.isFunction(handler)){
			throw new TypeError('The specified value is not function');
		}
		this._handler = handler;
	},

	_setResultStatus: function(type){
		var status = [Moostrap.NONE, Moostrap.SUCCESS, Moostrap.FAILURE];
		if (!status.contains(type)) {
			throw new TypeError('The specified status is not valid.');
		}
		this._status = type;
	},

	getResultStatus: function(){
		return this._status;
	},

	isSuccessed: function(){
		return (this.getResultStatus() == Moostrap.SUCCESS) ? true : false;
	},

	isFailured: function(){
		return (this.getResultStatus() == Moostrap.FAILURE) ? true : false;
	},

	isCompleted: function(){
		return (this.getResultStatus() != Moostrap.NONE) ? true : false;
	},

	isStarted: function(){
		return this._started;
	},

	execute: function(){
		this._started = true;
		this.fireEvent('start');

		this._handler.call(this, this.getResource(), this.getConfiguration());
	}

});

new Type('Bootstrapper', Moostrap.Bootstrapper);

}());
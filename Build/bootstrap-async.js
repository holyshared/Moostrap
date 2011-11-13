/*
---
name: Bootstrap

description: The core module of Bootstrap

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

var Bootstrap = this.Bootstrap = function(executer, module, options){

	var executerType = executer.capitalize();
		executerClass = null;
		instance = null;

	if (!Bootstrap.Executer[executerType]){
		throw new Error(executerType + 'is not found');
	}
	executerClass = Bootstrap.Executer[executerType];

	instance = new executerClass(options);
	instance.setModule(module).init();

	return instance;

};

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

new Type('BootstrapModule', Bootstrap.Module);


Bootstrap.Executer = {};

Bootstrap.NONE = 0;
Bootstrap.SUCCESS = 1;
Bootstrap.FAILURE = 2;

Bootstrap.Bootstrapper = new Class({

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
		var bootstrapper = this;
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
		this._setResultStatus(Bootstrap.SUCCESS);
		this.fireEvent('complete');
		this.fireEvent('success');
	},

	failure: function(){
		this._setResultStatus(Bootstrap.FAILURE);
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
		var status = [Bootstrap.NONE, Bootstrap.SUCCESS, Bootstrap.FAILURE];
		if (!status.contains(type)) {
			throw new TypeError('The specified status is not valid.');
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

		this._handler.call(this, this.getResource(), this.getConfiguration());
	}

});

new Type('Bootstrapper', Bootstrap.Bootstrapper);

}());

/*
---
name: Bootstrap.Executer.Executer

description: The core class which performs an initialization module

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

/*
---
name: Bootstrap.Executer.Async

description: The execution module which carries out asynchronous execution of the initialization module

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.Executer.Executer

provides:
  - Bootstrap.Executer.Async
...
*/

(function(namespace){

namespace.Async = new Class({

	Extends: namespace.Executer,

	bootstrap: function(){
		var key = null,
			handler = null,
			module = this.getModule(),
			executeOrder = this.getExecuteOrder();

		while(executeOrder.hasNext()){
			if (this.isCompleted()){
				return;
			}
			key = executeOrder.current();
			handler = module.getBootstrapper(key);

			this._beforeBootstrap(key);

			handler.execute();
			executeOrder.next();
		};
	},

	_setupBootstrapper: function(key, bootstrapper){
		var args = [key],
			events = {},
			configuration = null;

		Object.append(events, {
			success: this.onSuccess.bind(this, args),
			failure: this.onFailure.bind(this, args)
		});

		configuration = this.getConfiguration(key) || {};

		bootstrapper.setConfiguration(configuration)
			.addEvents(events);
	},

	onSuccess: function(key){
		this._afterBootstrap(key);
	}

});

}(Bootstrap.Executer));


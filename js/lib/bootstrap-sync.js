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
  - Bootstrap.Bootstrappers
  - Bootstrap.Module
  - Bootstrap.Strategy
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

Bootstrap.Module = new Class({

	initialize: function(){
		this._collection = new Bootstrap.Bootstrappers();
	},

	register: function(name, options){
		var bootstrapper = new Bootstrap.Bootstrapper(options);
		this._collection.addItem(name, bootstrapper);
	},

	unregister: function(name){
		this._collection.removeItem(name);
	},

	isRegistered: function(name){
		return this._collection.hasItem(name);
	},

	getContainer: function(){
		return this._collection;
	},

	setContainer: function(collection){
		if (!Type.isBootstrappers()) {
			throw new TypeError('invalid container');
		}
		this._collection = collection;
	}

});


Bootstrap.Strategy = {};

Bootstrap.NONE = 0;
Bootstrap.SUCCESS = 1;
Bootstrap.FAILURE = 2;

Bootstrap.Bootstrapper = new Class({

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

	getResource: function(){
		return this._resource;
	},

	getOptions: function(){
		return this._options;
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
	}

});


var BootstrapperType = new Type('Bootstrapper', Bootstrap.Bootstrapper);
BootstrapperType.mirror(function(name){

	var hooks = {};

	hooks[name] = function(){
		var args = arguments;
		var items = this.getItems();
		var results = [];
		Object.each(items, function(item, key){
			var result = item[name].apply(item, args);
			if ((typeOf(result) != 'bootstrapper')) {
				results.push(result);
			}
		});
		return (results.length > 0 ) ? results : this;
	};

	Bootstrap.Bootstrappers.implement(hooks);

});


Bootstrap.Bootstrappers = new Class({

	_cursor: 0,
	_keys: [],
	_bootstrappers: {},

	getLength: function(){
		return this._keys.length;
	},

	getKeys: function(){
		return this._keys;
	},

	getItem: function(key){
		if (!this.hasItem(key)){
			throw new Error('not found key'); 
		}
		return this._bootstrappers[key];
	},

	getItems: function(){
		var collection = {};
		var keys = (arguments.length > 0) ? Array.from(arguments) : this._keys;
		keys.each(function(key, index){
			collection[key] = this.getItem(key);
		}, this);
		return collection;
	},

	hasItem: function(key){
		return this._keys.contains(key);
	},

	addItem: function(key, bootstrap){
		if (!Type.isBootstrapper(bootstrap)){ 
			throw new TypeError('invalid bootstrap.');
		}
		this._keys.push(key);
		this._bootstrappers[key] = bootstrap;
		return this;
	},

	addItems: function(bootstrappers){
		if (!Type.isObject(bootstrappers)) {
			throw new TypeError('invalid bootstrappers.');
		}
		Object.each(bootstrappers, function(bootstrap, key){
			this.addItem(key, bootstrap);
		}, this);
		return this;
	},

	removeItem: function(key){
		if (!this.hasItem(key)){
			throw new Error('not found key'); 
		}
		this._keys.erase(key);
		delete this._bootstrappers[key];
		return this;
	},

	removeItems: function(){
		var keys = (arguments.length > 0) ? Array.from(arguments) : this._keys;
		keys.each(function(key, index){
			this.removeItem(key);
		}, this);
		return this;
	},

	hasNext: function(){
		var length = this._keys.length - 1;
		return (length >= this._cursor + 1) ? true : false;
	},

	next: function(){
		if (!this.hasNext()){
			return;
		}
		var key = this._keys[++this._cursor];
		return this._bootstrappers[key];
	},

	current: function(){
		var key = this._keys[this._cursor];
		return this._bootstrappers[key];
	},

	rewind: function(){
		this._cursor = 0;
	},

	each: function(handler, target){
		var args = [this._bootstrappers].append(Array.from(arguments));
		Object.each.apply(Object, args);
	}

});

var BootstrappersType = new Type('Bootstrappers', Bootstrap.Bootstrappers);

Bootstrap.Bootstrapper.implement({

	setResource: function(resource){
		if (!Type.isObject(resource)){
			throw new TypeError('invalid resurce');
		}
		this._resource = resource;
		return this;
	},

	setOptions: function(values){
		if (!Type.isObject(values)){
			throw new TypeError('invalid resurce');
		}
		this._options = Object.merge(this._options || {}, values);
		return this;
	},

	execute: function(){
		this._started = true;
		this.fireEvent('start');

		this._handler.call(this, this.getResource(), this.getOptions());
	}

});

Bootstrap.Bootstrapper.implement(new Events());

}());

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

/*
---
name: Bootstrap.Strategy.Sync

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.Strategy.Executer

provides:
  - Bootstrap.Strategy.Sync
...
*/

(function(StrategyNamespace){

StrategyNamespace.Sync = new Class({

	Extends: StrategyNamespace.Executer,

	init: function(){
		var collection = this.getBootstrappers();
		if (this.getResource()) {
			collection.setResource(this.getResource());
		}

		collection.each(function(bootstrapper, key){
			this._setupBootstrapper(key, bootstrapper);
		}, this);
	},

	bootstrap: function(){
		var collection = this.getBootstrappers();
		var bootstrapper = collection.current();
		bootstrapper.execute();
	},

	_setupBootstrapper: function(key, bootstrapper){
		var args = [key];
		var events = {
			success: this.onSuccess.bind(this, args),
			failure: this.onFailure.bind(this, args)
		};
		var options = this.getConfiguration(key) || {};
		bootstrapper.setOptions(options)
			.addEvents(events);
	},

	_nextBoostrap: function(){
		var collection = this.getBootstrappers();
		if (collection.hasNext()){
			var bootstrapper = collection.next();
			bootstrapper.execute();
		}
	},

	onSuccess: function(key){
		this._progress(key);
		this._nextBoostrap();
	}

});

}(Bootstrap.Strategy));


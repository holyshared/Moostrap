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
  - Bootstrap.Strategy
...
*/

(function(){

var Bootstrap = this.Bootstrap = new Class({

	initialize:function(){
		this._collection = new Bootstrap.Bootstrappers();
	},

	register: function(name, options){
		this._collection.addItem(name, options);
	},

	unregister: function(name){
		this._collection.removeItem(name);
	},

	isRegistered: function(name){
		return this._collection.hasItem(name);
	},

	create: function(resource, type, options){
		if (!Bootstrap.Strategy[type]) {
			throw new Error(type + 'is not found');
		}
		var Strategy = Bootstrap.Strategy[type];
		var strategy = new Strategy(Object.merge(options, resource));
		strategy.init();
		return strategy;
//		return new Strategy(Object.merge(options, resource));
	}

});
Bootstrap.Strategy = {};

Bootstrap.NONE = 0;
Bootstrap.SUCCESS = 1;
Bootstrap.FAILURE = 2;

Bootstrap.Bootstrapper = new Class({

//	Implements: [Events],

	_status: null,
	_started: false,
	_resource: null,
	_params: null,
	_bootstrap: null,

	initialize: function(options){
		var setter;
		for (var key in options){
			property = '_' + key;
			if (this[property]) {
				this[property] = options[key];
				delete options[key];
			}
		}
	},

	notifySuccess: function(){
		this._setResultStatus(Bootstrap.SUCCESS);
		this.fireEvent('complete');
		this.fireEvent('success');
	},

	notifyFailure: function(){
		this._setResultStatus(Bootstrap.FAILURE);
		this.fireEvent('complete');
		this.fireEvent('failure');
	},

	getResource: function(){
		return this._resource;
	},

	getParams: function(){
		return this._params;
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
        var items = this.getBootstrappers();
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

	_keys: [],
	_bootstrappers: {},

	/* old methods */
    addBootstrapper: function(key, bootstrap){
		if (!Type.isBootstrapper(bootstrap)){ 
			throw new TypeError('invalid bootstrap.');
		}
		this._bootstrappers[key] = bootstrap;
		return this;
    },

    addBootstrappers: function(bootstrappers){
		if (!Type.isObject(bootstrappers)) {
			throw new TypeError('invalid bootstrappers.');
		}
		Object.each(bootstrappers, function(bootstrap, key){
			this.addBootstrapper(key, bootstrap);
		}, this);
		return this;
    },

    removeBootstrapper: function(key){
		if (!this.hasBootstrapper(key)){
			throw new Error('not found key'); 
		}
		delete this._bootstrappers[key];
		return this;
    },

    removeBootstrappers: function(){
		var keys = (arguments.length <= 0)
		? Object.keys(this._bootstrappers)
		: Array.from(arguments);

		keys.each(function(key, index){
			this.removeBootstrapper(key);
		}, this);
		return this;
    },

    getBootstrapper: function(key){
		if (!this.hasBootstrapper(key)){
			throw new Error('not found key'); 
		}
		return this._bootstrappers[key];
    },

    getBootstrappers: function(){
		var keys = (arguments.length <= 0)
		? Object.keys(this._bootstrappers)
		: Array.from(arguments);

		var collection = {};

		keys.each(function(key, index){
			collection[key] = this.getBootstrapper(key);
		}, this);
		return collection;
    },

    hasBootstrapper: function(key){
		return (this._bootstrappers[key]) ? true : false;
    },
	/* old methods */

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
//		var keys = (arguments.length <= 0)
	//	? Object.keys(this._bootstrappers)
		//: Array.from(arguments);


		var keys = (arguments.length > 0) ? Array.from(arguments) : this._keys;
		var collection = {};

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
		return (length > this._cursor + 1) ? true : false;
	},

	next: function(){
		if (!this.hasNext()){
			return;
		}
		var key = this._keys[++this._cursor];
		return this._bootstrappers[key];
	},

	rewind: function(){
		this._cursor = 0;
	},

	each: function(handler){
		Object.each(this._bootstrappers, handler);
	}

});

var BootstrappersType = new Type('Bootstrappers', Bootstrap.Bootstrappers);
//BootstrappersType.alias('each', Object.each);



Bootstrap.Bootstrapper.implement({

    setResource: function(resource){
        if (!Type.isObject(resource)){
        	throw new TypeError('invalid resurce');
        }
        this._resource = resource;
        return this;
	},

    setParams: function(values){
        if (!Type.isObject(values)){
            throw new TypeError('invalid resurce');
        }
		this._params = Object.merge(this._params || {}, values);
		return this;
	},
/*
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
*/
	execute: function(){
		this._started = true;
		this.fireEvent('start');
		this._bootstrap.call(this, this.getResource(), this.getParams());
	}

});

Bootstrap.Bootstrapper.implement(new Events());

}());
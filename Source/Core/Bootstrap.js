/*
---
name: Bootstrap

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Core
  - Core/Options
  - Core/Events

provides:
  - Bootstrap
  - Bootstrap.Bootstrapper
  - Bootstrap.Bootstrappers
...
*/

(function(){

var Bootstrap = this.Bootstrap = new Class({

	register: function(){
	},

	unregister: function(){
	},

	isRegistered: function(){
	},

	create: function(){
	}

});

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
		this._params = options.params;
		this._bootstrap = options.bootstrap;
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
        items.each(function(item, key){

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

	_bootstrappers: {},

    addBootstrapper: function(key, bootstrap){
		if (!Type.isBootstrapper(bootstrap)){ 
			throw new TypeError('invalid bootstrap.');
		}
		this._bootstrappers[key] = bootstrap;
    },

    addBootstrappers: function(bootstrappers){
		if (!Type.isObject(bootstrappers)) {
			throw new TypeError('invalid bootstrappers.');
		}
		Object.each(bootstrappers, function(bootstrap, key){
			this.addBootstrapper(key, bootstrap);
		}, this);
    },

    removeBootstrapper: function(key){
		if (!this.hasBootstrapper(key)){
			throw new Error('not found key'); 
		}
		delete this._bootstrappers[key];
    },

    removeBootstrappers: function(){
		var keys = (arguments.length <= 0)
		? Object.keys(this._bootstrappers)
		: Array.from(arguments);

		keys.each(function(key, index){
			this.removeBootstrapper(key);
		}, this);
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

		var collection = [];

		keys.each(function(key, index){
			collection.push(this.getBootstrapper(key));
		}, this);
		return collection;
    },

    hasBootstrapper: function(key){
		return (this._bootstrappers[key]) ? true : false;
    },

    getLength: function(){
		return Object.getLength(this._bootstrappers);
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
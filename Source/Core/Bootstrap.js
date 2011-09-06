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

	Implements: [Events],

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
    }

/*
	isSuccessed: function(){
		return (this.getResultStatus() == Bootstrap.SUCCESS) ? true : false;
	},

	isFailureed: function(){
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
		this.bootstrap.call(this, this.getResource(), this.params);
	}
*/

});


var BootstrapperType = new Type('Bootstrapper', Bootstrap.Bootstrapper);
BootstrapperType.mirror(function(name){

    var hook = function(){
        var args = argstments;
        var items = this.getBootstrappers();
        var results = [];
        Object.each(this.items, function(item, key){
            var result = item[name].apply(item, args);
            results.push(result);
        });
        return results.every(function(value){
            return value;
        });
    }

    Bootstrap.Bootstrappers.implement(name, hook);

});


Bootstrap.Bootstrappers = new Class({
/*
	_resource: null,

    getResource: function(){
		return this._resource;
    },
*/
    addBootstrapper: function(){
    },

    addBootstrappers: function(){
    },

    removeBootstrapper: function(){
    },

    removeBootstrappers: function(){
    },

    getBootstrapper: function(){
    },

    getBootstrappers: function(){
    },

    hasBootstrapper: function(){
    },

    getLength: function(){
    }

});

var BootstrappersType = new Type('Bootstrappers', Bootstrap.Bootstrappers);




Bootstrap.Bootstrapper.implement({

    setResource: function(resource){
        if (!Type.isObject(resource)){
            new TypeError('invalid resurce');
        }
        this._resource = resource;
        return this;
	},

    setParams: function(values){
        if (!Type.isObject(values)){
            new TypeError('invalid resurce');
        }
		this._params = Object.merge(this._params || {}, values);
		return this;
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
		this._bootstrap.call(this, this.getResource(), this.getParams());
	}

});







}());
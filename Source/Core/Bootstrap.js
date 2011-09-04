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

	initialize: function(options){
		this.params = options.params;
		this.bootstrap = options.bootstrap;
	},

	notifySuccess: function(){
		this.fireEvent('success');
	},

	notifyFailure: function(){
		this.fireEvent('failure');
	},

	getResource: function(){
	},

	setResource: function(){
	},

	setResultStatus: function(type){
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

});

}());

Bootstrap
==============================================================



Class: Bootstrap
--------------------------------------------------------------

### Example

var Controller = {};

Controller.Bootstrap = {
	bootstrap: new Bootstrap();
};

Controller.Bootstrap.register('MyResource', {

	options: {
		key1: 'key1_value',
		key2: 'key2_value'
	},

	bootstrap: function(resource, options){
		//options.key1
		//options.key2

		//Notify to status
		this.notifySuccess();
		this.notifyFailure();
	}

});

### Methods

* register
* unregister
* isRegistered
* create



Class: Bootstrap.Bootstrapper
--------------------------------------------------------------

### Example

var MyBootstrapper = new Bootstrap.Bootstrapper({

	options: {
		key1: 'key1_value',
		key2: 'key2_value'
	},

	bootstrap: function(resource, options){
		//options.key1
		//options.key2

		//Notify to status
		this.notifySuccess();
		this.notifyFailure();
	}

});



### Methods

* bootstrap
* notifySuccess
* notifyFailure
* setResultStatus
* isSuccessed
* isFailureed
* isCompleted
* isStarted

Class: Bootstrap.Strategy
--------------------------------------------------------------


### Example

var MyClass = new Class({

	_id: null,
	_name: 'resource',

	someMethod: function(){
	}

});

var MyStrategy = new Class({

	Extends: Bootstrap.Strategy

});

var resource = new MyClass();

var bootstrap = new Bootstrap();

var strategy = new MyStrategy();
strategy.setBootstrap(bootstrap)
	.setResource(resource);

strategy.bootstrap('MyReqource1');
strategy.bootstrap('MyReqource2');


### Methods

* setBootstrap
* getBootstrap
* setResource
* getResource
* getBootstrapper
* getBootstrappers
* getBootstrapperKeys
* isCompleted
* isStarted
* bootstrap

### Events

* onProgress
* onBeforeBootstrap
* onAfterBootstrap
* onComplete


Class: Bootstrap.Strategy.Simple
--------------------------------------------------------------


### Example

var MyClass = new Class({

	_id: null,
	_name: 'resource',

	someMethod: function(){
	}

});

var resource = new MyClass();

var simpleBootstrapper = Bootstrap.create(resource, 'Simple', {
	onBeforeBootstrap: function(resource){
		//do something
	},
	onAfterBootstrap: function(resource){
		//do something
	}
});
simpleBootstrapper.bootstrap();

### Methods

* bootstrap
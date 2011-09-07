
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

	params: {
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

* notifySuccess
* notifyFailure
* getResultStatus
* isSuccessed
* isFailured
* isCompleted
* isStarted
* execute
* setResource
* getResource
* setParams
* getParams
* bootstrap - abstract


### Events

* onStart
* onComplete
* onSuccess
* onFailure


Class: Bootstrap.Bootstrappers
--------------------------------------------------------------

var bootstrapper = new Bootstrap.Bootstrapper({

	params: {
	},

	bootstrap: function(resource, options){
	}

});

var bootstrappers = new Bootstrap.Bootstrappers();

bootstrappers.addBootstrapper(bootstrapper);

bootstrappers.addBootstrappers(bootstrappers);


bootstrappers.addEvent('start', function(){

});
bootstrappers.addEvent('success', function(){

});
bootstrappers.addEvent('failure', function(){

});
bootstrappers.addEvent('complete', function(){

});


bootstrappers.execute();


### Methods

* addBootstrapper
* addBootstrappers
* removeBootstrapper
* removeBootstrappers
* getBootstrapper
* getBootstrappers
* hasBootstrapper
* getLength
//* isSuccessed
//* isFailureed
//* isCompleted
* execute
* setResource
* setParams


### Events

* onStart
* onComplete
* onSuccess
* onFailure





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

var collection = new Bootstrap.Bootstrappers();

var strategy = new MyStrategy();
strategy.setBootstrappers(collection)
	.setResource(resource);

strategy.bootstrap('MyReqource1');
strategy.bootstrap('MyReqource2');


### Methods

* setResource
* getResource
* setBootstrappers
* getBootstrappers
* getBootstrapper
* getBootstrapperKeys
* getLength
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
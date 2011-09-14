
Bootstrap
==============================================================



Class: Bootstrap
--------------------------------------------------------------

### Methods

* register
* unregister
* isRegistered
* create



Class: Bootstrap.Bootstrapper
--------------------------------------------------------------


### Methods

* success
* failure
* getResultStatus
* isSuccessed
* isFailured
* isCompleted
* isStarted
* execute
* setResource
* getResource
* setOptions
* getOptions


### Events

* onStart
* onComplete
* onSuccess
* onFailure


Class: Bootstrap.Bootstrappers
--------------------------------------------------------------

### Methods

* addItem
* addItems
* removeItem
* removeItems
* getItem
* getItems
* hasItem
* getLength
* execute
* setResource
* setOptions
* each
* hasNext
* next
* rewind



Class: Bootstrap.BootstrapStrategy
--------------------------------------------------------------

### Methods

* setResource
* getResource
* setBootstrappers
* getBootstrappers
* getConfigurations
* setConfigurations
* getConfiguration
* getBootstrapper
* getBootstrapperKeys
* getLength
* isCompleted
* isStarted
* isSuccessed
* isFailured
* bootstrap

### Events

* onStart
* onProgress
* onComplete


Class: Bootstrap.Strategy.Async
--------------------------------------------------------------



### Methods

* bootstrap




Class: Bootstrap.Strategy.Sync
--------------------------------------------------------------



### Methods

* bootstrap

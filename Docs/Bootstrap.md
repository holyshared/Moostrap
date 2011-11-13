
Bootstrap
==============================================================

Class: Bootstrap.Module
--------------------------------------------------------------

### Methods

* register(key, options)
* unregister(key)
* isRegistered(key)
* getBootstrapper(key)
* getBootstrappers()
* getLength()
* getRegisteredKeys()



Class: Bootstrap.Bootstrapper
--------------------------------------------------------------

### Methods

* success()
* failure()
* setTitle(title)
* getTitle()
* setResource(resource)
* getResource()
* getConfiguration()
* setConfiguration(value)
* setHandler(handler)
* getResultStatus()
* isSuccessed()
* isFailured()
* isCompleted()
* isStarted()
* execute()

### Events

* onStart
* onComplete
* onSuccess
* onFailure



Class: Bootstrap.Executer.Executer
--------------------------------------------------------------

### Methods

* init()
* setModule(module)
* getModule()
* setResource(resource)
* getResource()
* setConfigurations(configurations)
* getConfigurations()
* getConfiguration(key)
* getExecuteOrder()
* getResultStatus()
* isStarted()
* isSuccessed()
* isFailured()
* isCompleted()
* getCompletedCount()
* execute(resource)
* bootstrap() - abstract method

### Events

* onStart
* onBeforeBootstrap(key, title, current, total)
* onAfterBootstrap(key, title, current, total)
* onComplete
* onSuccess
* onFailure



Class: Bootstrap.Executer.Async
--------------------------------------------------------------

### Extends

Bootstrap.Executer.Executer

### Methods

* bootstrap



Class: Bootstrap.Executer.Sync
--------------------------------------------------------------

### Extends

Bootstrap.Executer.Executer

### Methods

* bootstrap

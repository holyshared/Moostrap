/*
---
name: Moostrap.Executer.Sync

description: The execution module which carries out synchronous execution of the initialization module

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Moostrap.Executer.Executer

provides:
  - Moostrap.Executer.Sync
...
*/

(function(namespace){

namespace.Sync = new Class({

	Extends: namespace.Executer,

	bootstrap: function(){
		var key = null,
			handler = null,
			module = this.getModule(),
			executeOrder = this.getExecuteOrder();

		key = executeOrder.current();
		handler = module.getBootstrapper(key);

		this._beforeBootstrap(key);
		handler.execute();
	},

	_setupBootstrapper: function(key, bootstrapper){
		var args = [key],
			events = {},
			configuration = null;

		Object.append(events, {
			success: this.onSuccess.bind(this, args),
			failure: this.onFailure.bind(this, args)
		});

		configuration = this.getConfiguration(key) || null;
		if (configuration){
			bootstrapper.setConfiguration(configuration);
		}
		bootstrapper.addEvents(events);
	},

	_nextBoostrap: function(){
		var key = null,
			handler = null,
			module = this.getModule(),
			executeOrder = this.getExecuteOrder();

		executeOrder.next();
		if (executeOrder.hasNext()){
			key = executeOrder.current();
			this._beforeBootstrap(key);
			handler = module.getBootstrapper(key);
			handler.execute();
		}
	},

	onSuccess: function(key){
		this._afterBootstrap(key);
		this._nextBoostrap();
	}

});

}(Moostrap.Executer));

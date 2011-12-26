/*
---
name: Moostrap.Executer.Async

description: The execution module which carries out asynchronous execution of the initialization module

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Moostrap.Executer.Executer

provides:
  - Moostrap.Executer.Async
...
*/

(function(namespace){

namespace.Async = new Class({

	Extends: namespace.Executer,

	bootstrap: function(){
		var key = null,
			handler = null,
			module = this.getModule(),
			executeOrder = this.getExecuteOrder();

		while(executeOrder.hasNext()){
			if (this.isCompleted()){
				return;
			}
			key = executeOrder.current();
			handler = module.getBootstrapper(key);

			this._beforeBootstrap(key);

			handler.execute();
			executeOrder.next();
		};
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

	onSuccess: function(key){
		this._afterBootstrap(key);
	}

});

}(Moostrap.Executer));

/*
---
name: Bootstrap.Executer.Async

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.Executer.Executer

provides:
  - Bootstrap.Executer.Async
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

		configuration = this.getConfiguration(key) || {};

		bootstrapper.setConfiguration(configuration)
			.addEvents(events);
	},

	onSuccess: function(key){
		this._afterBootstrap(key);
	}

});

}(Bootstrap.Executer));

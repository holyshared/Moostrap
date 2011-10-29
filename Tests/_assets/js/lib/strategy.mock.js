(function(Executer){

var StrategyMock = this.StrategyMock = new Class({

	Extends: Executer.Executer,

	onSuccess: function(key){
		this._progress(key);
	},

    bootstrap: function(){
		var bootstrappers = this.getModule().getBootstrappers();
		Object.each(bootstrappers, function(bootstrap, key){
        	var args = [key];
            var events = {
            	onSuccess: this.onSuccess.bind(this, args),
                onFailure: this.onFailure.bind(this, args)
            };
            bootstrap.setResource(this.getResource());
            bootstrap.addEvents(events);
            bootstrap.execute();
        }, this);

    }

});

}(Bootstrap.Executer));

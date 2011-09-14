(function(StrategyNamespace){

var StrategyMock = this.StrategyMock = new Class({

	Extends: StrategyNamespace.Executer,

	onSuccess: function(key){
		this._progress(key);
	},

    bootstrap: function(){
        var boostrappers = this.getBootstrappers();
        boostrappers.each(function(bootstrap, key){
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

}(Bootstrap.Strategy));

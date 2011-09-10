(function(StrategyNamespace){

var StrategyMock = this.StrategyMock = new Class({

	Extends: StrategyNamespace.BootstrapStrategy,

	onSuccess: function(key){
		this._progress(key);
	},

	onFailture: function(key){
		this._progress(key);
	},

    bootstrap: function(){
        var boostrappers = this.getBootstrappers();
        boostrappers.each(function(bootstrap, key){
        	var args = [key];
            var events = {
                onSuccess: this.onSuccess.bind(this, args),
                onFailture: this.onFailture.bind(this, args)
            };
            bootstrap.setResource(this.getResource());
            bootstrap.addEvents(events);
            bootstrap.execute();
        }, this);
    }

});

}(Bootstrap.Strategy));

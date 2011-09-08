(function(StrategyNamespace){

var StrategyMock = this.StrategyMock = new Class({

	Extends: StrategyNamespace.BootstrapStrategy,

    execute: function(){
        if (this.isCompleted()){
            return;
        }

        if (!this.isStarted()){
            this._started = true;
        }

        this.fireEvent('start');
        var boostrappers = this.getBootstrappers();
        Object.each(boostrappers.getBootstrappers(), function(bootstrap, key){
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
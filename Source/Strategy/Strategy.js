/*
---
name: Bootstrap.Strategy

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap

provides:
  - Bootstrap.Strategy
...
*/

(function(Bootstrap){


Bootstrap.Strategy = new Class({

    _counter: 0,
    _started: false,
    _completed: false,

    setBootstrap: function(bootstrap){
        this.bootstrap = bootstrap;
    },

    getBootstrap: function(){
        return this.bootstrap;
    },

    setResource: function(resource){
        this.resource = resource;
    },

    getResource: function(){
        return this.resource;
    },

    getBootstrapper: function(key){
        var bootstrappers = this.getBootstrap().getBootstrappers();
        return bootstrappers[key];
    },

    getBootstrappers: function(){
        return this.getBootstrap().getBootstrappers();
    },

    getBootstrapperKeys: function(){
        var bootstrappers = this.getBootstrap().getBootstrappers();
        return Object.keys(bootstrappers);
    },

    getLength: function(){
        var bootstrappers = this.getBootstrap().getBootstrappers();
        return Object.length(bootstrappers);
    },

    isCompleted: function(){
        return this._completed;
    },

    isStarted: function(){
        return this._started;
    },

    _progress: function(bootstrapperName){
        if (this._counter++ > this.getLength()) {
            this.fireEvent('complete');
            this._completed = true;
            return;
        }

        var args = [
            this._counter,
            this.getResource(),
            this.getLength();
        ];
        this.fireEvent('progress', args);
    },

    _onSuccess: function(){
        this._progress(key);
    },

    _onFailture: function(){
        this._progress(key);
    },

    bootstrap: function(){
        if (this.isCompleted()){
            return;
        }

        if (!this.isStarted()){
            this._started = true;
        }

        this.fireEvent('start');
        var boostrappers = this.getBootstrappers();
        Object.each(boostrappers, function(bootstrap, key){
            var events = {
                onSuccess: this._onSuccess.bind(this),
                onFailture: this._onFailture.bind(this)
            };
            bootstrap.setResource(this.getResource());
            bootstrap.addEvents(events);
            bootstrap.bootstrap();
        });
    }

});

}(Bootstrap));
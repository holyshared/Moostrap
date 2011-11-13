
Bootstrap
====================================

![Bootstrap](http://holyshared.github.com/Bootstrap/images/logo.jpg "Bootstrap")

**Bootstrap** offers the initialization function of large-scale application from middle-scale.  
Every one initialization processing is performed and it secures that initialization of application is ensured. 

![Bootstrap package](http://holyshared.github.com/Bootstrap/images/package_image.jpg "Bootstrap package")


How to use
------------------------------------------------------------------------

### 1. Creation of an initialization module

In order to use Bootstrap, an initialization module is created first.  
Using **Bootstrap.Module**, initialization processing is registered and it goes.  

Two or more registration is possible for initialization processing.  

The option at the time of execution and the processing to perform are specified.  
When it succeeds in processing, **success** is performed, and **failure** is performed when it fails.  


#### bootstrap.js

    (function(){

        var Bootstrapper = this.Bootstrapper = new Bootstrap.Module();

        //Initialization processing is registered by the name of **bootstrapA**. 
        //A basic setup of application is performed.
        Bootstrapper.register('bootstrapA', {

			title: 'bootstrapA',

            configuration: {
                name: 'bootstrap',
                description: 'bootstrap description'
            },

            handler: function(app, opts){

                try {
                    app.setName(opts.name)
                        .setDescription(opts.description);
                } catch(exception) {
                    this.failure();
                }
                this.success();

            }

        });

        //Initialization processing is registered by the name of **bootstrapB**. 
        //The URL list of pictures is acquired using Ajax. 
        Bootstrapper.register('bootstrapB', {

			title: 'bootstrapB',

            configuration: {
                url: 'http://example.com/images/'
            },

            handler: function(app, opts){

                var loader = new Request.JSON({
                    url: opts.url,
                    onSuccess: function(response){

                        app.setImages(response.images);

                        this.success();
                    },
                    onFailture: function(xhr){
                        this.failure();
                    }
                });
                loader.send();

            }

        });

    }());


### 2. An initialization module is used.

Application is initialized using the created module.
An **onSuccess event** will be generated if all initialization is performed.  
If processing goes wrong in the middle of initialization processing, processing is interrupted and execution of application is stopped.

#### applicaton.js

    (function(module){

        var application = {

            start: function(){

                //do something

            },

            abort: function(){

                //do something

            },

            run: function(){

                var app = this;
                var bootstrapper = new Bootstrap('sync', module, {
                    //A setup of an initialization module is specified.
                    //A setup here carries out the override of the default setup.
                    configurations: {

                        //The override of the setup of bootstrapA is carried out.
                        bootstrapA: {
                            name: 'Hello world',
                            description: 'My first application'
                        },

                        //The override of the setup of bootstrapB is carried out.
                        bootstrapB: {
                            url: 'http://helloworld.com/images/'
                        }
                    },
                    onSuccess: app.start,
                    onFailture: app.abort
                });

                //Application is started.
                bootstrapper.execute(app);

            }

        };

        application.run();

    }(Bootstrapper));





Initialization pattern
------------------------------------------------------------------------

### Synchronization

The initialization processing using **Bootstrap.Executer.Sync** performs processings in order one by one.  
Initialization processing is performed whenever one processing is completed.

![Bootstrap.Executer.Sync](http://holyshared.github.com/Bootstrap/images/bootstrap_sync_flow.jpg "Bootstrap.Executer.Sync")


#### The method of building 

packager Bootstrap/Bootstrap.Executer.Sync +use-only Bootstrap


### Asynchronous

The initialization processing using **Bootstrap.Executer.Async** performs processings in order one by one.  
A synchronization is not taken at this time.

![Bootstrap.Executer.Async](http://holyshared.github.com/Bootstrap/images/bootstrap_async_flow.jpg "Bootstrap.Executer.Async")


#### The method of building 

packager Bootstrap/Bootstrap.Executer.Async +use-only Bootstrap


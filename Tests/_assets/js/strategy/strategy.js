(function(win, doc){

/*
* 
* getLength
* isCompleted
* isStarted
* bootstrap
*/

	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			
			title: 'setResource/getResource',
			description : 'setResource/getResource testcase.',
			fn: function(){

				var resource = {};

				var mock = new StrategyMock();
				mock.setResource(resource);

				log( (mock.getResource() == resource) ? 'assert OK' : 'resource setter/getter NG' );

			}

		});


		testcases.push({
			
			title: 'setBootstrappers/getBootstrappers',
			description : 'setBootstrappers/getBootstrappers testcase.',
			fn: function(){

				var bootstrappers = new Bootstrap.Bootstrappers();

				var mock = new StrategyMock();
				mock.setBootstrappers(bootstrappers);

				log( (mock.getBootstrappers() == bootstrappers) ? 'assert OK' : 'bootstrappers setter/getter NG' );

			}

		});


		testcases.push({
			
			title: 'getBootstrapper',
			description : 'getBootstrapper testcase.',
			fn: function(){

				var item = new Bootstrap.Bootstrapper({
					bootstrap: function(){
					}
				});

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addBootstrapper('item', item);

				var mock = new StrategyMock();
				mock.setBootstrappers(bootstrappers);

				log( (mock.getBootstrapper('item') == item) ? 'assert OK' : 'getBootstrapper NG' );

			}

		});


		testcases.push({
			
			title: 'getBootstrapperKeys',
			description : 'getBootstrapperKeys testcase.',
			fn: function(){

				var item = new Bootstrap.Bootstrapper({
					bootstrap: function(){
					}
				});

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addBootstrapper('item', item);

				var mock = new StrategyMock();
				mock.setBootstrappers(bootstrappers);

				log( (mock.getBootstrapperKeys()[0] == 'item') ? 'assert OK' : 'getBootstrapperKeys NG' );

			}

		});





		testcases.push({
			
			title: 'isCompleted/isStarted',
			description : 'isCompleted/isStarted testcase.',
			fn: function(){

				var resource = {};

				var progress = 0, complete = false;

				var item1 = new Bootstrap.Bootstrapper({
					bootstrap: function(){
						this.notifySuccess();
					}
				});

				var item2 = new Bootstrap.Bootstrapper({
					bootstrap: function(){
						this.notifySuccess();
					}
				});

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addBootstrapper('item', item1)
					.addBootstrapper('item2', item2);

				var mock = new StrategyMock();
				mock.setResource(resource)
					.setBootstrappers(bootstrappers)
					.addEvents({
						progress: function(counter, resource, total){
							progress++;
						},
						complete: function(){
							complete = true;

							log( (mock.isCompleted()) ? 'assert OK' : 'isCompleted NG' );
							log( (mock.isStarted()) ? 'assert OK' : 'isStarted NG' );
						}
					})
					.execute();

				log( (progress >= 2) ? 'assert OK' : 'progress NG' );
				log( (complete) ? 'assert OK' : 'complete NG' );

			}

		});






		makeActions(testcases);

	}, false);

}(window, document));
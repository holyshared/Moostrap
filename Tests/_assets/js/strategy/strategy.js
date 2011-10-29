(function(win, doc){

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
			
			title: 'setModule/getModule',
			description : 'setModule/getModule testcase.',
			fn: function(){

				var module = new Bootstrap.Module();

				var mock = new StrategyMock();
				mock.setModule(module);

				log( (mock.getModule() == module) ? 'assert OK' : 'module setter/getter NG' );

			}

		});

/*
		testcases.push({
			
			title: 'getBootstrapper',
			description : 'getBootstrapper testcase.',
			fn: function(){

				var module = new Bootstrap.Module();
				module.register('item', {

					handler: function(){
					}

				});

				var mock = new StrategyMock();
				mock.setModule(module);

				log( (mock.getBootstrapper('item') == item) ? 'assert OK' : 'getBootstrapper NG' );

			}

		});
*/
/*
		testcases.push({
			
			title: 'getBootstrapperKeys',
			description : 'getBootstrapperKeys testcase.',
			fn: function(){

				var item = new Bootstrap.Bootstrapper({
					handler: function(){
					}
				});

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addItem('item', item);

				var mock = new StrategyMock();
				mock.setBootstrappers(bootstrappers);

				log( (mock.getBootstrapperKeys()[0] == 'item') ? 'assert OK' : 'getBootstrapperKeys NG' );

			}

		});
*/




		testcases.push({
			
			title: 'isCompleted/isStarted/isSuccessed',
			description : 'isCompleted/isStarted/isSuccessed testcase.',
			fn: function(){

				var resource = {};

				var progress = 0, complete = false;
/*
				var item1 = new Bootstrap.Bootstrapper({
					handler: function(){
						this.success();
					}
				});

				var item2 = new Bootstrap.Bootstrapper({
					handler: function(){
						this.success();
					}
				});

*/

				var module = new Bootstrap.Module();
				module.register('item1', {

					handler: function(){
						this.success();
					}

				});
				module.register('item2', {

					handler: function(){
						this.success();
					}

				});








				//var bootstrappers = new Bootstrap.Bootstrappers();
			////	bootstrappers.addItem('item', item1)
				//	.addItem('item2', item2);

				var mock = new StrategyMock();
				mock.setResource(resource)
					.setModule(module)
					.addEvents({
						success: function(){
							log( (mock.isSuccessed()) ? 'isSuccessed OK' : 'isSuccessed NG' );
						},
						progress: function(counter, resource, total){
							progress++;
						},
						complete: function(){
							complete = true;

							log( (mock.isCompleted()) ? 'isCompleted OK' : 'isCompleted NG' );
							log( (mock.isStarted()) ? 'isStarted OK' : 'isStarted NG' );
						}
					})
					.execute();

				log( (progress >= 2) ? 'progress OK' : 'progress NG' );
				log( (complete) ? 'complete OK' : 'complete NG' );

			}

		});


		testcases.push({
			
			title: 'isFailured',
			description : 'isFailured testcase.',
			fn: function(){

				var resource = {};



				var module = new Bootstrap.Module();
				module.register('item1', {

					handler: function(){
						this.success();
					}

				});
				module.register('item2', {

					handler: function(){
						this.failure();
					}

				});


/*
				var item1 = new Bootstrap.Bootstrapper({
					handler: function(){
						this.success();
					}
				});

				var item2 = new Bootstrap.Bootstrapper({
					handler: function(){
						this.failure();
					}
				});
*/



			//	var bootstrappers = new Bootstrap.Bootstrappers();
			//	bootstrappers.addItem('item', item1)
			//		.addItem('item2', item2);

				var mock = new StrategyMock();
				mock.setResource(resource)
					.setModule(module)
					.addEvents({
						failure: function(){
							log( (mock.isFailured()) ? 'isFailured OK' : 'isFailured NG' );
						}
					})
					.execute();

			}

		});

		makeActions(testcases);

	}, false);

}(window, document));
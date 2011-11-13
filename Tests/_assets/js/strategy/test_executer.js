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


		testcases.push({
			title: 'isCompleted/isStarted/isSuccessed',
			description : 'isCompleted/isStarted/isSuccessed testcase.',
			fn: function(){

				var resource = {};
				var before = 0,
					after = 0,
					complete = false;

				var module = new Bootstrap.Module();
				module.register('item1', {
					title: 'item1 - title',
					handler: function(){
						this.success();
					}
				});
				module.register('item2', {
					title: 'item2 - title',
					handler: function(){
						this.success();
					}
				});

				var mock = new StrategyMock();
				mock.setResource(resource)
					.setModule(module)
					.addEvents({
						success: function(){
							log( (mock.isSuccessed()) ? 'isSuccessed OK' : 'isSuccessed NG' );
						},
						beforeBootstrap: function(key, title, current, total){
							before++;
							log( title + ' - ' + current + ' / ' + total);
						},
						afterBootstrap: function(key, title, current, total){
							after++;
							log( title + ' - ' + current + ' / ' + total);
						},
						complete: function(){
							complete = true;

							log( (mock.isCompleted()) ? 'isCompleted OK' : 'isCompleted NG' );
							log( (mock.isStarted()) ? 'isStarted OK' : 'isStarted NG' );
						}
					})
					.execute();

				log( (before >= 2) ? 'before OK' : 'before NG' );
				log( (after >= 2) ? 'after OK' : 'after NG' );
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
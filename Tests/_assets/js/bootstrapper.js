(function(win, doc){

	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			title: 'setTitle/getTitle',
			description : 'setTitle/getTitle testcase.',
			fn: function(){
				var bootstrap1 = new Moostrap.Bootstrapper({
					title: 'title1',
					handler: function(resource, options){}
				});
				log( (bootstrap1.getTitle() == 'title1') ? 'assert OK.' : 'title setter/getter NG.' );
			}
		});


		testcases.push({
			
			title: 'setResource/getResource',
			description : 'setResource/getResource testcase.',
			fn: function(){

				var bootstrap = new Moostrap.Bootstrapper({
					configuration: {
						name: 'foo',
						value: 1
					},
					handler: function(resource, options){
					}
				});

				var mock = new Mock();

				bootstrap.setResource(mock);

				log( (bootstrap.getResource() == mock) ? 'assert OK.' : 'resource setter/getter NG.' );

			}

		});



		testcases.push({
			
			title: 'setConfiguration/getConfiguration',
			description : 'setConfiguration/getConfiguration testcase.',
			fn: function(){

				var bootstrap = new Moostrap.Bootstrapper({
					configuration: {
						name: 'foo',
						value: 1
					},
					handler: function(resource, options){
					}
				});

				bootstrap.setConfiguration({
					name: 'bar',
					value: 100
				});

				var result = (bootstrap.getConfiguration().name == 'bar' && bootstrap.getConfiguration().value == 100);

				log( (result) ? 'assert OK.' : 'options setter/getter NG.' );

			}

		});


		testcases.push({
			
			title: 'execute - success',
			description : 'execute - success testcase.',
			fn: function(){

				var started = false, completed = false;

				var mock = new Mock();

				var bootstrap = new Moostrap.Bootstrapper({
					configuration: {
						name: 'foo',
						value: 1
					},
					handler: function(resource, options){

						resource.setName(options.name);
						resource.setValue(options.value);

						this.success();
					}
				});


				bootstrap.addEvent('start', function(){
					started = true;
				});

				bootstrap.addEvent('complete', function(){
					completed = true;
				});

				bootstrap.addEvent('success', function(){

					log( (bootstrap.isStarted()) ? 'assert OK' : 'SUCCESS - isStarted NG' );
					log( (bootstrap.getResultStatus() == Moostrap.SUCCESS) ? 'assert OK' : 'SUCCESS - getResultStatus NG' );
					log( (bootstrap.isSuccessed()) ? 'assert OK' : 'SUCCESS - isSuccessed NG' );
					log( (bootstrap.isCompleted()) ? 'assert OK' : 'SUCCESS - isCompleted NG' );

					log( (mock.getName() == 'bar') ? 'assert OK' : 'SUCCESS - name initialize NG' );
					log( (mock.getValue() == 2) ? 'assert OK' : 'SUCCESS - value initialize NG' );

				});

				bootstrap.setResource(mock)
					.setConfiguration({
						name: 'bar',
						value: 2
					})
					.execute();

				log( (started) ? 'start OK' : 'start NG' );
				log( (completed) ? 'complete OK' : 'complete NG' );

			}

		});


		testcases.push({
			
			title: 'execute - failure',
			description : 'execute - failure testcase.',
			fn: function(){

				var started = false, completed = false;

				var mock = new Mock();

				var bootstrap = new Moostrap.Bootstrapper({
					configuration: {
						name: 'foo',
						value: 1
					},
					handler: function(resource, options){

						resource.setName(options.name);
						resource.setValue(options.value);

						this.failure();
					}
				});

				bootstrap.addEvent('start', function(){
					started = true;
				});

				bootstrap.addEvent('complete', function(){
					completed = true;
				});

				bootstrap.addEvent('failure', function(){

					log( (bootstrap.isStarted()) ? 'assert OK' : 'FAILURE - isStarted NG' );
					log( (bootstrap.getResultStatus() == Moostrap.FAILURE) ? 'assert OK' : 'FAILURE - getResultStatus NG' );
					log( (bootstrap.isFailured()) ? 'assert OK' : 'FAILURE - isFailured NG' );
					log( (bootstrap.isCompleted()) ? 'assert OK' : 'FAILURE - isCompleted NG' );

					log( (mock.getName() == 'bar') ? 'assert OK' : 'FAILURE - name initialize NG' );
					log( (mock.getValue() == 2) ? 'assert OK' : 'FAILURE - value initialize NG' );

				});

				bootstrap.setResource(mock)
					.setConfiguration({
						name: 'bar',
						value: 2
					})
					.execute();

				log( (started) ? 'start OK' : 'start NG' );
				log( (completed) ? 'complete OK' : 'complete NG' );

			}

		});

		makeActions(testcases);

	}, false);

}(window, document));
(function(win, doc){

	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			
			title: 'setResource/getResource',
			description : 'setResource/getResource testcase.',
			fn: function(){

				var bootstrap = new Bootstrap.Bootstrapper({
					params: {
						name: 'foo',
						value: 1
					},
					bootstrap: function(resource, params){
					}
				});

				var mock = new Mock();

				bootstrap.setResource(mock);

				log( (bootstrap.getResource() == mock) ? 'assert OK.' : 'resource setter/getter NG.' );

			}

		});



		testcases.push({
			
			title: 'setParams/getParams',
			description : 'setParams/getParams testcase.',
			fn: function(){

				var bootstrap = new Bootstrap.Bootstrapper({
					params: {
						name: 'foo',
						value: 1
					},
					bootstrap: function(resource, params){
					}
				});

				bootstrap.setParams({
					name: 'bar',
					value: 100
				});

				var result = (bootstrap.getParams().name == 'bar' && bootstrap.getParams().value == 100);

				log( (result) ? 'assert OK.' : 'params setter/getter NG.' );

			}

		});


		testcases.push({
			
			title: 'execute - success',
			description : 'execute - success testcase.',
			fn: function(){

				var started = false, completed = false;

				var mock = new Mock();

				var bootstrap = new Bootstrap.Bootstrapper({
					params: {
						name: 'foo',
						value: 1
					},
					bootstrap: function(resource, params){

						resource.setName(params.name);
						resource.setValue(params.value);

						this.notifySuccess();
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
					log( (bootstrap.getResultStatus() == Bootstrap.SUCCESS) ? 'assert OK' : 'SUCCESS - getResultStatus NG' );
					log( (bootstrap.isSuccessed()) ? 'assert OK' : 'SUCCESS - isSuccessed NG' );
					log( (bootstrap.isCompleted()) ? 'assert OK' : 'SUCCESS - isCompleted NG' );

					log( (mock.getName() == 'bar') ? 'assert OK' : 'SUCCESS - name initialize NG' );
					log( (mock.getValue() == 2) ? 'assert OK' : 'SUCCESS - value initialize NG' );

				});

				bootstrap.setResource(mock)
					.setParams({
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

				var bootstrap = new Bootstrap.Bootstrapper({
					params: {
						name: 'foo',
						value: 1
					},
					bootstrap: function(resource, params){

						resource.setName(params.name);
						resource.setValue(params.value);

						this.notifyFailure();
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
					log( (bootstrap.getResultStatus() == Bootstrap.FAILURE) ? 'assert OK' : 'FAILURE - getResultStatus NG' );
					log( (bootstrap.isFailured()) ? 'assert OK' : 'FAILURE - isFailured NG' );
					log( (bootstrap.isCompleted()) ? 'assert OK' : 'FAILURE - isCompleted NG' );

					log( (mock.getName() == 'bar') ? 'assert OK' : 'FAILURE - name initialize NG' );
					log( (mock.getValue() == 2) ? 'assert OK' : 'FAILURE - value initialize NG' );

				});

				bootstrap.setResource(mock)
					.setParams({
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
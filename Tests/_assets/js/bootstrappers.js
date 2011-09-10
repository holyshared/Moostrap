(function(win, doc){

/*
* execute
*/


	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({

			title: 'addItem/addItems/getLength',
			description : 'addItem/addItems/getLength testcase.',
			fn: function(){

				var b1 = new Bootstrap.Bootstrapper({ handler: function(resource, params){} });
				var b2 = new Bootstrap.Bootstrapper({ handler: function(resource, params){} });
				var b3 = new Bootstrap.Bootstrapper({ handler: function(resource, params){} });

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addItem('b1', b1);

				log( (bootstrappers.getLength() == 1) ? 'assert OK.' : 'addItem NG.' );

				bootstrappers.addItems({ b2: b2, b3: b3 });

				log( (bootstrappers.getLength() == 3) ? 'assert OK.' : 'addItems NG.' );

			}

		});


		testcases.push({

			title: 'removeItem/removeItems',
			description : 'removeItem/removeItems testcase.',
			fn: function(){

				var b1 = new Bootstrap.Bootstrapper({ handler: function(resource, params){} });
				var b2 = new Bootstrap.Bootstrapper({ handler: function(resource, params){} });
				var b3 = new Bootstrap.Bootstrapper({ handler: function(resource, params){} });

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addItems({ b1: b1, b2: b2, b3: b3 });

				bootstrappers.removeItem('b1');

				log( (bootstrappers.getLength() == 2) ? 'assert OK.' : 'removeItem NG.' );

				bootstrappers.removeItems('b2', 'b3');

				log( (bootstrappers.getLength() == 0) ? 'assert OK.' : 'removeItems NG.' );

			}

		});


		testcases.push({

			title: 'getItem/getItems/hasItem',
			description : 'getItem/getItems/hasItem testcase.',
			fn: function(){

				var b1 = new Bootstrap.Bootstrapper({ handler: function(resource, params){} });
				var b2 = new Bootstrap.Bootstrapper({ handler: function(resource, params){} });
				var b3 = new Bootstrap.Bootstrapper({ handler: function(resource, params){} });

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addItems({ b1: b1, b2: b2, b3: b3 });

				log( (bootstrappers.hasItem('b1')) ? 'assert OK.' : 'hasItem NG.' );

				log( (bootstrappers.getItem('b1') == b1) ? 'assert OK.' : 'getItem NG.' );

				var collection = bootstrappers.getItems('b2', 'b3');

				log( (collection['b2'] == b2) ? 'assert OK.' : 'getItems at first NG.' );
				log( (collection['b3'] == b3) ? 'assert OK.' : 'getItems at second NG.' );

			}

		});


		testcases.push({

			title: 'setResource/setParams',
			description : 'setResource/setOptions testcase.',
			fn: function(){

				var b1 = new Bootstrap.Bootstrapper({ handler: function(resource, params){} });
				var b2 = new Bootstrap.Bootstrapper({ handler: function(resource, params){} });

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addItems({ b1: b1, b2: b2 });

				var resource = {};
				var params = { name: 'foo' };

				bootstrappers.setResource(resource)
					.setOptions(params);

				var collection = bootstrappers.getItems('b1', 'b2');

				log( (collection['b1'].getResource() == resource) ? 'assert OK.' : 'getResource at first NG.' );
				log( (collection['b2'].getResource() == resource) ? 'assert OK.' : 'getResource at second NG.' );

				log( (collection['b1'].getOptions().name == params.name) ? 'assert OK.' : 'getOptions at first NG.' );
				log( (collection['b2'].getOptions().name == params.name) ? 'assert OK.' : 'getOptions at second NG.' );

			}

		});






		testcases.push({

			title: 'execute',
			description : 'execute testcase.',
			fn: function(){

				var b1 = new Bootstrap.Bootstrapper({
					handler: function(resource, params){
						this.success();
					}
				});

				var b2 = new Bootstrap.Bootstrapper({
					handler: function(resource, params){
						this.failure();
					}
				});

				var b3 = new Bootstrap.Bootstrapper({
					handler: function(resource, params){
						this.failure();
					}
				});

				var bootstrappers = new Bootstrap.Bootstrappers();
				bootstrappers.addItems({
					b1: b1,
					b2: b2,
					b3: b3
				});


				var success = 0, failure = 0, complete = 0;

				bootstrappers.addEvent('success', function(){
					success++;
				});

				bootstrappers.addEvent('failure', function(){
					failure++;
				});

				bootstrappers.addEvent('complete', function(){
					complete++;
				});
				bootstrappers.execute();

				log((complete >= 3) ? 'assert OK' : 'complete OK');
				log((success >= 1) ? 'assert OK' : 'success OK');
				log((failure >= 2) ? 'assert OK' : 'failure OK');

			}

		});

		makeActions(testcases);

	}, false);

}(window, document));
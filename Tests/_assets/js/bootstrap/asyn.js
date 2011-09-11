(function(win, doc, Bootstrap, Strategy){

	win.addEventListener('load', function(){

		var testcases = [];

		testcases.push({

			title: '',
			description : 'testcase.',
			fn: function(){
			}

		});

		makeActions(testcases);

	}, false);

}(window, document, Bootstrap, Bootstrap.Strategy));
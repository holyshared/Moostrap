(function(global, doc){

global.MessageDecorator = MessageDecorator;
global.ProgressDialog = ProgressDialog;

function MessageDecorator(target){
	this.target = target;
}

MessageDecorator.implement({

	applyDecorater: function(key, message){
		var handler = null;
		var args = [key, message];
		if (typeof message === 'string'){
			handler = this.stringDecorater(key, message);
		} else {
			handler = this.handlerDecorater(key, message);
		}
		this.target[key] = handler;
	},

	stringDecorater: function(key, message){
		var app = this.target;
		var handler = this.check(key, message);
		if (handler){
			return handler;
		}

		var beforeHandler = this.target[key];
		var handler = function(){
			app.print(message);
			beforeHandler.apply(app, arguments);
		};
		return handler;
	},

	handlerDecorater: function(key, message){
		var app = this.target;
		var handler = this.check(key, message);
		if (handler){
			return handler;
		}

		var beforeHandler = this.target[key];
		var handler = function(){
			var output = message.apply(app, arguments);
			app.print(output);
			beforeHandler.apply(app, arguments);
		};
		return handler;
	},

	check: function(key, message){
		var app = this.target;
		if (this.target[key]){
			return;
		}
		return function(){
			var output = (typeof message === 'string') ? message : message.apply(app, arguments);
			app.print(output);
		};
	}
});

function ProgressDialog(){
	this.container = doc.createElement('ul');
	this.container.setAttribute('class', 'message');	
}

ProgressDialog.implement({

	print: function(message){
		var li = doc.createElement('li');
		var text = doc.createTextNode(message);
		li.appendChild(text);
		this.container.appendChild(li);
	},

	open: function(){
		doc.body.appendChild(this.container);
	},

	close: function(){
		var parent = this.container.parentNode;
		parent.removeChild(this.container);
	}

});

}(this, document));

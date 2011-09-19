(function(global, doc){

/*
 * 
 * 
 */
global.FeedLoader = FeedLoader;
global.FeedProcessCreater = FeedProcessCreater;
global.MessageDecorator = MessageDecorator;
global.MessageList = MessageList;


function FeedLoader(strategey){
	if (!(Type.isObject(strategey) && strategey.load)) {
		throw new Error('');
	}
	this.strategey = strategey;
};

FeedLoader.implement({

	setUrl: function(url){
		this.url = url;
	},

	getUrl: function(){
		return this.url;
	},

	load: function(url){
		if (url){
			this.setUrl(url);
		}

		var url = this.getUrl();
		var feed = new google.feeds.Feed(url);
		feed.load(this.strategey.load);
	}

});


function FeedProcessCreater(){};

Object.append(FeedProcessCreater, {

	createAPIProcess: function(version){
		var process = {
			options: {
				key: 'ABQIAAAA4_PHVZvjtJ3LjA7Nc-VYfxSl-lcegfuTtJRuZv_Q2Txf9JNAxhQ3jgWCcIrtkHE6yf0JWpdlIz5uVg',
				version: version
			},

			handler: function(app, options){

//<script type="text/javascript" src="https://www.google.com/jsapi?key=ABQIAAAA4_PHVZvjtJ3LjA7Nc-VYfxSl-lcegfuTtJRuZv_Q2Txf9JNAxhQ3jgWCcIrtkHE6yf0JWpdlIz5uVg"></script>
				var that = this;

				var script = doc.createElement('script');
				script.src = 'https://www.google.com/jsapi?key=' + options.key;
				script.type = "text/javascript";
				doc.getElementsByTagName("head")[0].appendChild(script);

				google.setOnLoadCallback(function(){
					that.success();
				});

console.log('APIProcess');
console.log(options.version);

				google.load("feeds", options.version);
			}
		};
		return process;
	},

	createLoadProcess: function(url){
		var process = {
			options: {
				url: url
			},

			handler: function(app, options){
				var that = this;
				var loader = new FeedLoader({
					load: function(result){
						if (!result.error){
							app.registerFeed('comingsoon', result.feed.entries);
							that.success();
						} else {
							that.failure();
						}
					}
				});
				loader.load(options.url);
			}
		};
		return process;
	},

	createDummyProcess: function(){
		var process = {
			options: {},
			handler: function(app, options){
				var that = this;
				that.success();
			}
		};
		return process;
	}

});
//console.log(FeedProcessCreater);
//global.FeedProcessCreater = FeedProcessCreater;



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
			beforeHandler();
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
			app.print(message);
		};
	}
});














function MessageList(){
	this._view = doc.getElementById('message');
}

MessageList.implement({

	printMessage: function(message){
		var li = doc.createElement('li');
		var text = doc.createTextNode(message);
		li.appendChild(text);
		this._view.appendChild(li);
	}

});

}(this, document));

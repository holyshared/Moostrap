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
				var that = this;
				var callback = function(){
					that.success();
				};
				google.load("feeds", options.version, {
					callback: callback
				});
			}
		};
		return process;
	},

	createLoadProcess: function(options){
		var process = {
			options: {
				id: options.id,
				url: options.url
			},

			handler: function(app, options){
				var that = this;
//				var control = new FeedPanel(options.url, options.id, {
	//				horizontal: true
		//		});
			//	that.success();



				var id = options.id;


				var loader = new FeedLoader({
					load: function(result){
						if (!result.error){
							var feed = result.feed;
							var panel = new FeedPanel({
								id: id,
								feed: feed
							});
							panel.render(app.getContainer());

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





function FeedPanel(options){
	var id = options.id;
	var feed = options.feed;
	if (feed.title && feed.entries){ 
		throw new TypeError('invalid feed');
	}
	this.id = id;
	this.title = feed.title;
	this.entries = feed.entries;
}

FeedPanel.implement({

	createContainer: function(){
		var container = doc.createElement("div");
		container.setAttribute('id', this.id);
		container.setAttribute('class', 'feedList');
		return container;
	},

	createHeader: function(){
		var header = doc.createElement("h3");
		var headerText = doc.createTextNode(this.title);
		header.appendChild(headerText);
		return header;
	},

	createList: function(){
		var entries = this.entries;
		var list = doc.createElement("ul");
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			var item = doc.createElement("li");

			var link = doc.createElement("a");
			var linkText = doc.createTextNode(entry.title);

			var date = doc.createElement("span");
			var dateText = doc.createTextNode(entry.publishedDate);
			date.appendChild(dateText);

			var separator = doc.createTextNode(' - ');
			
			link.setAttribute('title', entry.title);
			link.setAttribute('href', entry.link);
			link.appendChild(linkText);

			item.appendChild(date);
			item.appendChild(separator);
			item.appendChild(link);

			list.appendChild(item);
		}
		return list;
	},

	render: function(container){
		var wrapper = this.createContainer();
		var header = this.createHeader();
		var feeds = this.createList();
		wrapper.appendChild(header);
		wrapper.appendChild(feeds);
		container.appendChild(wrapper);
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

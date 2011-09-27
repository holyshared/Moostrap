(function(global){

global.FlickrImageLoader = FlickrImageLoader;
global.Container = Container;

function FlickrImageLoader(action){
	this.action = action;
	this.request = new Request.JSONP({
		method: 'get',
		callbackKey: 'jsoncallback',
        onSuccess: this._onSuccess.bind(this),
        onFailure: this._onFailure.bind(this)
	});
}

FlickrImageLoader.implement({

    endPoint: 'http://api.flickr.com/services/rest/',

    baseQuery: '?method={method}&api_key={apikey}&format=json&per_page=20',

	baseImage: 'http://farm{farm}.static.flickr.com/{server}/{id}_{secret}_s.jpg',

    load: function(text, callback){
    	var url = this._compileUrl('text={text}', {
        	method: 'flickr.photos.search',
        	apikey: 'd34a167a701259dfd40a716708818fad',
        	text: text
        });
		this.request.send({ url: url });
    },

	_onSuccess: function(response){
		if (response.stat === 'ok' ) {
			this.action.success(this._responseFilter(response.photos));
		} else {
			this.action.failure();
		}
	},

	_onFailure: function(){
		this.action.failure();
	},

	_responseFilter: function(photos){
		var that = this;
		var collection = [];
		var images = photos.photo;
		images.each(function(item){
			var compileUrl = that.baseImage.substitute(item);
			collection.push({
				title: item.title,
				src: compileUrl
			});
		});
		return collection;
	},

    _compileUrl: function(query, values){
        var url = this.endPoint + this.baseQuery + '&' + query;
        return url.substitute(values);
    }

});


/*
 * var c = new Container();
 * c.register('Cat', ['a']);
 * c.getIterator();
 * 
 */

function Container(){}

Container.implement({

	_hash: {},

	register: function(key, images){
		this._hash[key] = images;
	},

	getIterator: function(){
		return new Iterator(this._hash);
	}

});

function Iterator(hash){
	this._cursor = 0;
	this._keys = Object.keys(hash);
	this._hash = hash;
}

Iterator.implement({

	next: function(){
		this._cursor++;
	},

	hasNext: function(){
		var next = this._cursor + 1;
		return (next <= this._keys.length) ? true : false;
	},

	current: function(){
		var key = this._keys[this._cursor];
		var images = this._hash[key];
		return {
			key: key,
			images: images
		}
	}

});


}(this));

(function(){

var Mock = this.Mock = function(){
	this.name = null;
	this.value = null;
};

Mock.implement({

	getName: function(){
		return this.name;
	},

	setName: function(name){
		this.name = name;
	},

	getValue: function(){
		return this.value;
	},

	setValue: function(value){
		this.value = value;
	}

});

}());

(function(){var a=this.Bootstrap=function(b,d,c){var e=b.capitalize();executerClass=null;instance=null;if(!a.Executer[e]){throw new Error(e+"is not found")}executerClass=a.Executer[e];instance=new executerClass(c);instance.setModule(d).init();return instance};a.Module=new Class({_executeOrder:[],_bootstrappers:{},register:function(c,b){if(this.isRegistered(c)===true){throw new Error(c+" is already registered")}var d=new a.Bootstrapper(b);this._bootstrappers[c]=d;this._executeOrder.push(c);return this},unregister:function(b){if(this.isRegistered(b)===false){throw new Error(b+" is not registered")}delete this._bootstrappers[b];this._executeOrder.erase(b);return this},isRegistered:function(b){if(!this._bootstrappers[b]){return false}return true},getBootstrapper:function(b){if(this.isRegistered(b)===false){throw new Error(b+" is not registered")}return this._bootstrappers[b]},getBootstrappers:function(){return this._bootstrappers},getLength:function(){return this._executeOrder.length},getRegisteredKeys:function(){var b={_cursor:0,_collection:this._executeOrder,hasNext:function(){return(this._collection.length-1>=this._cursor)},current:function(){return this._collection[this._cursor]},next:function(){if(this.hasNext()===false){return}this._cursor++},index:function(){return this._cursor},length:function(){return this._collection.length}};return b}});new Type("BootstrapModule",a.Module);a.Executer={};a.NONE=0;a.SUCCESS=1;a.FAILURE=2;a.Bootstrapper=new Class({Implements:[Events,Options],_title:null,_resource:null,_configuration:null,_handler:null,_status:null,_started:false,initialize:function(b){this.setOptions(this._prepare(b))},_prepare:function(b){var c=this;method=null,setter=null,handler=null;["title","resource","configuration","handler"].each(function(d){if(!b[d]){return}method=d.capitalize();setter="set"+method;handler=c[setter];handler.call(c,b[d]);delete b[d]});return b},success:function(){this._setResultStatus(a.SUCCESS);this.fireEvent("complete");this.fireEvent("success")},failure:function(){this._setResultStatus(a.FAILURE);this.fireEvent("complete");this.fireEvent("failure")},setTitle:function(b){if(!Type.isString(b)){throw new TypeError("The specified title is not valid.")}this._title=b},getTitle:function(){return this._title},setResource:function(b){if(!Type.isObject(b)){throw new TypeError("The specified resource is not valid.")}this._resource=b;return this},getResource:function(){return this._resource},getConfiguration:function(){return this._configuration},setConfiguration:function(b){if(!b){throw new TypeError("The specified configuration is not valid.")}switch(typeOf(b)){case"object":this._configuration=Object.merge(this._configuration||{},b);break;case"array":if(!this._configuration){this._configuration=[]}this._configuration.combine(b);break;default:this._configuration=b;break}return this},setHandler:function(b){if(!Type.isFunction(b)){throw new TypeError("The specified value is not function")}this._handler=b},_setResultStatus:function(c){var b=[a.NONE,a.SUCCESS,a.FAILURE];if(!b.contains(c)){throw new TypeError("The specified status is not valid.")}this._status=c},getResultStatus:function(){return this._status},isSuccessed:function(){return(this.getResultStatus()==a.SUCCESS)?true:false},isFailured:function(){return(this.getResultStatus()==a.FAILURE)?true:false},isCompleted:function(){return(this.getResultStatus()!=a.NONE)?true:false},isStarted:function(){return this._started},execute:function(){this._started=true;this.fireEvent("start");this._handler.call(this,this.getResource(),this.getConfiguration())}});new Type("Bootstrapper",a.Bootstrapper)}());(function(a){a.Executer=new Class({Implements:[Events,Options],_resource:null,_module:null,_configurations:{},_completed:0,_started:false,_status:Bootstrap.NONE,initialize:function(b){this.setOptions(this._prepare(b))},_prepare:function(c){var b=this,f="",e="",d=null;if(!c){return}["resource","configurations","module"].each(function(g){if(!c[g]){return}f=g.capitalize();e="set"+f;d=b[e];d.call(b,c[g]);delete c[g]});return c},init:function(){var c=this,d=this.getModule(),b=null;b=d.getBootstrappers();if(c.getResource()){Object.each(b,function(f,e){f.setResource(c.getResource())})}Object.each(b,function(f,e){c._setupBootstrapper(e,f)})},setModule:function(b){if(!Type.isBootstrapModule(b)){throw new TypeError("The specified module is not valid.")}this._module=b;return this},getModule:function(){return this._module},setResource:function(b){if(!Type.isObject(b)){throw new TypeError("The specified resource is not valid.")}this._resource=b;return this},getResource:function(){return this._resource},setConfigurations:function(b){if(!Type.isObject(b)){throw new TypeError("The specified configurations is not valid.")}this._configurations=b;return this},getConfigurations:function(){return this._configurations},getConfiguration:function(b){if(!this._configurations[b]){return}return this._configurations[b]},getExecuteOrder:function(){if(this._executeOrder){return this._executeOrder}this._executeOrder=this.getModule().getRegisteredKeys();return this._executeOrder},_setResultStatus:function(c){var b=[Bootstrap.NONE,Bootstrap.SUCCESS,Bootstrap.FAILURE];if(!b.contains(c)){throw new TypeError("The specified status is not valid.")}this._status=c},getResultStatus:function(){return this._status},isStarted:function(){return this._started},isSuccessed:function(){return(this.getResultStatus()==Bootstrap.SUCCESS)?true:false},isFailured:function(){return(this.getResultStatus()==Bootstrap.FAILURE)?true:false},isCompleted:function(){return(this.getResultStatus()!=Bootstrap.NONE)?true:false},getCompletedCount:function(){return this._completed},_notifyBootstrap:function(g,e){var c=[],b=this.getExecuteOrder(),d=this.getModule(),f=null;f=d.getBootstrapper(e);c=[e,f.getTitle(),b.index()+1,d.getLength()];this.fireEvent(g,c)},_beforeBootstrap:function(b){this._notifyBootstrap("beforeBootstrap",b)},_afterBootstrap:function(b){this._notifyBootstrap("afterBootstrap",b);if(this.getCompletedCount()>=this.getModule().getLength()-1){if(this.isFailured()){return}this._setResultStatus(Bootstrap.SUCCESS);this.fireEvent("complete");this.fireEvent("success");return}this._completed++},execute:function(d){var c=this.getModule(),b={};if(this.isCompleted()){return}if(!this.isStarted()){this._started=true}if(d){b=c.getBootstrappers();Object.each(b,function(f,e){f.setResource(d)});this.setResource(d)}this.fireEvent("start");this.bootstrap()},bootstrap:function(){},onFailure:function(b){this._setResultStatus(Bootstrap.FAILURE);this.fireEvent("complete");this.fireEvent("failure")}})}(Bootstrap.Executer));(function(a){a.Sync=new Class({Extends:a.Executer,bootstrap:function(){var c=null,d=null,b=this.getModule(),e=this.getExecuteOrder();c=e.current();d=b.getBootstrapper(c);this._beforeBootstrap(c);d.execute()},_setupBootstrapper:function(d,e){var b=[d],c={},f=null;Object.append(c,{success:this.onSuccess.bind(this,b),failure:this.onFailure.bind(this,b)});f=this.getConfiguration(d)||{};e.setConfiguration(f).addEvents(c)},_nextBoostrap:function(){var c=null,d=null,b=this.getModule(),e=this.getExecuteOrder();e.next();if(e.hasNext()){c=e.current();this._beforeBootstrap(c);d=b.getBootstrapper(c);d.execute()}},onSuccess:function(b){this._afterBootstrap(b);this._nextBoostrap()}})}(Bootstrap.Executer));
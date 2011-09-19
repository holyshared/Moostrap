(function(global, api, Bootstrapper){

//New York ART BEAT Feed URL
var artbeatURL = 'http://www.nyartbeat.com/list/feed/';

//Google Feed API Verson 
var apiVersion = '1';

Bootstrapper.register('Loading of Google Feed API', api.createAPIProcess(apiVersion));
Bootstrapper.register('Most Popular', api.createLoadProcess(artbeatURL + 'event_mostpopular.en.rdf'));
Bootstrapper.register('Comingsoon',	api.createLoadProcess(artbeatURL + 'event_comingsoon.en.rdf'));
Bootstrapper.register('Just Started', api.createLoadProcess(artbeatURL + 'event_juststarted.en.rdf'));
Bootstrapper.register('Closing Soon', api.createLoadProcess(artbeatURL + 'event_lastdays.en.rdf'));

global.Application.Module = Bootstrapper;

}(this, FeedProcessCreater, new Bootstrap.Module()));

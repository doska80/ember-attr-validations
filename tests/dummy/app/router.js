import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('settings');
  this.route('article');
  this.route('sandbox');

  this.route('demo');
  this.route('demo2');
  this.route('demo3');
});

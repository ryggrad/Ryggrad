var Controller, Route, Router, escapeRegExp, namedParam, splatParam,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Controller = require('./Controller');

namedParam = /:([\w\d]+)/g;

splatParam = /\*([\w\d]+)/g;

escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

Route = (function() {
  function Route(path, callback) {
    var match;
    this.path = path;
    this.callback = callback;
    this.names = [];
    if (typeof path === 'string') {
      namedParam.lastIndex = 0;
      while ((match = namedParam.exec(path)) !== null) {
        this.names.push(match[1]);
      }
      splatParam.lastIndex = 0;
      while ((match = splatParam.exec(path)) !== null) {
        this.names.push(match[1]);
      }
      path = path.replace(escapeRegExp, '\\$&').replace(namedParam, '([^\/]*)').replace(splatParam, '(.*?)');
      this.route = new RegExp('^' + path + '$');
    } else {
      this.route = path;
    }
  }

  Route.prototype.match = function(path) {
    var i, match, param, params, _i, _len, _ref;
    match = this.route.exec(path);
    if (!match) {
      return false;
    }
    params = {
      match: match
    };
    if (this.names.length) {
      _ref = match.slice(1);
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        param = _ref[i];
        params[this.names[i]] = param;
      }
    }
    return this.callback.call(null, params) !== false;
  };

  return Route;

})();

Router = (function() {
  function Router() {
    this.matchRoute = __bind(this.matchRoute, this);
    this.change = __bind(this.change, this);
    this.locationPath = __bind(this.locationPath, this);
    this.navigate = __bind(this.navigate, this);
    this.routes = [];
    $(window).on('popstate', this.change);
  }

  Router.prototype.add = function(path, callback) {
    var key, value;
    if (typeof path === 'object' && !(path instanceof RegExp)) {
      for (key in path) {
        value = path[key];
        return this.add(key, value);
      }
    }
    return this.routes.push(new Route(path, callback));
  };

  Router.prototype.navigate = function(path) {
    this.path = path;
    if (this.locationPath() === this.path) {
      return;
    }
    return typeof history !== "undefined" && history !== null ? typeof history.pushState === "function" ? history.pushState({}, document.title, this.path) : void 0 : void 0;
  };

  Router.prototype.locationPath = function() {
    var path;
    path = window.location.pathname;
    if (path.substr(0, 1) !== '/') {
      path = '/' + path;
    }
    return path;
  };

  Router.prototype.change = function() {
    var path;
    path = this.locationPath();
    if (path === this.path) {
      return;
    }
    this.path = path;
    return this.matchRoute(this.path);
  };

  Router.prototype.matchRoute = function(path, options) {
    var route, _i, _len, _ref;
    _ref = this.routes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      route = _ref[_i];
      if (route.match(path, options)) {
        return route;
      }
    }
  };

  return Router;

})();

Controller.include({
  route: function(path, callback) {
    return Route.add(path, this.proxy(callback));
  },
  routes: function(routes) {
    var key, value, _results;
    _results = [];
    for (key in routes) {
      value = routes[key];
      _results.push(this.route(key, value));
    }
    return _results;
  },
  url: function() {
    return Route.navigate.apply(Route, arguments);
  }
});

module.exports = Router;

var Base, Controller, Module, Route, Router,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controller = require('./Controller');

Module = require('./Module');

Route = require('./Route');

Base = require('./Base');

Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    this.matchRoute = __bind(this.matchRoute, this);
    this.change = __bind(this.change, this);
    this.locationPath = __bind(this.locationPath, this);
    this.getPath = __bind(this.getPath, this);
    this.navigate = __bind(this.navigate, this);
    this.path = '';
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

  Router.prototype.getPath = function() {
    return this.path;
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

})(Base);

module.exports = Router;

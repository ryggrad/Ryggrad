var Base, Controller, Router,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./Base');

Router = require("./Router");

Controller = (function(_super) {
  __extends(Controller, _super);

  Controller.prototype.eventSplitter = /^(\S+)\s*(.*)$/;

  Controller.prototype.tag = 'div';

  function Controller(options) {
    this.release = __bind(this.release, this);
    this.destroy = __bind(this.destroy, this);
    var key, value, _ref;
    this.router = new Router();
    this.options = options;
    _ref = this.options;
    for (key in _ref) {
      value = _ref[key];
      this[key] = value;
    }
    if (!this.el) {
      this.el = document.createElement(this.tag);
    }
    this.el = $(this.el);
    this.$el = this.el;
    if (this.className) {
      this.el.addClass(this.className);
    }
    if (this.attributes) {
      this.el.attr(this.attributes);
    }
    if (!this.events) {
      this.events = this.constructor.events;
    }
    if (!this.elements) {
      this.elements = this.constructor.elements;
    }
    if (this.events) {
      this.delegateEvents();
    }
    if (this.elements) {
      this.refreshElements();
    }
    Controller.__super__.constructor.apply(this, arguments);
  }

  Controller.prototype.route = function(path, callback) {
    return this.router.add(path, this.proxy(callback));
  };

  Controller.prototype.routes = function(routes) {
    var key, value, _results;
    _results = [];
    for (key in routes) {
      value = routes[key];
      _results.push(this.route(key, value));
    }
    return _results;
  };

  Controller.prototype.url = function() {
    return this.router.navigate.apply(router, args);
  };

  Controller.prototype.delegateEvents = function() {
    var eventName, key, match, method, selector, _ref, _results;
    _ref = this.events;
    _results = [];
    for (key in _ref) {
      method = _ref[key];
      if (typeof method !== 'function') {
        method = this.proxy(this[method]);
      }
      match = key.match(this.eventSplitter);
      eventName = match[1];
      selector = match[2];
      if (selector === '') {
        _results.push(this.el.bind(eventName, method));
      } else {
        _results.push(this.el.delegate(selector, eventName, method));
      }
    }
    return _results;
  };

  Controller.prototype.refreshElements = function() {
    var key, value, _ref, _results;
    _ref = this.elements;
    _results = [];
    for (key in _ref) {
      value = _ref[key];
      _results.push(this[value] = this.el.find(key));
    }
    return _results;
  };

  Controller.prototype.destroy = function() {
    this.trigger('release');
    this.el.addClass('garry');
    this.unbind();
    return this.el.remove();
  };

  Controller.prototype.$ = function(selector) {
    return $(selector, this.el);
  };

  Controller.prototype.release = function() {};

  return Controller;

})(Base);

module.exports = Controller;

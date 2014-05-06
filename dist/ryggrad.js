!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Ryggrad=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/Ryggrad.js');

},{"./lib/Ryggrad.js":2}],2:[function(require,module,exports){
var Ryggrad, jquery;

jquery = require('jquery');

require('./ryggrad/jquery/extensions')(window);

require('./ryggrad/jquery/ajax')(window);

Ryggrad = {};

Ryggrad.Base = require('./ryggrad/Base');

Ryggrad.Events = require('./ryggrad/Events');

Ryggrad.Module = require('./ryggrad/Module');

Ryggrad.Collection = require('./ryggrad/Collection');

Ryggrad.Model = require('./ryggrad/Model');

Ryggrad.View = require('space-pen').View;

Ryggrad.Controller = require('./ryggrad/Controller');

Ryggrad.Route = require('./ryggrad/Route');

Ryggrad.Router = require('./ryggrad/Router');

Ryggrad.Util = require('./ryggrad/Util');

Ryggrad.LocalStorage = require('./ryggrad/storage/Local');

Ryggrad.version = "0.0.5";

module.exports = Ryggrad;

},{"./ryggrad/Base":3,"./ryggrad/Collection":4,"./ryggrad/Controller":5,"./ryggrad/Events":6,"./ryggrad/Model":7,"./ryggrad/Module":8,"./ryggrad/Route":9,"./ryggrad/Router":10,"./ryggrad/Util":11,"./ryggrad/jquery/ajax":12,"./ryggrad/jquery/extensions":13,"./ryggrad/storage/Local":15,"jquery":"EGybA7","space-pen":18}],3:[function(require,module,exports){
var Base, Events, Module, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Events = require('./Events');

Module = require('./Module');

Base = (function(_super) {
  __extends(Base, _super);

  function Base() {
    _ref = Base.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Base.include(Events);

  Base.extend(Events);

  return Base;

})(Module);

module.exports = Base;

},{"./Events":6,"./Module":8}],4:[function(require,module,exports){
var $, Ajax, Base, Collection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = jQuery;

Base = require('./Base');

Ajax = require('./storage/Ajax');

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection(options) {
    var _base;
    if (options == null) {
      options = {};
    }
    this.isBase = __bind(this.isBase, this);
    this.recordEvent = __bind(this.recordEvent, this);
    this.syncFindBy = __bind(this.syncFindBy, this);
    this.shouldPreload = __bind(this.shouldPreload, this);
    this.remove = __bind(this.remove, this);
    this.baseSyncFind = __bind(this.baseSyncFind, this);
    this.syncFind = __bind(this.syncFind, this);
    this.add = __bind(this.add, this);
    this.empty = __bind(this.empty, this);
    this.exists = __bind(this.exists, this);
    this.resort = __bind(this.resort, this);
    this.sort = __bind(this.sort, this);
    this.each = __bind(this.each, this);
    this.fetch = __bind(this.fetch, this);
    this.unobserve = __bind(this.unobserve, this);
    this.observe = __bind(this.observe, this);
    this.reset = __bind(this.reset, this);
    this.syncFindBy = __bind(this.syncFindBy, this);
    this.all = __bind(this.all, this);
    this.refresh = __bind(this.refresh, this);
    this.findBy = __bind(this.findBy, this);
    this.find = __bind(this.find, this);
    this.filter = __bind(this.filter, this);
    this.count = __bind(this.count, this);
    if (!options.model) {
      throw new Error('Model required');
    }
    this.ids = {};
    this.cids = {};
    this.records = options.records || [];
    this.name = options.name || 'base';
    this.model = options.model;
    if (options.comparator) {
      this.comparator = options.comparator;
    }
    this.promise = $.Deferred().resolve(this.records);
    this.records.observe = this.observe;
    this.records.unobserve = this.unobserve;
    this.records.promise = this.promise;
    this.options = options;
    (_base = this.model).storageOptions || (_base.storageOptions = {});
    if (options.storage) {
      this.storage = new options.storage(this, this.model.storageOptions);
    } else if (this.model.storage) {
      this.storage = new this.model.storage(this, this.model.storageOptions);
    } else {
      this.storage = new Ajax(this, this.model.storageOptions);
    }
  }

  Collection.prototype.count = function() {
    return this.records.length;
  };

  Collection.prototype.filter = function(callback) {
    return this.records.filter(callback);
  };

  Collection.prototype.find = function(id, options) {
    var record;
    if (options == null) {
      options = {};
    }
    if (!id) {
      throw new Error('id required');
    }
    if (typeof id.getID === 'function') {
      id = id.getID();
    }
    if (options.remote) {
      return this.storage.find(id, options.remote);
    } else {
      record = this.syncFind(id);
      return record || (record = this.baseSyncFind(id));
    }
  };

  Collection.prototype.findBy = function(callback, request, options) {
    var filter;
    if (options == null) {
      options = {};
    }
    if (typeof callback === 'string') {
      filter = function(r) {
        return r.get(callback) === request;
      };
      if (options.remote) {
        return this.storage.findBy(callback, request, options);
      } else {
        return this.syncFindBy(filter);
      }
    } else {
      if (typeof callback !== 'function') {
        throw new Error('callback function required');
      }
      if (options.remote) {
        return this.storage.findBy(callback, options.remote);
      } else {
        return this.syncFindBy(callback);
      }
    }
  };

  Collection.prototype.refresh = function(options) {
    if (options == null) {
      options = {};
    }
    this.reset();
    if (options.remote) {
      return this.fetch(options);
    }
  };

  Collection.prototype.all = function(callback, options) {
    var result;
    if (options == null) {
      options = {};
    }
    if (typeof callback === 'object') {
      options = callback;
      if (typeof options === 'function') {
        callback = options;
      }
    }
    if (this.shouldPreload() || options.remote) {
      result = this.storage.all(options.remote);
    } else {
      result = this.records;
    }
    return result;
  };

  Collection.prototype.syncFindBy = function(callback) {
    return this.records.filter(callback)[0];
  };

  Collection.prototype.reset = function(options) {
    if (options == null) {
      options = {};
    }
    this.remove(this.records, options);
    this.ids = {};
    this.cids = {};
    this.trigger('reset', []);
    return this.trigger('observe', []);
  };

  Collection.prototype.observe = function(callback) {
    return this.on('observe', callback);
  };

  Collection.prototype.unobserve = function(callback) {
    return this.off('observe', callback);
  };

  Collection.prototype.fetch = function(options) {
    if (options == null) {
      options = {};
    }
    return this.storage.all(options.remote);
  };

  Collection.prototype.each = function(callback) {
    var _this = this;
    return this.all().promise.done(function(records) {
      var rec, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        rec = records[_i];
        _results.push(callback(rec));
      }
      return _results;
    });
  };

  Collection.prototype.sort = function(callback) {
    if (callback == null) {
      callback = this.comparator;
    }
    if (callback) {
      this.records.sort(callback);
    }
    this.trigger('sort');
    return this;
  };

  Collection.prototype.resort = function(callback) {
    this.sort(callback);
    this.trigger('resort');
    return this;
  };

  Collection.prototype.exists = function(record) {
    var cid, id;
    if (typeof record === 'object') {
      id = record.getID();
      cid = record.getCID();
    } else {
      id = cid = record;
    }
    return id in this.ids || cid in this.cids;
  };

  Collection.prototype.empty = function() {
    return this.records.length === 0;
  };

  Collection.prototype.add = function(records, options) {
    var changes, i, original, record, _base, _i, _len, _name, _ref;
    if (options == null) {
      options = {};
    }
    if (!records) {
      return;
    }
    if (typeof records.done === 'function') {
      records.done(this.add);
      return records;
    }
    if (!$.isArray(records)) {
      records = [records];
    }
    records = new this.model(records);
    changes = [];
    for (i = _i = 0, _len = records.length; _i < _len; i = ++_i) {
      record = records[i];
      original = (_ref = this.model.collection) != null ? _ref.syncFind(record.getID()) : void 0;
      if (original) {
        original.set(record);
        (_base = this.cids)[_name = record.getCID()] || (_base[_name] = original);
        record = records[i] = original;
      }
      if (this.exists(record)) {
        continue;
      }
      this.records.push(record);
      this.cids[record.getCID()] = record;
      if (record.getID()) {
        this.ids[record.getID()] = record;
      }
      record.on('all', this.recordEvent);
      this.trigger('add', record);
      changes.push({
        name: record.getCID(),
        type: 'new',
        object: this,
        value: record
      });
    }
    this.sort();
    if (options.remote) {
      if (options.isNew) {
        this.storage.add(records, options.remote);
      } else {
        this.storage.save(records, options.remote);
      }
    }
    if (!this.isBase()) {
      this.model.add(records);
    }
    this.trigger('observe', changes);
    return records;
  };

  Collection.prototype.syncFind = function(id) {
    return this.ids[id] || this.cids[id];
  };

  Collection.prototype.baseSyncFind = function(id) {
    var record, _ref;
    if (!this.isBase()) {
      record = (_ref = this.model.collection) != null ? _ref.syncFind(id) : void 0;
      if (record && !this.exists(record)) {
        this.add(record);
      }
      return record;
    }
  };

  Collection.prototype.remove = function(records, options) {
    var index, record, _i, _len, _ref;
    if (options == null) {
      options = {};
    }
    if (!$.isArray(records)) {
      records = [records];
    }
    _ref = records.slice(0);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      record = _ref[_i];
      record.off('all', this.recordEvent);
      delete this.cids[record.getCID()];
      if (record.getID()) {
        delete this.ids[record.getID()];
      }
      index = this.records.indexOf(record);
      this.records.splice(index, 1);
    }
    if (options.remote) {
      return this.storage.destroy(records, options.remote);
    }
  };

  Collection.prototype.comparator = function(a, b) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  };

  Collection.prototype.shouldPreload = function() {
    return this.empty() && !this.request;
  };

  Collection.prototype.syncFindBy = function(callback) {
    return this.records.filter(callback)[0];
  };

  Collection.prototype.recordEvent = function(event, args, record) {
    return this.trigger("record." + event, record, args);
  };

  Collection.prototype.isBase = function() {
    if (this.name === 'base') {
      return true;
    }
    return this.model.collection === this;
  };

  return Collection;

})(Base);

module.exports = Collection;

},{"./Base":3,"./storage/Ajax":14}],5:[function(require,module,exports){
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

},{"./Base":3,"./Router":10}],6:[function(require,module,exports){
var Events,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice;

Events = {
  bind: function(event, callback) {
    return this.on(event, callback);
  },
  unbind: function(event, callback) {
    return this.off(event, callback);
  },
  on: function(event, callback) {
    var calls, events, name, _i, _len;
    if (typeof event !== 'string') {
      throw new Error('event required');
    }
    if (typeof callback !== 'function') {
      throw new Error('callback required');
    }
    events = event.split(' ');
    calls = this.hasOwnProperty('events') && this.events || (this.events = {});
    for (_i = 0, _len = events.length; _i < _len; _i++) {
      name = events[_i];
      calls[name] || (calls[name] = []);
      calls[name].push(callback);
    }
    return this;
  },
  isOn: function(event, callback) {
    var list, _ref;
    list = this.hasOwnProperty('events') && ((_ref = this.events) != null ? _ref[event] : void 0);
    return list && __indexOf.call(list, callback) >= 0;
  },
  one: function(event, callback) {
    var callee;
    if (typeof callback !== 'function') {
      throw new Error('callback required');
    }
    callee = function() {
      this.off(event, callee);
      return callback.apply(this, arguments);
    };
    return this.on(event, callee);
  },
  trigger: function() {
    var args, callback, event, iargs, list, _i, _len, _ref, _ref1;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    event = args.shift();
    list = this.hasOwnProperty('events') && ((_ref = this.events) != null ? _ref[event] : void 0);
    if (!list) {
      return;
    }
    iargs = args.concat([this]);
    _ref1 = list || [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      callback = _ref1[_i];
      if (callback.apply(this, iargs) === false) {
        break;
      }
    }
    if (event !== 'all') {
      this.trigger('all', event, args);
    }
    return true;
  },
  off: function(event, callback) {
    var cb, i, list, _i, _len, _ref;
    if (!event) {
      this.events = {};
      return this;
    }
    list = (_ref = this.events) != null ? _ref[event] : void 0;
    if (!list) {
      return this;
    }
    if (!callback) {
      delete this.events[event];
      return this;
    }
    for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
      cb = list[i];
      if (!(cb === callback)) {
        continue;
      }
      list = list.slice();
      list.splice(i, 1);
      this.events[event] = list;
      break;
    }
    return this;
  }
};

module.exports = Events;

},{}],7:[function(require,module,exports){
var $, AjaxStorage, Base, Collection, Model, eql, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

$ = jQuery;

Base = require('./Base');

Collection = require('./Collection');

AjaxStorage = require('./storage/Ajax');

_ = require('underscore');

_.mixin(require('underscore.inflections'));

eql = _.isEqual;

Model = (function(_super) {
  __extends(Model, _super);

  Model.key = function(name, options) {
    if (options == null) {
      options = {};
    }
    if (!this.hasOwnProperty('attributes')) {
      this.attributes = {};
    }
    return this.attributes[name] = options;
  };

  Model.key('id', String);

  Model.records = function() {
    if (!this.hasOwnProperty('collection')) {
      this.collection = new Collection({
        model: this,
        name: 'base'
      });
    }
    return this.collection;
  };

  Model.count = function() {
    return this.records().count();
  };

  Model.all = function(callback, options) {
    if (options == null) {
      options = {};
    }
    return this.records().all(callback, options);
  };

  Model.find = function(id, options) {
    if (options == null) {
      options = {};
    }
    return this.records().find(id, options);
  };

  Model.findBy = function(callback, request, options) {
    if (options == null) {
      options = {};
    }
    return this.records().findBy(callback, request, options);
  };

  Model.filter = function(callback) {
    return this.records().filter(callback);
  };

  Model.add = function(values, options) {
    if (options == null) {
      options = {};
    }
    return this.records().add(values, options);
  };

  Model.exists = function(id) {
    return this.records().exists(id);
  };

  Model.uri = function() {
    var parts, url;
    parts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    url = (typeof this.url === "function" ? this.url() : void 0) || this.url;
    return [url].concat(__slice.call(parts)).join('/');
  };

  Model.url = function(value) {
    if (value) {
      this.url = (function() {
        return value;
      });
    }
    value || ("/" + (_.pluralize(this.name.toLowerCase())));
    if (this.host) {
      return this.host + "/" + value;
    } else {
      return value;
    }
  };

  Model.pluralName = function() {
    return "" + (_.pluralize(this.name.toLowerCase()));
  };

  Model.toString = function() {
    return this.name;
  };

  Model.on_record = function(event, callback) {
    return this.records().on("record." + event, callback);
  };

  Model.on_collection = function(event, callback) {
    return this.records().on(event, callback);
  };

  Model.uidCounter = 0;

  Model.uid = function(prefix) {
    var uid;
    if (prefix == null) {
      prefix = '';
    }
    uid = prefix + this.uidCounter++;
    if (this.exists(uid)) {
      uid = this.uid(prefix);
    }
    return uid;
  };

  Model.create = function(atts, options) {
    var obj, resp;
    if (atts == null) {
      atts = {};
    }
    if (options == null) {
      options = {};
    }
    obj = new this(atts);
    resp = obj.save(null, options);
    this.trigger('create', resp);
    return resp;
  };

  Model.refresh = function() {
    var _ref;
    return (_ref = this.records()).refresh.apply(_ref, arguments);
  };

  Model.destroy = function(records, options) {
    var resp;
    if (options == null) {
      options = {};
    }
    resp = this.records().remove(records, options);
    this.trigger('destroy', resp);
    return resp;
  };

  Model.destroyAll = function(options) {
    if (options == null) {
      options = {};
    }
    return this.records().reset(options);
  };

  Model.fetch = function(options) {
    var resp;
    if (options == null) {
      options = {};
    }
    resp = this.records().fetch(options);
    this.trigger('fetch', resp);
    return resp;
  };

  function Model(atts) {
    var rec;
    if (atts == null) {
      atts = {};
    }
    this.toString = __bind(this.toString, this);
    this.toJSON = __bind(this.toJSON, this);
    this.asJSON = __bind(this.asJSON, this);
    this.url = __bind(this.url, this);
    this.uri = __bind(this.uri, this);
    this.save = __bind(this.save, this);
    this.set = __bind(this.set, this);
    this.get = __bind(this.get, this);
    this.resolve = __bind(this.resolve, this);
    if (atts instanceof this.constructor) {
      return atts;
    }
    if (Array.isArray(atts) || (atts != null ? atts.isArray : void 0)) {
      return (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = atts.length; _i < _len; _i++) {
          rec = atts[_i];
          _results.push(new this.constructor(rec));
        }
        return _results;
      }).call(this);
    }
    this.cid = this.constructor.uid('c-');
    this.attributes = {};
    this.promise = $.Deferred().resolve(this);
    if (atts) {
      this.set(atts);
    }
    if (!atts.id) {
      this.set('id', this.cid);
    }
    this.init.apply(this, arguments);
    this;
  }

  Model.prototype.init = function() {};

  Model.prototype.resolve = function(callback) {
    return this.promise.done(callback);
  };

  Model.prototype.get = function(key) {
    if (typeof this[key] === 'function') {
      return this[key]();
    } else {
      return this.attributes[key];
    }
  };

  Model.prototype.set = function(key, val) {
    var attr, attrs, change, changes, previous, value, _ref,
      _this = this;
    if (typeof (key != null ? key.done : void 0) === 'function') {
      key.done(this.set);
      return key;
    }
    if (typeof (key != null ? key.attributes : void 0) === 'object') {
      attrs = key.attributes;
    } else if (typeof key === 'object') {
      attrs = key;
    } else if (key) {
      (attrs = {})[key] = val;
    }
    changes = [];
    _ref = attrs || {};
    for (attr in _ref) {
      value = _ref[attr];
      if (typeof (value != null ? value.done : void 0) === 'function') {
        value.done(function(newValue) {
          return _this.set(attr, newValue);
        });
        continue;
      }
      previous = this.get(attr);
      if (eql(previous, value)) {
        continue;
      }
      if (typeof this[attr] === 'function') {
        this[attr](value);
      } else {
        this.attributes[attr] = value;
        this[attr] = this.attributes[attr];
      }
      changes.push(change = {
        name: attr,
        type: 'updated',
        previous: previous,
        object: this,
        value: value
      });
      this.trigger("observe:" + attr, [change]);
      if (change.type === 'updated' && previous) {
        this.trigger("update:" + attr, change);
      }
    }
    if (changes.length) {
      this.trigger('observe', changes);
    }
    return attrs;
  };

  Model.prototype.updateAttribute = function(attr, val) {
    return this.set(attr, val);
  };

  Model.prototype.changeID = function(id) {
    var records;
    if (id === this.getID()) {
      return;
    }
    records = this.constructor.records().ids;
    records[id] = records[this.getID()];
    if (this.getCID() !== this.getID()) {
      delete records[this.getID()];
    }
    this.set("id", id);
    return this.save();
  };

  Model.prototype.getID = function() {
    return this.get('id');
  };

  Model.prototype.getCID = function() {
    return this.cid;
  };

  Model.prototype.increment = function(attr, amount) {
    var value;
    if (amount == null) {
      amount = 1;
    }
    value = this.get(attr) || 0;
    return this.set(attr, value + amount);
  };

  Model.prototype.eql = function(rec) {
    if (!rec) {
      return false;
    }
    if (rec.constructor !== this.constructor) {
      return false;
    }
    if (rec.cid === this.cid) {
      return true;
    }
    if ((typeof rec.get === "function" ? rec.get('id') : void 0) && rec.get('id') === this.get('id')) {
      return true;
    }
    return false;
  };

  Model.prototype.fromForm = function(form) {
    var key, result, _i, _len, _ref;
    result = {};
    _ref = $(form).serializeArray();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      result[key.name] = key.value;
    }
    return this.set(result);
  };

  Model.prototype.reload = function() {
    return this.set(this.setRequest($.getJSON(this.uri())));
  };

  Model.prototype.exists = function() {
    return this.constructor.exists(this.getID());
  };

  Model.prototype.add = function(options) {
    if (options == null) {
      options = {};
    }
    return this.constructor.add(this, options);
  };

  Model.prototype.save = function(attrs, options) {
    var isNew;
    if (options == null) {
      options = {};
    }
    if (attrs) {
      this.set(attrs);
    }
    isNew = this.isNew();
    options.isNew = isNew;
    this.add(options);
    this.trigger('save');
    this.trigger(isNew ? 'create' : 'update');
    return this;
  };

  Model.prototype.destroy = function(options) {
    if (options == null) {
      options = {};
    }
    this.constructor.destroy(this, options);
    this.trigger('destroy');
    return this;
  };

  Model.prototype.bind = function(key, callback) {
    var callee,
      _this = this;
    if (typeof key === 'function') {
      callback = key;
      key = null;
    }
    callee = function() {
      if (key) {
        return callback.call(_this, _this.get(key), _this);
      } else {
        return callback.call(_this, _this);
      }
    };
    if (key) {
      this.observeKey(key, callee);
    } else {
      this.observe(callee);
    }
    return callee();
  };

  Model.prototype.change = function(key, callback) {
    var _this = this;
    if (typeof key === 'function') {
      callback = key;
      key = null;
    }
    if (key) {
      return this.on("update:" + key, function() {
        return callback.call(_this, _this.get(key), _this);
      });
    } else {
      return this.observe(function() {
        return callback.call(_this, _this);
      });
    }
  };

  Model.prototype.observeKey = function(key, callback) {
    return this.on("observe:" + key, callback);
  };

  Model.prototype.unobserveKey = function(key, callback) {
    return this.off("observe:" + key, callback);
  };

  Model.prototype.observe = function(callback) {
    return this.on('observe', callback);
  };

  Model.prototype.unobserve = function(callback) {
    return this.off('observe', callback);
  };

  Model.prototype.isNew = function() {
    return !this.exists();
  };

  Model.prototype.uri = function() {
    var id, parts, _ref, _ref1;
    parts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    id = this.getID();
    if (id && !this.isNew()) {
      return (_ref = this.constructor).uri.apply(_ref, [id].concat(__slice.call(parts)));
    } else {
      return (_ref1 = this.constructor).uri.apply(_ref1, parts);
    }
  };

  Model.prototype.url = function() {
    var parts;
    parts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.uri.apply(this, parts);
  };

  Model.prototype.asJSON = function(options) {
    var attributes, key, result;
    if (options == null) {
      options = {};
    }
    if (options.all) {
      attributes = this.attributes;
    } else {
      attributes = this.constructor.attributes;
    }
    result = {
      id: this.getID()
    };
    for (key in attributes || {}) {
      result[key] = this.get(key);
    }
    return result;
  };

  Model.prototype.toJSON = function() {
    return this.asJSON();
  };

  Model.prototype.toString = function() {
    return "<" + this.constructor.name + " (" + (JSON.stringify(this)) + ")>";
  };

  Model.prototype.fetch = function(options) {
    var defaults, resp;
    if (options == null) {
      options = {};
    }
    defaults = {
      request: {
        url: "" + (this.constructor.url()) + "/" + (this.get('id'))
      }
    };
    options = $.extend(defaults, options);
    resp = this.constructor.fetch(options);
    this.trigger('fetch');
    return resp;
  };

  return Model;

})(Base);

module.exports = Model;

},{"./Base":3,"./Collection":4,"./storage/Ajax":14,"underscore":"g3eXzT","underscore.inflections":21}],8:[function(require,module,exports){
var Module, moduleKeywords,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

moduleKeywords = ['included', 'extended'];

Module = (function() {
  Module.include = function(obj) {
    var key, value, _ref;
    if (!obj) {
      throw new Error('include(obj) requires obj');
    }
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this.prototype[key] = value;
      }
    }
    if ((_ref = obj.included) != null) {
      _ref.apply(this);
    }
    return this;
  };

  Module.extend = function(obj) {
    var key, value, _ref;
    if (!obj) {
      throw new Error('extend(obj) requires obj');
    }
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this[key] = value;
      }
    }
    if ((_ref = obj.extended) != null) {
      _ref.apply(this);
    }
    return this;
  };

  Module.proxy = function(method) {
    var _this = this;
    return function() {
      return method.apply(_this, arguments);
    };
  };

  Module.prototype.proxy = function(method) {
    var _this = this;
    return function() {
      return method.apply(_this, arguments);
    };
  };

  Module.prototype.delay = function(method, timeout) {
    return setTimeout(this.proxy(method), timeout || 0);
  };

  function Module() {
    if (typeof this.init === "function") {
      this.init(arguments);
    }
  }

  return Module;

})();

Module.create = function() {
  var Mixed, base, mixins, _ref;
  base = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  if (!base) {
    base = this;
  }
  Mixed = (function(_super) {
    var method, mixin, name, _i, _ref1;

    __extends(Mixed, _super);

    function Mixed() {
      _ref = Mixed.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    for (_i = mixins.length - 1; _i >= 0; _i += -1) {
      mixin = mixins[_i];
      _ref1 = mixin.prototype;
      for (name in _ref1) {
        method = _ref1[name];
        Mixed.prototype[name] = method;
      }
    }

    return Mixed;

  })(base);
  return Mixed;
};

module.exports = Module;

},{}],9:[function(require,module,exports){
var Route, escapeRegExp, namedParam, splatParam;

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

module.exports = Route;

},{}],10:[function(require,module,exports){
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

},{"./Base":3,"./Controller":5,"./Module":8,"./Route":9}],11:[function(require,module,exports){
var Util;

Util = {
  getInputValue: function(el) {
    var o, _i, _len, _results;
    if (window.jQuery != null) {
      switch (el[0].type) {
        case 'checkbox':
          return el.is(':checked');
        default:
          return el.val();
      }
    } else {
      switch (el.type) {
        case 'checkbox':
          return el.checked;
        case 'select-multiple':
          _results = [];
          for (_i = 0, _len = el.length; _i < _len; _i++) {
            o = el[_i];
            if (o.selected) {
              _results.push(o.value);
            }
          }
          return _results;
          break;
        default:
          return el.value;
      }
    }
  },
  isArray: function(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  },
  isBlank: function(value) {
    var key;
    if (!value) {
      return true;
    }
    for (key in value) {
      return false;
    }
    return true;
  },
  makeArray: function(args) {
    return Array.prototype.slice.call(args, 0);
  },
  singularize: function(str) {
    return str.replace(/s$/, '');
  },
  underscore: function(str) {
    return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
  }
};

if (typeof Object.create !== 'function') {
  Object.create = function(o) {
    var Func;
    Func = function() {};
    Func.prototype = o;
    return new Func();
  };
}

module.exports = Util;

},{}],12:[function(require,module,exports){
module.exports = function(window) {
  var $, next, push, queue, queues, remove, running;
  $ = window.jQuery;
  queues = {};
  running = false;
  queue = function(name) {
    if (name === true) {
      name = 'default';
    }
    return queues[name] || (queues[name] = []);
  };
  next = function(name) {
    var deferred, list, options, _ref;
    list = queue(name);
    if (!list.length) {
      running = false;
      return;
    }
    _ref = list.shift(), options = _ref[0], deferred = _ref[1];
    return $.ajax(options).always(function() {
      return next(name);
    }).done(function() {
      return deferred.resolve.apply(deferred, arguments);
    }).fail(function() {
      return deferred.reject.apply(deferred, arguments);
    });
  };
  push = function(name, options) {
    var deferred, list;
    list = queue(name);
    deferred = $.Deferred();
    list.push([options, deferred]);
    if (!running) {
      next(name);
    }
    running = true;
    return deferred.promise();
  };
  remove = function(name, options) {
    var i, list, value, _, _i, _len, _ref, _results;
    list = queue(name);
    _results = [];
    for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
      _ref = list[i], value = _ref[0], _ = _ref[1];
      if (!(value === options)) {
        continue;
      }
      list.splice(i, 1);
      break;
    }
    return _results;
  };
  return $.ajaxTransport('+*', function(options) {
    var queuedOptions;
    if (options.queue) {
      queuedOptions = $.extend({}, options);
      queuedOptions.queue = false;
      queuedOptions.processData = false;
      return {
        send: function(headers, complete) {
          return push(options.queue, queuedOptions).done(function(data, textStatus, jqXHR) {
            return complete(jqXHR.status, jqXHR.statusText, {
              text: jqXHR.responseText
            }, jqXHR.getAllResponseHeaders());
          }).fail(function(jqXHR, textStatus, errorThrown) {
            return complete(jqXHR.status, jqXHR.statusText, {
              text: jqXHR.responseText
            }, jqXHR.getAllResponseHeaders());
          });
        },
        abort: function() {
          return remove(options.queue, queuedOptions);
        }
      };
    }
  });
};

},{}],13:[function(require,module,exports){
module.exports = function(window) {
  var jQuery;
  jQuery = require('jquery')(window);
  jQuery.event.special.removed = {
    remove: function(e) {
      return typeof e.handler === "function" ? e.handler() : void 0;
    }
  };
  $.fn.extend({
    hasEvent: function(A, F, E) {
      var L, S, T, V, e;
      L = 0;
      T = typeof A;
      V = false;
      E = (E ? E : this);
      A = (T === "string" ? $.trim(A) : A);
      if (T === "function") {
        F = A;
        A = null;
      }
      if (F === E) {
        F = null;
      }
      S = E.data("events");
      for (e in S) {
        if (S.hasOwnProperty(e)) {
          L++;
        }
      }
      if (L < 1) {
        return V = false;
      }
      if (A && !F) {
        return V = S.hasOwnProperty(A);
      } else if (A && S.hasOwnProperty(A) && F) {
        $.each(S[A], function(i, r) {
          if (V === false && r.handler === F) {
            return V = true;
          }
        });
        return V;
      } else if (!A && F) {
        $.each(S, function(i, s) {
          if (V === false) {
            return $.each(s, function(k, r) {
              if (V === false && r.handler === F) {
                return V = true;
              }
            });
          }
        });
      }
      return V;
    }
  });
  return $.extend($.fn.hasEvent);
};

},{"jquery":"EGybA7"}],14:[function(require,module,exports){
var Ajax, Storage,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Storage = require('./Storage');

Ajax = (function(_super) {
  __extends(Ajax, _super);

  function Ajax() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.setRequest = __bind(this.setRequest, this);
    this.findRequest = __bind(this.findRequest, this);
    this.allRequest = __bind(this.allRequest, this);
    this.find = __bind(this.find, this);
    this.all = __bind(this.all, this);
    Ajax.__super__.constructor.apply(this, args);
    if ('all' in this.options) {
      this.allRequest = this.options.all;
    }
    if ('find' in this.options) {
      this.findRequest = this.options.find;
    }
  }

  Ajax.prototype.add = function(records) {
    var isNew, record, type, _i, _len, _results,
      _this = this;
    if (!$.isArray(records)) {
      records = [records];
    }
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      isNew = record.isNew();
      type = isNew ? 'POST' : 'PUT';
      this.setRequest(record.set($.ajax({
        type: type,
        url: record.uri(),
        data: record.toJSON(),
        queue: true,
        warn: true
      })));
      _results.push(this.request.done(function(result) {
        if (result.id && record.id !== result.id) {
          record.changeID(result.id);
        }
        return record.set(result);
      }));
    }
    return _results;
  };

  Ajax.prototype.all = function(options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    if (!(this.allRequest && this.model.uri())) {
      return;
    }
    this.request = this.allRequest.call(this.model, this.model, options.request);
    this.records.request = this.request;
    this.records.promise = this.promise = $.Deferred();
    this.request.done(function(result) {
      _this.collection.add(result);
      return _this.promise.resolve(_this.records);
    });
    return this.request;
  };

  Ajax.prototype.find = function(id, options) {
    var record, request,
      _this = this;
    if (options == null) {
      options = {};
    }
    record = new this.model({
      id: id
    });
    request = this.asyncFindRequest.call(this.model, record, options.request);
    record.request = request;
    record.promise = $.Deferred();
    request.done(function(response) {
      record.set(response);
      record.promise.resolve(record);
      return _this.collection.add(record);
    });
    return record;
  };

  Ajax.prototype.findBy = function(ajaxRequest) {
    var record, request,
      _this = this;
    record = new this.model;
    request = ajaxRequest.call(this.model, record);
    record.request = request;
    record.promise = $.Deferred();
    request.done(function(response) {
      record.set(response);
      record.promise.resolve(record);
      return _this.collection.add(record);
    });
    return record;
  };

  Ajax.prototype.save = function(records) {
    var isNew, record, type, _i, _len, _results;
    if (!$.isArray(records)) {
      records = [records];
    }
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      isNew = record.isNew();
      type = isNew ? 'POST' : 'PUT';
      _results.push(this.setRequest(record.set($.ajax({
        type: type,
        url: record.uri(),
        data: record.toJSON(),
        queue: true,
        warn: true
      }))));
    }
    return _results;
  };

  Ajax.prototype.destroy = function(records) {
    var record, _i, _len, _results;
    if (!$.isArray(records)) {
      records = [records];
    }
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      _results.push(this.setRequest(record.set($.ajax({
        type: "DELETE",
        url: record.uri(record.getID()),
        queue: true,
        warn: true
      }))));
    }
    return _results;
  };

  Ajax.prototype.allRequest = function(model, options) {
    var defaults;
    if (options == null) {
      options = {};
    }
    defaults = {
      url: model.uri(),
      dataType: 'json',
      type: 'GET'
    };
    return $.ajax($.extend(defaults, options));
  };

  Ajax.prototype.findRequest = function(record, options) {
    var defaults;
    if (options == null) {
      options = {};
    }
    defaults = {
      url: record.uri(),
      dataType: 'json',
      type: 'GET'
    };
    return $.ajax($.extend(defaults, options));
  };

  Ajax.prototype.setRequest = function(request) {
    var _this = this;
    this.request = request;
    this.promise = $.Deferred();
    this.request.done(function() {
      return _this.promise.resolve(_this);
    });
    return this.request;
  };

  return Ajax;

})(Storage);

module.exports = Ajax;

},{"./Storage":16}],15:[function(require,module,exports){
var Local, Storage, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Storage = require('./Storage');

Local = (function(_super) {
  __extends(Local, _super);

  function Local() {
    _ref = Local.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Local.prototype.add = function(records) {
    var record, _i, _len, _results;
    if (!$.isArray(records)) {
      records = [records];
    }
    localStorage[this.key_name] = JSON.stringify(this.records);
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      localStorage[record.id] = record.asJSON();
      _results.push(localStorage[record.cid] = record.asJSON());
    }
    return _results;
  };

  Local.prototype.all = function() {
    var result;
    if (localStorage[this.key_name]) {
      result = JSON.parse(localStorage[this.key_name]);
      this.collection.add(result);
    }
    return this.records;
  };

  Local.prototype.find = function(record) {
    var newRecord;
    newRecord = null;
    if (localStorage[record.id]) {
      newRecord = new this.model(JSON.parse(localStorage[record.id]));
    } else if (localStorage[record.cid]) {
      newRecord = new this.model(JSON.parse(localStorage[record.cid]));
    } else {
      newRecord = new this.model();
    }
    this.collection.add(newRecord);
    return newRecord;
  };

  Local.prototype.findBy = function(callback) {
    var newRecord, records;
    if (localStorage[this.key_name]) {
      records = JSON.parse(localStorage[this.key_name]);
    }
    newRecord = new this.model(records.filter(callback)[0]);
    this.collection.add(newRecord);
    return newRecord;
  };

  Local.prototype.save = function(records) {
    return this.add(records);
  };

  Local.prototype.destroy = function(records) {
    var record, _i, _len;
    if (!$.isArray(records)) {
      records = [records];
    }
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      if (localStorage[record.id]) {
        delete localStorage[record.id];
      }
      if (localStorage[record.cid]) {
        delete localStorage[record.cid];
      }
    }
    return localStorage[this.key_name] = JSON.stringify(this.records);
  };

  return Local;

})(Storage);

module.exports = Local;

},{"./Storage":16}],16:[function(require,module,exports){
var Storage,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Storage = (function() {
  function Storage(collection, storageOptions) {
    this.collection = collection;
    this.all = __bind(this.all, this);
    this.model = this.collection.model;
    this.options = this.collection.options;
    this.records = this.collection.records;
    this.key_name = this.model.pluralName();
  }

  Storage.prototype.add = function(records) {};

  Storage.prototype.all = function(options) {
    if (options == null) {
      options = {};
    }
  };

  Storage.prototype.find = function() {};

  Storage.prototype.findBy = function() {};

  Storage.prototype.save = function(records) {};

  Storage.prototype.destroy = function(records) {};

  return Storage;

})();

module.exports = Storage;

},{}],17:[function(require,module,exports){
(function() {
  var $, _,
    __slice = [].slice;

  if (window) {
    $ = window.$, _ = window._;
  } else if (typeof require === 'function') {
    $ = require('jquery');
    _ = require('underscore-plus');
  } else {
    throw new Error("Space Pen Couldn't Load jQuery");
  }

  $.fn.scrollBottom = function(newValue) {
    if (newValue != null) {
      return this.scrollTop(newValue - this.height());
    } else {
      return this.scrollTop() + this.height();
    }
  };

  $.fn.scrollDown = function() {
    return this.scrollTop(this.scrollTop() + $(window).height() / 20);
  };

  $.fn.scrollUp = function() {
    return this.scrollTop(this.scrollTop() - $(window).height() / 20);
  };

  $.fn.scrollToTop = function() {
    return this.scrollTop(0);
  };

  $.fn.scrollToBottom = function() {
    return this.scrollTop(this.prop('scrollHeight'));
  };

  $.fn.scrollRight = function(newValue) {
    if (newValue != null) {
      return this.scrollLeft(newValue - this.width());
    } else {
      return this.scrollLeft() + this.width();
    }
  };

  $.fn.pageUp = function() {
    return this.scrollTop(this.scrollTop() - this.height());
  };

  $.fn.pageDown = function() {
    return this.scrollTop(this.scrollTop() + this.height());
  };

  $.fn.isOnDom = function() {
    return this.closest(document.body).length === 1;
  };

  $.fn.isVisible = function() {
    return !this.isHidden();
  };

  $.fn.isHidden = function() {
    var style;
    style = this[0].style;
    if (style.display === 'none' || !this.isOnDom()) {
      return true;
    } else if (style.display) {
      return false;
    } else {
      return getComputedStyle(this[0]).display === 'none';
    }
  };

  $.fn.isDisabled = function() {
    return !!this.attr('disabled');
  };

  $.fn.enable = function() {
    return this.removeAttr('disabled');
  };

  $.fn.disable = function() {
    return this.attr('disabled', 'disabled');
  };

  $.fn.insertAt = function(index, element) {
    var target;
    target = this.children(":eq(" + index + ")");
    if (target.length) {
      return $(element).insertBefore(target);
    } else {
      return this.append(element);
    }
  };

  $.fn.removeAt = function(index) {
    return this.children(":eq(" + index + ")").remove();
  };

  $.fn.indexOf = function(child) {
    return this.children().toArray().indexOf($(child)[0]);
  };

  $.fn.containsElement = function(element) {
    return (element[0].compareDocumentPosition(this[0]) & 8) === 8;
  };

  $.fn.preempt = function(eventName, handler) {
    var eventNameWithoutNamespace, handlers, _ref;
    this.on(eventName, function() {
      var args, e;
      e = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (handler.apply(null, [e].concat(__slice.call(args))) === false) {
        return e.stopImmediatePropagation();
      }
    });
    eventNameWithoutNamespace = eventName.split('.')[0];
    handlers = (_ref = this.handlers()[eventNameWithoutNamespace]) != null ? _ref : [];
    return handlers.unshift(handlers.pop());
  };

  $.fn.handlers = function(eventName) {
    var handlers, _ref, _ref1;
    handlers = this.length ? (_ref = $._data(this[0], 'events')) != null ? _ref : {} : {};
    if (arguments.length === 1) {
      handlers = (_ref1 = handlers[eventName]) != null ? _ref1 : [];
    }
    return handlers;
  };

  $.fn.hasParent = function() {
    return this.parent()[0] != null;
  };

  $.fn.flashError = function() {
    var removeErrorClass,
      _this = this;
    this.addClass('error');
    removeErrorClass = function() {
      return _this.removeClass('error');
    };
    return window.setTimeout(removeErrorClass, 300);
  };

  $.fn.trueHeight = function() {
    return this[0].getBoundingClientRect().height;
  };

  $.fn.trueWidth = function() {
    return this[0].getBoundingClientRect().width;
  };

  $.fn.document = function(eventName, docString) {
    var eventDescriptions;
    eventDescriptions = {};
    eventDescriptions[eventName] = docString;
    if (!this.data('documentation')) {
      this.data('documentation', {});
    }
    return _.extend(this.data('documentation'), eventDescriptions);
  };

  $.fn.events = function() {
    var documentation, eventName, events, _ref, _ref1;
    documentation = (_ref = this.data('documentation')) != null ? _ref : {};
    events = {};
    for (eventName in this.handlers()) {
      events[eventName] = (_ref1 = documentation[eventName]) != null ? _ref1 : null;
    }
    if (this.hasParent()) {
      return _.extend(this.parent().events(), events);
    } else {
      return events;
    }
  };

  $.fn.command = function(eventName, selector, options, handler) {
    if (options == null) {
      handler = selector;
      selector = null;
    } else if (handler == null) {
      handler = options;
      options = null;
    }
    if ((selector != null) && typeof selector === 'object') {
      options = selector;
      selector = null;
    }
    this.document(eventName, _.humanizeEventName(eventName, options != null ? options['doc'] : void 0));
    return this.on(eventName, selector, options != null ? options['data'] : void 0, handler);
  };

  $.fn.iconSize = function(size) {
    return this.width(size).height(size).css('font-size', size);
  };

  $.fn.intValue = function() {
    return parseInt(this.text());
  };

  $.Event.prototype.abortKeyBinding = function() {};

  $.Event.prototype.currentTargetView = function() {
    return $(this.currentTarget).view();
  };

  $.Event.prototype.targetView = function() {
    return $(this.target).view();
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = $;
  } else {
    this.$ = $;
  }

}).call(this);

},{"jquery":"EGybA7","underscore-plus":19}],18:[function(require,module,exports){
(function() {
  var $, Builder, Events, SelfClosingTags, Tags, View, callAttachHook, exports, idCounter, jQuery, methodName, originalCleanData, _fn, _fn1, _i, _j, _len, _len1, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  if (typeof require === 'function') {
    $ = jQuery = require('./jquery-extensions');
  } else {
    $ = jQuery = window.jQuery;
  }

  Tags = 'a abbr address article aside audio b bdi bdo blockquote body button\
   canvas caption cite code colgroup datalist dd del details dfn div dl dt em\
   fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup\
   html i iframe ins kbd label legend li map mark menu meter nav noscript object\
   ol optgroup option output p pre progress q rp rt ruby s samp script section\
   select small span strong style sub summary sup table tbody td textarea tfoot\
   th thead time title tr u ul video area base br col command embed hr img input\
   keygen link meta param source track wbrk'.split(/\s+/);

  SelfClosingTags = {};

  'area base br col command embed hr img input keygen link meta param\
 source track wbr'.split(/\s+/).forEach(function(tag) {
    return SelfClosingTags[tag] = true;
  });

  Events = 'blur change click dblclick error focus input keydown\
   keypress keyup load mousedown mousemove mouseout mouseover\
   mouseup resize scroll select submit unload'.split(/\s+/);

  idCounter = 0;

  View = (function(_super) {
    __extends(View, _super);

    View.builderStack = null;

    Tags.forEach(function(tagName) {
      return View[tagName] = function() {
        var args, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return (_ref = this.currentBuilder).tag.apply(_ref, [tagName].concat(__slice.call(args)));
      };
    });

    View.subview = function(name, view) {
      return this.currentBuilder.subview(name, view);
    };

    View.text = function(string) {
      return this.currentBuilder.text(string);
    };

    View.tag = function() {
      var args, tagName, _ref;
      tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref = this.currentBuilder).tag.apply(_ref, [tagName].concat(__slice.call(args)));
    };

    View.raw = function(string) {
      return this.currentBuilder.raw(string);
    };

    View.pushBuilder = function() {
      var builder;
      builder = new Builder;
      if (this.builderStack == null) {
        this.builderStack = [];
      }
      this.builderStack.push(builder);
      return this.currentBuilder = builder;
    };

    View.popBuilder = function() {
      this.currentBuilder = this.builderStack[this.builderStack.length - 2];
      return this.builderStack.pop();
    };

    View.buildHtml = function(fn) {
      var html, postProcessingSteps, _ref;
      this.pushBuilder();
      fn.call(this);
      return _ref = this.popBuilder().buildHtml(), html = _ref[0], postProcessingSteps = _ref[1], _ref;
    };

    View.render = function(fn) {
      var div, fragment, html, postProcessingSteps, step, _i, _len, _ref;
      _ref = this.buildHtml(fn), html = _ref[0], postProcessingSteps = _ref[1];
      div = document.createElement('div');
      div.innerHTML = html;
      fragment = $(div.childNodes);
      for (_i = 0, _len = postProcessingSteps.length; _i < _len; _i++) {
        step = postProcessingSteps[_i];
        step(fragment);
      }
      return fragment;
    };

    function View() {
      var args, element, html, postProcessingSteps, step, _i, _j, _len, _len1, _ref, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = this.constructor.buildHtml(function() {
        return this.content.apply(this, args);
      }), html = _ref[0], postProcessingSteps = _ref[1];
      jQuery.fn.init.call(this, html);
      if (this.length !== 1) {
        throw new Error("View markup must have a single root element");
      }
      this.wireOutlets(this);
      this.bindEventHandlers(this);
      jQuery.data(this[0], 'view', this);
      _ref1 = this[0].getElementsByTagName('*');
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        element = _ref1[_i];
        jQuery.data(element, 'view', this);
      }
      this[0].setAttribute('callAttachHooks', true);
      for (_j = 0, _len1 = postProcessingSteps.length; _j < _len1; _j++) {
        step = postProcessingSteps[_j];
        step(this);
      }
      if (typeof this.initialize === "function") {
        this.initialize.apply(this, args);
      }
    }

    View.prototype.buildHtml = function(params) {
      var html, postProcessingSteps, _ref;
      this.constructor.builder = new Builder;
      this.constructor.content(params);
      _ref = this.constructor.builder.buildHtml(), html = _ref[0], postProcessingSteps = _ref[1];
      this.constructor.builder = null;
      return postProcessingSteps;
    };

    View.prototype.wireOutlets = function(view) {
      var element, outlet, _i, _len, _ref;
      _ref = view[0].querySelectorAll('[outlet]');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        outlet = element.getAttribute('outlet');
        view[outlet] = $(element);
        element.removeAttribute('outlet');
      }
      return void 0;
    };

    View.prototype.bindEventHandlers = function(view) {
      var element, eventName, methodName, selector, _fn, _i, _j, _len, _len1, _ref;
      for (_i = 0, _len = Events.length; _i < _len; _i++) {
        eventName = Events[_i];
        selector = "[" + eventName + "]";
        _ref = view[0].querySelectorAll(selector);
        _fn = function(element) {
          var methodName;
          methodName = element.getAttribute(eventName);
          element = $(element);
          return element.on(eventName, function(event) {
            return view[methodName](event, element);
          });
        };
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          element = _ref[_j];
          _fn(element);
        }
        if (view.is(selector)) {
          methodName = view[0].getAttribute(eventName);
          (function(methodName) {
            return view.on(eventName, function(event) {
              return view[methodName](event, view);
            });
          })(methodName);
        }
      }
      return void 0;
    };

    View.prototype.pushStack = function(elems) {
      var ret;
      ret = jQuery.merge(jQuery(), elems);
      ret.prevObject = this;
      ret.context = this.context;
      return ret;
    };

    View.prototype.end = function() {
      var _ref;
      return (_ref = this.prevObject) != null ? _ref : jQuery(null);
    };

    return View;

  })(jQuery);

  Builder = (function() {
    function Builder() {
      this.document = [];
      this.postProcessingSteps = [];
    }

    Builder.prototype.buildHtml = function() {
      return [this.document.join(''), this.postProcessingSteps];
    };

    Builder.prototype.tag = function() {
      var args, name, options;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      options = this.extractOptions(args);
      this.openTag(name, options.attributes);
      if (SelfClosingTags.hasOwnProperty(name)) {
        if ((options.text != null) || (options.content != null)) {
          throw new Error("Self-closing tag " + name + " cannot have text or content");
        }
      } else {
        if (typeof options.content === "function") {
          options.content();
        }
        if (options.text) {
          this.text(options.text);
        }
        return this.closeTag(name);
      }
    };

    Builder.prototype.openTag = function(name, attributes) {
      var attributeName, attributePairs, attributesString, value;
      attributePairs = (function() {
        var _results;
        _results = [];
        for (attributeName in attributes) {
          value = attributes[attributeName];
          _results.push("" + attributeName + "=\"" + value + "\"");
        }
        return _results;
      })();
      attributesString = attributePairs.length ? " " + attributePairs.join(" ") : "";
      return this.document.push("<" + name + attributesString + ">");
    };

    Builder.prototype.closeTag = function(name) {
      return this.document.push("</" + name + ">");
    };

    Builder.prototype.text = function(string) {
      var escapedString;
      escapedString = string.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return this.document.push(escapedString);
    };

    Builder.prototype.raw = function(string) {
      return this.document.push(string);
    };

    Builder.prototype.subview = function(outletName, subview) {
      var subviewId;
      subviewId = "subview-" + (++idCounter);
      this.tag('div', {
        id: subviewId
      });
      return this.postProcessingSteps.push(function(view) {
        view[outletName] = subview;
        subview.parentView = view;
        return view.find("div#" + subviewId).replaceWith(subview);
      });
    };

    Builder.prototype.extractOptions = function(args) {
      var arg, options, _i, _len;
      options = {};
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        switch (typeof arg) {
          case 'function':
            options.content = arg;
            break;
          case 'string':
          case 'number':
            options.text = arg.toString();
            break;
          default:
            options.attributes = arg;
        }
      }
      return options;
    };

    return Builder;

  })();

  jQuery.fn.view = function() {
    return this.data('view');
  };

  jQuery.fn.views = function() {
    return this.toArray().map(function(elt) {
      return $(elt).view();
    });
  };

  callAttachHook = function(element) {
    var child, elementsWithHooks, onDom, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (!(element instanceof jQuery && element[0])) {
      return;
    }
    onDom = (typeof element.parents === "function" ? element.parents('html').length : void 0) > 0;
    elementsWithHooks = [];
    if (element[0].getAttribute('callAttachHooks')) {
      elementsWithHooks.push(element[0]);
    }
    if (onDom) {
      _ref = element[0].querySelectorAll('[callAttachHooks]');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        elementsWithHooks.push(child);
      }
    }
    _results = [];
    for (_j = 0, _len1 = elementsWithHooks.length; _j < _len1; _j++) {
      element = elementsWithHooks[_j];
      _results.push((_ref1 = $(element).view()) != null ? typeof _ref1.afterAttach === "function" ? _ref1.afterAttach(onDom) : void 0 : void 0);
    }
    return _results;
  };

  _ref = ['append', 'prepend', 'after', 'before'];
  _fn = function(methodName) {
    var originalMethod;
    originalMethod = $.fn[methodName];
    return jQuery.fn[methodName] = function() {
      var arg, args, flatArgs, result, _j, _len1, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      flatArgs = (_ref1 = []).concat.apply(_ref1, args);
      result = originalMethod.apply(this, flatArgs);
      for (_j = 0, _len1 = flatArgs.length; _j < _len1; _j++) {
        arg = flatArgs[_j];
        callAttachHook(arg);
      }
      return result;
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    methodName = _ref[_i];
    _fn(methodName);
  }

  _ref1 = ['prependTo', 'appendTo', 'insertAfter', 'insertBefore'];
  _fn1 = function(methodName) {
    var originalMethod;
    originalMethod = jQuery.fn[methodName];
    return jQuery.fn[methodName] = function() {
      var args, result;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      result = originalMethod.apply(this, args);
      callAttachHook(this);
      return result;
    };
  };
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    methodName = _ref1[_j];
    _fn1(methodName);
  }

  originalCleanData = jQuery.cleanData;

  jQuery.cleanData = function(elements) {
    var element, view, _k, _len2;
    for (_k = 0, _len2 = elements.length; _k < _len2; _k++) {
      element = elements[_k];
      view = $(element).view();
      if (view && (view != null ? view[0] : void 0) === element) {
        if (typeof view.beforeRemove === "function") {
          view.beforeRemove();
        }
      }
    }
    return originalCleanData(elements);
  };

  exports = exports != null ? exports : this;

  exports.View = View;

  exports.jQuery = jQuery;

  exports.$ = $;

  exports.$$ = function(fn) {
    return View.render.call(View, fn);
  };

  exports.$$$ = function(fn) {
    return View.buildHtml.call(View, fn)[0];
  };

}).call(this);

},{"./jquery-extensions":17}],19:[function(require,module,exports){
(function() {
  var isEqual, modifierKeyMap, plus, _,
    __slice = [].slice;

  _ = require('underscore');

  isEqual = require('tantamount');

  modifierKeyMap = {
    cmd: '\u2318',
    ctrl: '\u2303',
    alt: '\u2325',
    option: '\u2325',
    shift: '\u21e7',
    enter: '\u23ce',
    left: '\u2190',
    right: '\u2192',
    up: '\u2191',
    down: '\u2193'
  };

  plus = {
    adviseBefore: function(object, methodName, advice) {
      var original;
      original = object[methodName];
      return object[methodName] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (advice.apply(this, args) !== false) {
          return original.apply(this, args);
        }
      };
    },
    camelize: function(string) {
      return string.replace(/[_-]+(\w)/g, function(m) {
        return m[1].toUpperCase();
      });
    },
    capitalize: function(word) {
      if (word.toLowerCase() === 'github') {
        return 'GitHub';
      } else {
        return word[0].toUpperCase() + word.slice(1);
      }
    },
    compactObject: function(object) {
      var key, newObject, value;
      newObject = {};
      for (key in object) {
        value = object[key];
        if (value != null) {
          newObject[key] = value;
        }
      }
      return newObject;
    },
    dasherize: function(string) {
      string = string[0].toLowerCase() + string.slice(1);
      return string.replace(/([A-Z])|(_)/g, function(m, letter, underscore) {
        if (letter) {
          return "-" + letter.toLowerCase();
        } else {
          return "-";
        }
      });
    },
    deepClone: function(object) {
      var _this = this;
      if (_.isArray(object)) {
        return object.map(function(value) {
          return plus.deepClone(value);
        });
      } else if (_.isObject(object)) {
        return plus.mapObject(object, function(key, value) {
          return [key, plus.deepClone(value)];
        });
      } else {
        return object;
      }
    },
    deepExtend: function() {
      var key, object, objects, result, value, _i, _len;
      objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      result = {};
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (key in object) {
          value = object[key];
          if (_.isObject(value) && !_.isArray(value)) {
            result[key] = plus.deepExtend(result[key], value);
          } else {
            if (result[key] == null) {
              result[key] = value;
            }
          }
        }
      }
      return result;
    },
    endsWith: function(string, suffix) {
      return string.indexOf(suffix, string.length - suffix.length) !== -1;
    },
    escapeAttribute: function(string) {
      return string.replace(/"/g, '&quot;').replace(/\n/g, '').replace(/\\/g, '-');
    },
    escapeRegExp: function(string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    humanizeEventName: function(eventName, eventDoc) {
      var event, namespace, namespaceDoc, _ref;
      _ref = eventName.split(':'), namespace = _ref[0], event = _ref[1];
      if (event == null) {
        return plus.undasherize(namespace);
      }
      namespaceDoc = plus.undasherize(namespace);
      if (eventDoc == null) {
        eventDoc = plus.undasherize(event);
      }
      return "" + namespaceDoc + ": " + eventDoc;
    },
    humanizeKey: function(key) {
      if (!key) {
        return key;
      }
      if (modifierKeyMap[key]) {
        return modifierKeyMap[key];
      } else if (key.length === 1 && key === key.toUpperCase() && key.toUpperCase() !== key.toLowerCase()) {
        return [modifierKeyMap.shift, key.toUpperCase()];
      } else if (key.length === 1 || /f[0-9]{1,2}/.test(key)) {
        return key.toUpperCase();
      } else {
        return key;
      }
    },
    humanizeKeystroke: function(keystroke) {
      var humanizedKeystrokes, key, keys, keystrokes, _i, _len;
      if (!keystroke) {
        return keystroke;
      }
      keystrokes = keystroke.split(' ');
      humanizedKeystrokes = [];
      for (_i = 0, _len = keystrokes.length; _i < _len; _i++) {
        keystroke = keystrokes[_i];
        keys = keystroke.split('-');
        keys = _.flatten((function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
            key = keys[_j];
            _results.push(plus.humanizeKey(key));
          }
          return _results;
        })());
        humanizedKeystrokes.push(keys.join(''));
      }
      return humanizedKeystrokes.join(' ');
    },
    isSubset: function(potentialSubset, potentialSuperset) {
      return _.every(potentialSubset, function(element) {
        return _.include(potentialSuperset, element);
      });
    },
    losslessInvert: function(hash) {
      var inverted, key, value;
      inverted = {};
      for (key in hash) {
        value = hash[key];
        if (inverted[value] == null) {
          inverted[value] = [];
        }
        inverted[value].push(key);
      }
      return inverted;
    },
    mapObject: function(object, iterator) {
      var key, newObject, value, _ref;
      newObject = {};
      for (key in object) {
        value = object[key];
        _ref = iterator(key, value), key = _ref[0], value = _ref[1];
        newObject[key] = value;
      }
      return newObject;
    },
    multiplyString: function(string, n) {
      return new Array(1 + n).join(string);
    },
    pluralize: function(count, singular, plural) {
      if (count == null) {
        count = 0;
      }
      if (plural == null) {
        plural = singular + 's';
      }
      if (count === 1) {
        return "" + count + " " + singular;
      } else {
        return "" + count + " " + plural;
      }
    },
    remove: function(array, element) {
      var index;
      index = array.indexOf(element);
      if (index >= 0) {
        array.splice(index, 1);
      }
      return array;
    },
    setValueForKeyPath: function(object, keyPath, value) {
      var key, keys;
      keys = keyPath.split('.');
      while (keys.length > 1) {
        key = keys.shift();
        if (object[key] == null) {
          object[key] = {};
        }
        object = object[key];
      }
      if (value != null) {
        return object[keys.shift()] = value;
      } else {
        return delete object[keys.shift()];
      }
    },
    spliceWithArray: function(originalArray, start, length, insertedArray, chunkSize) {
      var chunkStart, _i, _ref, _results;
      if (chunkSize == null) {
        chunkSize = 100000;
      }
      if (insertedArray.length < chunkSize) {
        return originalArray.splice.apply(originalArray, [start, length].concat(__slice.call(insertedArray)));
      } else {
        originalArray.splice(start, length);
        _results = [];
        for (chunkStart = _i = 0, _ref = insertedArray.length; chunkSize > 0 ? _i <= _ref : _i >= _ref; chunkStart = _i += chunkSize) {
          _results.push(originalArray.splice.apply(originalArray, [start + chunkStart, 0].concat(__slice.call(insertedArray.slice(chunkStart, chunkStart + chunkSize)))));
        }
        return _results;
      }
    },
    sum: function(array) {
      var elt, sum, _i, _len;
      sum = 0;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        elt = array[_i];
        sum += elt;
      }
      return sum;
    },
    uncamelcase: function(string) {
      var result;
      result = string.replace(/([A-Z])|(_)/g, function(m, letter, underscore) {
        return " " + letter;
      });
      return plus.capitalize(result);
    },
    undasherize: function(string) {
      return string.split('-').map(plus.capitalize).join(' ');
    },
    underscore: function(string) {
      string = string[0].toLowerCase() + string.slice(1);
      return string.replace(/([A-Z])|(-)/g, function(m, letter, dash) {
        if (letter) {
          return "_" + letter.toLowerCase();
        } else {
          return "_";
        }
      });
    },
    valueForKeyPath: function(object, keyPath) {
      var key, keys, _i, _len;
      keys = keyPath.split('.');
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        object = object[key];
        if (object == null) {
          return;
        }
      }
      return object;
    }
  };

  module.exports = _.extend({}, _, plus, {
    isEqual: isEqual
  });

}).call(this);

},{"tantamount":20,"underscore":"g3eXzT"}],20:[function(require,module,exports){
(function() {
  var isEqual, _, _isEqual;

  _ = require('underscore');

  _isEqual = _.isEqual;

  isEqual = function(a, b, aStack, bStack) {
    var aCtor, aCtorValid, aElement, aKeyCount, aValue, bCtor, bCtorValid, bKeyCount, bValue, equal, i, key, stackIndex, _i, _len;
    if (aStack == null) {
      aStack = [];
    }
    if (bStack == null) {
      bStack = [];
    }
    if (a === b) {
      return _isEqual(a, b);
    }
    if (_.isFunction(a) || _.isFunction(b)) {
      return _isEqual(a, b);
    }
    if (_.isFunction(a != null ? a.isEqual : void 0)) {
      return a.isEqual(b);
    }
    if (_.isFunction(b != null ? b.isEqual : void 0)) {
      return b.isEqual(a);
    }
    stackIndex = aStack.length;
    while (stackIndex--) {
      if (aStack[stackIndex] === a) {
        return bStack[stackIndex] === b;
      }
    }
    aStack.push(a);
    bStack.push(b);
    equal = false;
    if (_.isArray(a) && _.isArray(b) && a.length === b.length) {
      equal = true;
      for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
        aElement = a[i];
        if (!isEqual(aElement, b[i], aStack, bStack)) {
          equal = false;
          break;
        }
      }
    } else if (_.isRegExp(a) && _.isRegExp(b)) {
      equal = _isEqual(a, b);
    } else if (_.isObject(a) && _.isObject(b)) {
      aCtor = a.constructor;
      bCtor = b.constructor;
      aCtorValid = _.isFunction(aCtor) && aCtor instanceof aCtor;
      bCtorValid = _.isFunction(bCtor) && bCtor instanceof bCtor;
      if (aCtor !== bCtor && !(aCtorValid && bCtorValid)) {
        equal = false;
      } else {
        aKeyCount = 0;
        equal = true;
        for (key in a) {
          aValue = a[key];
          if (!_.has(a, key)) {
            continue;
          }
          aKeyCount++;
          if (!(_.has(b, key) && isEqual(aValue, b[key], aStack, bStack))) {
            equal = false;
            break;
          }
        }
        if (equal) {
          bKeyCount = 0;
          for (key in b) {
            bValue = b[key];
            if (_.has(b, key)) {
              bKeyCount++;
            }
          }
          equal = aKeyCount === bKeyCount;
        }
      }
    } else {
      equal = _isEqual(a, b);
    }
    aStack.pop();
    bStack.pop();
    return equal;
  };

  module.exports = function(a, b) {
    return isEqual(a, b);
  };

}).call(this);

},{"underscore":"g3eXzT"}],21:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Inflections, root, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  Inflections = (function() {
    Inflections.prototype.defaultUncountables = ['equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'jeans', 'moose', 'deer', 'news', 'music'];

    Inflections.prototype.defaultPluralRules = [[/$/, 's'], [/s$/i, 's'], [/^(ax|test)is$/i, '$1es'], [/(octop|vir)us$/i, '$1i'], [/(octop|vir)i$/i, '$1i'], [/(alias|status)$/i, '$1es'], [/(bu)s$/i, '$1ses'], [/(buffal|tomat)o$/i, '$1oes'], [/([ti])um$/i, '$1a'], [/([ti])a$/i, '$1a'], [/sis$/i, 'ses'], [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'], [/(hive)$/i, '$1s'], [/([^aeiouy]|qu)y$/i, '$1ies'], [/(x|ch|ss|sh)$/i, '$1es'], [/(matr|vert|ind)(?:ix|ex)$/i, '$1ices'], [/(m|l)ouse$/i, '$1ice'], [/(m|l)ice$/i, '$1ice'], [/^(ox)$/i, '$1en'], [/^(oxen)$/i, '$1'], [/(quiz)$/i, '$1zes']];

    Inflections.prototype.defaultSingularRules = [[/s$/i, ''], [/(ss)$/i, '$1'], [/(n)ews$/i, '$1ews'], [/([ti])a$/i, '$1um'], [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1$2sis'], [/(^analy)(sis|ses)$/i, '$1sis'], [/([^f])ves$/i, '$1fe'], [/(hive)s$/i, '$1'], [/(tive)s$/i, '$1'], [/([lr])ves$/i, '$1f'], [/([^aeiouy]|qu)ies$/i, '$1y'], [/(s)eries$/i, '$1eries'], [/(m)ovies$/i, '$1ovie'], [/(x|ch|ss|sh)es$/i, '$1'], [/(m|l)ice$/i, '$1ouse'], [/(bus)(es)?$/i, '$1'], [/(o)es$/i, '$1'], [/(shoe)s$/i, '$1'], [/(cris|test)(is|es)$/i, '$1is'], [/^(a)x[ie]s$/i, '$1xis'], [/(octop|vir)(us|i)$/i, '$1us'], [/(alias|status)(es)?$/i, '$1'], [/^(ox)en/i, '$1'], [/(vert|ind)ices$/i, '$1ex'], [/(matr)ices$/i, '$1ix'], [/(quiz)zes$/i, '$1'], [/(database)s$/i, '$1']];

    Inflections.prototype.defaultIrregularRules = [['person', 'people'], ['man', 'men'], ['child', 'children'], ['sex', 'sexes'], ['move', 'moves'], ['cow', 'kine'], ['zombie', 'zombies']];

    Inflections.prototype.defaultHumanRules = [];

    function Inflections() {
      this.apply_inflections = __bind(this.apply_inflections, this);

      this.titleize = __bind(this.titleize, this);
      this.humanize = __bind(this.humanize, this);
      this.underscore = __bind(this.underscore, this);
      this.camelize = __bind(this.camelize, this);
      this.singularize = __bind(this.singularize, this);

      this.pluralize = __bind(this.pluralize, this);

      this.clearInflections = __bind(this.clearInflections, this);

      this.human = __bind(this.human, this);
      this.uncountable = __bind(this.uncountable, this);

      this.irregular = __bind(this.irregular, this);

      this.singular = __bind(this.singular, this);

      this.plural = __bind(this.plural, this);

      this.acronym = __bind(this.acronym, this);
      this.applyDefaultPlurals = __bind(this.applyDefaultPlurals, this);

      this.applyDefaultUncountables = __bind(this.applyDefaultUncountables, this);

      this.applyDefaultRules = __bind(this.applyDefaultRules, this);
      this.plurals = [];
      this.singulars = [];
      this.uncountables = [];
      this.humans = [];
      this.acronyms = {};
      this.applyDefaultRules();
    }

    Inflections.prototype.applyDefaultRules = function() {
      this.applyDefaultUncountables();
      this.applyDefaultPlurals();
      this.applyDefaultSingulars();
      return this.applyDefaultIrregulars();
    };

    Inflections.prototype.applyDefaultUncountables = function() {
      return this.uncountable(this.defaultUncountables);
    };

    Inflections.prototype.applyDefaultPlurals = function() {
      var _this = this;
      return _.each(this.defaultPluralRules, function(rule) {
        var capture, regex;
        regex = rule[0], capture = rule[1];
        return _this.plural(regex, capture);
      });
    };

    Inflections.prototype.applyDefaultSingulars = function() {
      var _this = this;
      return _.each(this.defaultSingularRules, function(rule) {
        var capture, regex;
        regex = rule[0], capture = rule[1];
        return _this.singular(regex, capture);
      });
    };

    Inflections.prototype.applyDefaultIrregulars = function() {
      var _this = this;
      return _.each(this.defaultIrregularRules, function(rule) {
        var plural, singular;
        singular = rule[0], plural = rule[1];
        return _this.irregular(singular, plural);
      });
    };

    Inflections.prototype.acronym = function(word) {
      this.acronyms[word.toLowerCase()] = word;
      return this.acronym_matchers = _.values(this.acronyms).join("|");
    };

    Inflections.prototype.plural = function(rule, replacement) {
      if (typeof rule === 'string') {
        delete this.uncountables[_.indexOf(this.uncountables, rule)];
      }
      delete this.uncountables[_.indexOf(this.uncountables, replacement)];
      return this.plurals.unshift([rule, replacement]);
    };

    Inflections.prototype.singular = function(rule, replacement) {
      if (typeof rule === 'string') {
        delete this.uncountables[_.indexOf(this.uncountables, rule)];
      }
      delete this.uncountables[_.indexOf(this.uncountables, replacement)];
      return this.singulars.unshift([rule, replacement]);
    };

    Inflections.prototype.irregular = function(singular, plural) {
      delete this.uncountables[_.indexOf(this.uncountables, singular)];
      delete this.uncountables[_.indexOf(this.uncountables, plural)];
      if (singular.substring(0, 1).toUpperCase() === plural.substring(0, 1).toUpperCase()) {
        this.plural(new RegExp("(" + (singular.substring(0, 1)) + ")" + (singular.substring(1, plural.length)) + "$", "i"), '$1' + plural.substring(1, plural.length));
        this.plural(new RegExp("(" + (plural.substring(0, 1)) + ")" + (plural.substring(1, plural.length)) + "$", "i"), '$1' + plural.substring(1, plural.length));
        return this.singular(new RegExp("(" + (plural.substring(0, 1)) + ")" + (plural.substring(1, plural.length)) + "$", "i"), '$1' + singular.substring(1, plural.length));
      } else {
        this.plural(new RegExp("" + (singular.substring(0, 1)) + (singular.substring(1, plural.length)) + "$", "i"), plural.substring(0, 1) + plural.substring(1, plural.length));
        this.plural(new RegExp("" + (singular.substring(0, 1)) + (singular.substring(1, plural.length)) + "$", "i"), plural.substring(0, 1) + plural.substring(1, plural.length));
        this.plural(new RegExp("" + (plural.substring(0, 1)) + (plural.substring(1, plural.length)) + "$", "i"), plural.substring(0, 1) + plural.substring(1, plural.length));
        this.plural(new RegExp("" + (plural.substring(0, 1)) + (plural.substring(1, plural.length)) + "$", "i"), plural.substring(0, 1) + plural.substring(1, plural.length));
        this.singular(new RegExp("" + (plural.substring(0, 1)) + (plural.substring(1, plural.length)) + "$", "i"), singular.substring(0, 1) + singular.substring(1, plural.length));
        return this.singular(new RegExp("" + (plural.substring(0, 1)) + (plural.substring(1, plural.length)) + "$", "i"), singular.substring(0, 1) + singular.substring(1, plural.length));
      }
    };

    Inflections.prototype.uncountable = function() {
      var words;
      words = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.uncountables.push(words);
      return this.uncountables = _.flatten(this.uncountables);
    };

    Inflections.prototype.human = function(rule, replacement) {
      return this.humans.unshift([rule, replacement]);
    };

    Inflections.prototype.clearInflections = function(scope) {
      if (scope == null) {
        scope = 'all';
      }
      return this[scope] = [];
    };

    Inflections.prototype.pluralize = function(word, count, options) {
      var result, _ref;
      if (options == null) {
        options = {};
      }
      options = _.extend({
        plural: void 0,
        showNumber: true
      }, options);
      if (count !== void 0) {
        result = "";
        if (options.showNumber === true) {
          result += "" + (count != null ? count : 0) + " ";
        }
        return result += count === 1 || (count != null ? typeof count.toString === "function" ? count.toString().match(/^1(\.0+)?$/) : void 0 : void 0) ? word : (_ref = options.plural) != null ? _ref : this.pluralize(word);
      } else {
        return this.apply_inflections(word, this.plurals);
      }
    };

    Inflections.prototype.singularize = function(word) {
      return this.apply_inflections(word, this.singulars);
    };

    Inflections.prototype.camelize = function(term, uppercase_first_letter) {
      var _this = this;
      if (uppercase_first_letter == null) {
        uppercase_first_letter = true;
      }
      if (uppercase_first_letter) {
        term = term.replace(/^[a-z\d]*/, function(a) {
          return _this.acronyms[a] || _.capitalize(a);
        });
      } else {
        term = term.replace(RegExp("^(?:" + this.acronym_matchers + "(?=\\b|[A-Z_])|\\w)"), function(a) {
          return a.toLowerCase();
        });
      }
      return term = term.replace(/(?:_|(\/))([a-z\d]*)/gi, function(match, $1, $2, idx, string) {
        $1 || ($1 = '');
        return "" + $1 + (_this.acronyms[$2] || _.capitalize($2));
      });
    };

    Inflections.prototype.underscore = function(camel_cased_word) {
      var word;
      word = camel_cased_word;
      word = word.replace(RegExp("(?:([A-Za-z\\d])|^)(" + this.acronym_matchers + ")(?=\\b|[^a-z])", "g"), function(match, $1, $2) {
        return "" + ($1 || '') + ($1 ? '_' : '') + ($2.toLowerCase());
      });
      word = word.replace(/([A-Z\d]+)([A-Z][a-z])/g, "$1_$2");
      word = word.replace(/([a-z\d])([A-Z])/g, "$1_$2");
      word = word.replace('-', '_');
      return word = word.toLowerCase();
    };

    Inflections.prototype.humanize = function(lower_case_and_underscored_word) {
      var human, replacement, rule, word, _i, _len, _ref,
        _this = this;
      word = lower_case_and_underscored_word;
      _ref = this.humans;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        human = _ref[_i];
        rule = human[0];
        replacement = human[1];
        if (((rule.test != null) && rule.test(word)) || ((rule.indexOf != null) && word.indexOf(rule) >= 0)) {
          word = word.replace(rule, replacement);
          break;
        }
      }
      word = word.replace(/_id$/g, '');
      word = word.replace(/_/g, ' ');
      word = word.replace(/([a-z\d]*)/gi, function(match) {
        return _this.acronyms[match] || match.toLowerCase();
      });
      return word = _.trim(word).replace(/^\w/g, function(match) {
        return match.toUpperCase();
      });
    };

    Inflections.prototype.titleize = function(word) {
      return this.humanize(this.underscore(word)).replace(/([\s¿]+)([a-z])/g, function(match, boundary, letter, idx, string) {
        return match.replace(letter, letter.toUpperCase());
      });
    };

    Inflections.prototype.apply_inflections = function(word, rules) {
      var capture, match, regex, result, rule, _i, _len;
      if (!word) {
        return word;
      } else {
        result = word;
        match = result.toLowerCase().match(/\b\w+$/);
        if (match && _.indexOf(this.uncountables, match[0]) !== -1) {
          return result;
        } else {
          for (_i = 0, _len = rules.length; _i < _len; _i++) {
            rule = rules[_i];
            regex = rule[0], capture = rule[1];
            if (result.match(regex)) {
              result = result.replace(regex, capture);
              break;
            }
          }
          return result;
        }
      }
    };

    return Inflections;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  _ = root._ || require('underscore');

  if (typeof require !== "undefined" && require !== null) {
    _.str = require('underscore.string');
    _.mixin(_.str.exports());
    _.str.include('Underscore.string', 'string');
  } else {
    _.mixin(_.str.exports());
  }

  if (typeof exports === 'undefined') {
    _.mixin(new Inflections);
  } else {
    module.exports = new Inflections;
  }

}).call(this);

},{"underscore":"g3eXzT","underscore.string":22}],22:[function(require,module,exports){
//  Underscore.string
//  (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
//  Underscore.string is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/epeli/underscore.string
//  Some code is borrowed from MooTools and Alexandru Marasteanu.
//  Version '2.3.2'

!function(root, String){
  'use strict';

  // Defining helper functions.

  var nativeTrim = String.prototype.trim;
  var nativeTrimRight = String.prototype.trimRight;
  var nativeTrimLeft = String.prototype.trimLeft;

  var parseNumber = function(source) { return source * 1 || 0; };

  var strRepeat = function(str, qty){
    if (qty < 1) return '';
    var result = '';
    while (qty > 0) {
      if (qty & 1) result += str;
      qty >>= 1, str += str;
    }
    return result;
  };

  var slice = [].slice;

  var defaultToWhiteSpace = function(characters) {
    if (characters == null)
      return '\\s';
    else if (characters.source)
      return characters.source;
    else
      return '[' + _s.escapeRegExp(characters) + ']';
  };

  // Helper for toBoolean
  function boolMatch(s, matchers) {
    var i, matcher, down = s.toLowerCase();
    matchers = [].concat(matchers);
    for (i = 0; i < matchers.length; i += 1) {
      matcher = matchers[i];
      if (!matcher) continue;
      if (matcher.test && matcher.test(s)) return true;
      if (matcher.toLowerCase() === down) return true;
    }
  }

  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    amp: '&',
    apos: "'"
  };

  var reversedEscapeChars = {};
  for(var key in escapeChars) reversedEscapeChars[escapeChars[key]] = key;
  reversedEscapeChars["'"] = '#39';

  // sprintf() for JavaScript 0.7-beta1
  // http://www.diveintojavascript.com/projects/javascript-sprintf
  //
  // Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
  // All rights reserved.

  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    var str_repeat = strRepeat;

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          } else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
          }
          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw new Error('[_.sprintf] huh?');
                }
              }
            }
            else {
              throw new Error('[_.sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw new Error('[_.sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();



  // Defining underscore.string

  var _s = {

    VERSION: '2.3.0',

    isBlank: function(str){
      if (str == null) str = '';
      return (/^\s*$/).test(str);
    },

    stripTags: function(str){
      if (str == null) return '';
      return String(str).replace(/<\/?[^>]+>/g, '');
    },

    capitalize : function(str){
      str = str == null ? '' : String(str);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    chop: function(str, step){
      if (str == null) return [];
      str = String(str);
      step = ~~step;
      return step > 0 ? str.match(new RegExp('.{1,' + step + '}', 'g')) : [str];
    },

    clean: function(str){
      return _s.strip(str).replace(/\s+/g, ' ');
    },

    count: function(str, substr){
      if (str == null || substr == null) return 0;

      str = String(str);
      substr = String(substr);

      var count = 0,
        pos = 0,
        length = substr.length;

      while (true) {
        pos = str.indexOf(substr, pos);
        if (pos === -1) break;
        count++;
        pos += length;
      }

      return count;
    },

    chars: function(str) {
      if (str == null) return [];
      return String(str).split('');
    },

    swapCase: function(str) {
      if (str == null) return '';
      return String(str).replace(/\S/g, function(c){
        return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
      });
    },

    escapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; });
    },

    unescapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      });
    },

    escapeRegExp: function(str){
      if (str == null) return '';
      return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    },

    splice: function(str, i, howmany, substr){
      var arr = _s.chars(str);
      arr.splice(~~i, ~~howmany, substr);
      return arr.join('');
    },

    insert: function(str, i, substr){
      return _s.splice(str, i, 0, substr);
    },

    include: function(str, needle){
      if (needle === '') return true;
      if (str == null) return false;
      return String(str).indexOf(needle) !== -1;
    },

    join: function() {
      var args = slice.call(arguments),
        separator = args.shift();

      if (separator == null) separator = '';

      return args.join(separator);
    },

    lines: function(str) {
      if (str == null) return [];
      return String(str).split("\n");
    },

    reverse: function(str){
      return _s.chars(str).reverse().join('');
    },

    startsWith: function(str, starts){
      if (starts === '') return true;
      if (str == null || starts == null) return false;
      str = String(str); starts = String(starts);
      return str.length >= starts.length && str.slice(0, starts.length) === starts;
    },

    endsWith: function(str, ends){
      if (ends === '') return true;
      if (str == null || ends == null) return false;
      str = String(str); ends = String(ends);
      return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
    },

    succ: function(str){
      if (str == null) return '';
      str = String(str);
      return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length-1) + 1);
    },

    titleize: function(str){
      if (str == null) return '';
      str  = String(str).toLowerCase();
      return str.replace(/(?:^|\s|-)\S/g, function(c){ return c.toUpperCase(); });
    },

    camelize: function(str){
      return _s.trim(str).replace(/[-_\s]+(.)?/g, function(match, c){ return c ? c.toUpperCase() : ""; });
    },

    underscored: function(str){
      return _s.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
    },

    dasherize: function(str){
      return _s.trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
    },

    classify: function(str){
      return _s.titleize(String(str).replace(/[\W_]/g, ' ')).replace(/\s/g, '');
    },

    humanize: function(str){
      return _s.capitalize(_s.underscored(str).replace(/_id$/,'').replace(/_/g, ' '));
    },

    trim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrim) return nativeTrim.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
    },

    ltrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('^' + characters + '+'), '');
    },

    rtrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp(characters + '+$'), '');
    },

    truncate: function(str, length, truncateStr){
      if (str == null) return '';
      str = String(str); truncateStr = truncateStr || '...';
      length = ~~length;
      return str.length > length ? str.slice(0, length) + truncateStr : str;
    },

    /**
     * _s.prune: a more elegant version of truncate
     * prune extra chars, never leaving a half-chopped word.
     * @author github.com/rwz
     */
    prune: function(str, length, pruneStr){
      if (str == null) return '';

      str = String(str); length = ~~length;
      pruneStr = pruneStr != null ? String(pruneStr) : '...';

      if (str.length <= length) return str;

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = _s.rtrim(template.slice(0, template.length-1));

      return (template+pruneStr).length > str.length ? str : str.slice(0, template.length)+pruneStr;
    },

    words: function(str, delimiter) {
      if (_s.isBlank(str)) return [];
      return _s.trim(str, delimiter).split(delimiter || /\s+/);
    },

    pad: function(str, length, padStr, type) {
      str = str == null ? '' : String(str);
      length = ~~length;

      var padlen  = 0;

      if (!padStr)
        padStr = ' ';
      else if (padStr.length > 1)
        padStr = padStr.charAt(0);

      switch(type) {
        case 'right':
          padlen = length - str.length;
          return str + strRepeat(padStr, padlen);
        case 'both':
          padlen = length - str.length;
          return strRepeat(padStr, Math.ceil(padlen/2)) + str
                  + strRepeat(padStr, Math.floor(padlen/2));
        default: // 'left'
          padlen = length - str.length;
          return strRepeat(padStr, padlen) + str;
        }
    },

    lpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr);
    },

    rpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'right');
    },

    lrpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'both');
    },

    sprintf: sprintf,

    vsprintf: function(fmt, argv){
      argv.unshift(fmt);
      return sprintf.apply(null, argv);
    },

    toNumber: function(str, decimals) {
      if (!str) return 0;
      str = _s.trim(str);
      if (!str.match(/^-?\d+(?:\.\d+)?$/)) return NaN;
      return parseNumber(parseNumber(str).toFixed(~~decimals));
    },

    numberFormat : function(number, dec, dsep, tsep) {
      if (isNaN(number) || number == null) return '';

      number = number.toFixed(~~dec);
      tsep = typeof tsep == 'string' ? tsep : ',';

      var parts = number.split('.'), fnums = parts[0],
        decimals = parts[1] ? (dsep || '.') + parts[1] : '';

      return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
    },

    strRight: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strRightBack: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.lastIndexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strLeft: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    strLeftBack: function(str, sep){
      if (str == null) return '';
      str += ''; sep = sep != null ? ''+sep : sep;
      var pos = str.lastIndexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    toSentence: function(array, separator, lastSeparator, serial) {
      separator = separator || ', ';
      lastSeparator = lastSeparator || ' and ';
      var a = array.slice(), lastMember = a.pop();

      if (array.length > 2 && serial) lastSeparator = _s.rtrim(separator) + lastSeparator;

      return a.length ? a.join(separator) + lastSeparator + lastMember : lastMember;
    },

    toSentenceSerial: function() {
      var args = slice.call(arguments);
      args[3] = true;
      return _s.toSentence.apply(_s, args);
    },

    slugify: function(str) {
      if (str == null) return '';

      var from  = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",
          to    = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",
          regex = new RegExp(defaultToWhiteSpace(from), 'g');

      str = String(str).toLowerCase().replace(regex, function(c){
        var index = from.indexOf(c);
        return to.charAt(index) || '-';
      });

      return _s.dasherize(str.replace(/[^\w\s-]/g, ''));
    },

    surround: function(str, wrapper) {
      return [wrapper, str, wrapper].join('');
    },

    quote: function(str, quoteChar) {
      return _s.surround(str, quoteChar || '"');
    },

    unquote: function(str, quoteChar) {
      quoteChar = quoteChar || '"';
      if (str[0] === quoteChar && str[str.length-1] === quoteChar)
        return str.slice(1,str.length-1);
      else return str;
    },

    exports: function() {
      var result = {};

      for (var prop in this) {
        if (!this.hasOwnProperty(prop) || prop.match(/^(?:include|contains|reverse)$/)) continue;
        result[prop] = this[prop];
      }

      return result;
    },

    repeat: function(str, qty, separator){
      if (str == null) return '';

      qty = ~~qty;

      // using faster implementation if separator is not needed;
      if (separator == null) return strRepeat(String(str), qty);

      // this one is about 300x slower in Google Chrome
      for (var repeat = []; qty > 0; repeat[--qty] = str) {}
      return repeat.join(separator);
    },

    naturalCmp: function(str1, str2){
      if (str1 == str2) return 0;
      if (!str1) return -1;
      if (!str2) return 1;

      var cmpRegex = /(\.\d+)|(\d+)|(\D+)/g,
        tokens1 = String(str1).toLowerCase().match(cmpRegex),
        tokens2 = String(str2).toLowerCase().match(cmpRegex),
        count = Math.min(tokens1.length, tokens2.length);

      for(var i = 0; i < count; i++) {
        var a = tokens1[i], b = tokens2[i];

        if (a !== b){
          var num1 = parseInt(a, 10);
          if (!isNaN(num1)){
            var num2 = parseInt(b, 10);
            if (!isNaN(num2) && num1 - num2)
              return num1 - num2;
          }
          return a < b ? -1 : 1;
        }
      }

      if (tokens1.length === tokens2.length)
        return tokens1.length - tokens2.length;

      return str1 < str2 ? -1 : 1;
    },

    levenshtein: function(str1, str2) {
      if (str1 == null && str2 == null) return 0;
      if (str1 == null) return String(str2).length;
      if (str2 == null) return String(str1).length;

      str1 = String(str1); str2 = String(str2);

      var current = [], prev, value;

      for (var i = 0; i <= str2.length; i++)
        for (var j = 0; j <= str1.length; j++) {
          if (i && j)
            if (str1.charAt(j - 1) === str2.charAt(i - 1))
              value = prev;
            else
              value = Math.min(current[j], current[j - 1], prev) + 1;
          else
            value = i + j;

          prev = current[j];
          current[j] = value;
        }

      return current.pop();
    },

    toBoolean: function(str, trueValues, falseValues) {
      if (typeof str === "number") str = "" + str;
      if (typeof str !== "string") return !!str;
      str = _s.trim(str);
      if (boolMatch(str, trueValues || ["true", "1"])) return true;
      if (boolMatch(str, falseValues || ["false", "0"])) return false;
    }
  };

  // Aliases

  _s.strip    = _s.trim;
  _s.lstrip   = _s.ltrim;
  _s.rstrip   = _s.rtrim;
  _s.center   = _s.lrpad;
  _s.rjust    = _s.lpad;
  _s.ljust    = _s.rpad;
  _s.contains = _s.include;
  _s.q        = _s.quote;
  _s.toBool   = _s.toBoolean;

  // Exporting

  // CommonJS module is defined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = _s;

    exports._s = _s;
  }

  // Register as a named module with AMD.
  if (typeof define === 'function' && define.amd)
    define('underscore.string', [], function(){ return _s; });


  // Integrate with Underscore.js if defined
  // or create our own underscore object.
  root._ = root._ || {};
  root._.string = root._.str = _s;
}(this, String);

},{}]},{},[1])
(1)
});
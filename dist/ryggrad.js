!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Ryggrad=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/Ryggrad.js');

},{"./lib/Ryggrad.js":10}],2:[function(require,module,exports){
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

},{"./Events":5,"./Module":7}],3:[function(require,module,exports){
var $, Base, Collection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = jQuery;

Base = require('./Base');

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection(options) {
    if (options == null) {
      options = {};
    }
    this.asyncFindRequest = __bind(this.asyncFindRequest, this);
    this.asyncAllRequest = __bind(this.asyncAllRequest, this);
    this.asyncFindBy = __bind(this.asyncFindBy, this);
    this.asyncAll = __bind(this.asyncAll, this);
    this.asyncFind = __bind(this.asyncFind, this);
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
    if ('all' in options) {
      this.asyncAllRequest = options.all;
    }
    if ('find' in options) {
      this.asyncFindRequest = options.find;
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
    record = this.syncFind(id);
    record || (record = this.baseSyncFind(id));
    if (record && !options.remote) {
      return record;
    } else {
      return this.asyncFind(id, options);
    }
  };

  Collection.prototype.findBy = function(callback, request) {
    var filter;
    if (typeof callback === 'string') {
      filter = function(r) {
        return r.get(callback) === request;
      };
      return this.syncFindBy(filter);
    } else {
      if (typeof callback !== 'function') {
        throw new Error('callback function required');
      }
      return this.syncFindBy(callback) || this.asyncFindBy(request);
    }
  };

  Collection.prototype.refresh = function(options) {
    if (options == null) {
      options = {};
    }
    this.reset();
    return this.fetch(options);
  };

  Collection.prototype.all = function(callback, options) {
    var result;
    if (options == null) {
      options = {};
    }
    if (typeof callback === 'object') {
      options = callback;
      callback = null;
    }
    if (this.shouldPreload() || options.remote) {
      result = this.asyncAll(options);
    } else {
      result = this.records;
    }
    if (callback) {
      this.promise.done(callback);
    }
    return result;
  };

  Collection.prototype.syncFindBy = function(callback) {
    return this.records.filter(callback)[0];
  };

  Collection.prototype.reset = function() {
    this.remove(this.records);
    this.ids = {};
    this.cids = {};
    this.trigger('reset');
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
    return this.asyncAll(options).request;
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

  Collection.prototype.add = function(records) {
    var changes, i, original, record, _base, _i, _len, _name, _ref;
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

  Collection.prototype.remove = function(records) {
    var index, record, _i, _len, _ref, _results;
    if (!$.isArray(records)) {
      records = [records];
    }
    _ref = records.slice(0);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      record = _ref[_i];
      record.off('all', this.recordEvent);
      delete this.cids[record.getCID()];
      if (record.getID()) {
        delete this.ids[record.getID()];
      }
      index = this.records.indexOf(record);
      _results.push(this.records.splice(index, 1));
    }
    return _results;
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

  Collection.prototype.asyncFind = function(id, options) {
    var record, request,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (!(this.asyncFindRequest && this.model.uri())) {
      return;
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
      return _this.add(record);
    });
    return record;
  };

  Collection.prototype.asyncAll = function(options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    if (!(this.asyncAllRequest && this.model.uri())) {
      return;
    }
    this.request = this.asyncAllRequest.call(this.model, this.model, options.request);
    this.records.request = this.request;
    this.records.promise = this.promise = $.Deferred();
    this.request.done(function(result) {
      _this.add(result);
      return _this.promise.resolve(_this.records);
    });
    return this.records;
  };

  Collection.prototype.asyncFindBy = function(asyncRequest) {
    var record, request,
      _this = this;
    if (!(asyncRequest && this.model.uri())) {
      return;
    }
    record = new this.model;
    request = asyncRequest.call(this.model, record);
    record.request = request;
    record.promise = $.Deferred();
    request.done(function(response) {
      record.set(response);
      record.promise.resolve(record);
      return _this.add(record);
    });
    return record;
  };

  Collection.prototype.asyncAllRequest = function(model, options) {
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

  Collection.prototype.asyncFindRequest = function(record, options) {
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

  return Collection;

})(Base);

module.exports = Collection;

},{"./Base":2}],4:[function(require,module,exports){
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

},{"./Base":2,"./Router":9}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
var $, Base, Collection, Model, eql, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

$ = jQuery;

Base = require('./Base');

Collection = require('./Collection');

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
        name: 'base',
        comparator: this.comparator
      });
    }
    return this.collection;
  };

  Model.count = function() {
    return this.records().count();
  };

  Model.all = function(callback) {
    return this.records().all(callback);
  };

  Model.find = function(id, options) {
    if (options == null) {
      options = {};
    }
    return this.records().find(id, options);
  };

  Model.findBy = function(callback, request) {
    return this.records().findBy(callback, request);
  };

  Model.filter = function(callback) {
    return this.records().filter(callback);
  };

  Model.add = function(values) {
    return this.records().add(values);
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
    return value || ("/" + (_.pluralize(this.name.toLowerCase())));
  };

  Model.toString = function() {
    return this.name;
  };

  Model.on = function(event, callback) {
    return this.records().on("record." + event, callback);
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

  Model.create = function(atts) {
    var obj;
    if (atts == null) {
      atts = {};
    }
    obj = new this(atts);
    return obj.save();
  };

  Model.refresh = function() {
    var _ref;
    return (_ref = this.records()).refresh.apply(_ref, arguments);
  };

  Model.destroy = function(record) {
    return this.records().remove(record);
  };

  Model.destroyAll = function() {
    return this.records().reset();
  };

  Model.fetch = function(options) {
    if (options == null) {
      options = {};
    }
    return this.records().fetch(options);
  };

  function Model(atts) {
    var rec;
    if (atts == null) {
      atts = {};
    }
    this.setRequest = __bind(this.setRequest, this);
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
        this.trigger("update:" + attr);
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

  Model.prototype.add = function() {
    return this.constructor.add(this);
  };

  Model.prototype.save = function(attrs) {
    var isNew, type;
    if (attrs) {
      this.set(attrs);
    }
    isNew = this.isNew();
    type = isNew ? 'POST' : 'PUT';
    this.setRequest(this.set($.ajax({
      type: type,
      url: this.uri(),
      data: this.toJSON(),
      queue: true,
      warn: true
    })));
    this.add();
    this.trigger('save');
    this.trigger(isNew ? 'create' : 'update');
    return this;
  };

  Model.prototype.destroy = function() {
    this.constructor.destroy(this);
    this.setRequest(this.set($.ajax({
      type: "DELETE",
      url: this.uri(this.getID()),
      queue: true,
      warn: true
    })));
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

  Model.prototype.setRequest = function(request) {
    var _this = this;
    this.request = request;
    this.promise = $.Deferred();
    this.request.done(function() {
      return _this.promise.resolve(_this);
    });
    return this.request;
  };

  Model.prototype.fetch = function(options) {
    var defaults;
    if (options == null) {
      options = {};
    }
    defaults = {
      request: {
        url: "" + (this.constructor.url()) + "/" + (this.get('id'))
      }
    };
    options = $.extend(defaults, options);
    return this.constructor.fetch(options);
  };

  return Model;

})(Base);

module.exports = Model;

},{"./Base":2,"./Collection":3,"underscore":"pRZqWN","underscore.inflections":19}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"./Base":2,"./Controller":4,"./Module":7,"./Route":8}],10:[function(require,module,exports){
var Ryggrad, jquery;

jquery = require('jquery');

require('./jqueryExtensions')(window);

require('./jqueryAjax')(window);

Ryggrad = {};

Ryggrad.Base = require('./Base');

Ryggrad.Events = require('./Events');

Ryggrad.Module = require('./Module');

Ryggrad.Collection = require('./Collection');

Ryggrad.Model = require('./Model');

Ryggrad.View = require('space-pen').View;

Ryggrad.Controller = require('./Controller');

Ryggrad.Route = require('./Route');

Ryggrad.Router = require('./Router');

Ryggrad.Util = require('./Util');

Ryggrad.version = "0.0.5";

module.exports = Ryggrad;

},{"./Base":2,"./Collection":3,"./Controller":4,"./Events":5,"./Model":6,"./Module":7,"./Route":8,"./Router":9,"./Util":11,"./jqueryAjax":12,"./jqueryExtensions":13,"jquery":"IfVDOB","space-pen":15}],11:[function(require,module,exports){
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

},{"jquery":"IfVDOB"}],14:[function(require,module,exports){
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

},{"jquery":"IfVDOB","underscore-plus":16}],15:[function(require,module,exports){
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

},{"./jquery-extensions":14}],16:[function(require,module,exports){
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

},{"tantamount":17,"underscore":18}],17:[function(require,module,exports){
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

},{"underscore":18}],18:[function(require,module,exports){
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the 
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from an array.
  // If **n** is not specified, returns a single random element from the array.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (arguments.length < 2 || guard) {
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

},{}],19:[function(require,module,exports){
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

},{"underscore":"pRZqWN","underscore.string":20}],20:[function(require,module,exports){
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
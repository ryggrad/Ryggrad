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
    var path;
    if (value) {
      this.url = (function() {
        return value;
      });
    }
    path = value || ("/" + (_.pluralize(this.name.toLowerCase())));
    if (this.host) {
      return this.host + "/" + path;
    } else {
      return path;
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

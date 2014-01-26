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
    this.storage = options.storage || new Ajax(this);
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
      return this.storage.find(id, options);
    }
  };

  Collection.prototype.findBy = function(callback, request) {
    var filter;
    if (typeof callback === 'string') {
      filter = function(r) {
        return r.get(callback) === request;
      };
      return this.syncFindBy(filter) || this.storage.findBy(filter);
    } else {
      if (typeof callback !== 'function') {
        throw new Error('callback function required');
      }
      return this.syncFindBy(callback) || this.storage.findBy(callback);
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
      result = this.storage.all(options);
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
    return this.storage.all(options).request;
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
    this.storage.add(records);
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
    this.storage.destroy(records);
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

  return Collection;

})(Base);

module.exports = Collection;

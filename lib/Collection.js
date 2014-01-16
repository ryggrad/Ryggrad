var $, Collection, Module,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = jQuery;

Module = require('./Module');

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection(options) {
    if (options == null) {
      options = {};
    }
    this.asyncFindRequest = __bind(this.asyncFindRequest, this);
    this.asyncAllRequest = __bind(this.asyncAllRequest, this);
    this.baseSyncFind = __bind(this.baseSyncFind, this);
    this.syncFind = __bind(this.syncFind, this);
    this.asyncFind = __bind(this.asyncFind, this);
    this.asyncFindBy = __bind(this.asyncFindBy, this);
    this.syncFindBy = __bind(this.syncFindBy, this);
    this.asyncAll = __bind(this.asyncAll, this);
    this.isBase = __bind(this.isBase, this);
    this.shouldPreload = __bind(this.shouldPreload, this);
    this.recordEvent = __bind(this.recordEvent, this);
    this.unobserve = __bind(this.unobserve, this);
    this.observe = __bind(this.observe, this);
    this.reset = __bind(this.reset, this);
    this.remove = __bind(this.remove, this);
    this.add = __bind(this.add, this);
    this.empty = __bind(this.empty, this);
    this.exists = __bind(this.exists, this);
    this.resort = __bind(this.resort, this);
    this.sort = __bind(this.sort, this);
    this.each = __bind(this.each, this);
    this.fetch = __bind(this.fetch, this);
    this.all = __bind(this.all, this);
    this.refresh = __bind(this.refresh, this);
    this.findBy = __bind(this.findBy, this);
    this.find = __bind(this.find, this);
    if (!options.model) {
      throw new Error('Model required');
    }
    this.ids = {};
    this.cids = {};
    this.records = options.records || [];
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
    if (typeof callback !== 'function') {
      throw new Error('callback function required');
    }
    return this.syncFindBy(callback) || this.asyncFindBy(request);
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

  Collection.prototype.comparator = function(a, b) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  };

  Collection.prototype.recordEvent = function(event, args, record) {
    return this.trigger("record." + event, record, args);
  };

  Collection.prototype.shouldPreload = function() {
    return this.empty() && !this.request;
  };

  Collection.prototype.isBase = function() {
    return this.model.collection === this;
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

  Collection.prototype.syncFindBy = function(callback) {
    return this.records.filter(callback)[0];
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

})(Module);

module.exports = Collection;

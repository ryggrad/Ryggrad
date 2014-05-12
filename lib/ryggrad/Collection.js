var Ajax, Collection, Theorist,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Theorist = require("theorist");

Ajax = require('./storage/Ajax');

Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection(options) {
    var _base;
    if (options == null) {
      options = {};
    }
    this.ids = {};
    if (options.model) {
      this.model = options.model;
      this.name = options.model.pluralName();
      this.model = options.model;
      (_base = this.model).storageOptions || (_base.storageOptions = {});
      if (options.storage) {
        this.storage = new options.storage(this, this.model.storageOptions);
      } else if (this.model.storage) {
        this.storage = new this.model.storage(this, this.model.storageOptions);
      } else {
        this.storage = new Ajax(this, this.model.storageOptions);
      }
    }
    Collection.__super__.constructor.call(this);
  }

  Collection.prototype.count = function() {
    return this.length;
  };

  Collection.prototype.realCount = function() {
    var index, record, _i, _len;
    index = 0;
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      record = this[_i];
      index++;
    }
    return index;
  };

  Collection.prototype.url = function() {
    return this.model.url();
  };

  Collection.prototype.add = function(records, options) {
    var record, _i, _len, _results;
    if (options == null) {
      options = {};
    }
    if (typeof records === "Array") {
      _results = [];
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        this.ids[record.id] = record;
        record.index = this.length;
        _results.push(this.push(record));
      }
      return _results;
    } else {
      this.ids[records.id] = records;
      records.index = this.length;
      return this.push(records);
    }
  };

  Collection.prototype.fromJSON = function(records) {
    var record, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      if (this.ids[record.id]) {
        _results.push(this.ids[record.id].set(record));
      } else {
        _results.push(new this.model(record));
      }
    }
    return _results;
  };

  Collection.prototype.removeAll = function() {
    this.ids = {};
    return this.setLength(0);
  };

  Collection.prototype.remove = function(records, options) {
    var record, _i, _len, _results;
    if (options == null) {
      options = {};
    }
    if (records.length === this.length) {
      return this.removeAll();
    }
    if (typeof records === "Array") {
      _results = [];
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        delete this.ids[record.id];
        _results.push(this.splice(record.index, 1));
      }
      return _results;
    } else {
      delete this.ids[records.id];
      return this.splice(records.index, 1);
    }
  };

  Collection.prototype.findById = function(id) {
    var record;
    record = this.ids[id];
    if (record) {
      return record;
    }
    return false;
  };

  Collection.prototype.fetch = function(records, options) {
    if (options == null) {
      options = {};
    }
    return this.storage.read(records, options);
  };

  Collection.prototype.create = function(records, options) {
    if (options == null) {
      options = {};
    }
    this.add(records, options);
    return this.storage.create(records, options);
  };

  Collection.prototype.save = function(records, options) {
    if (options == null) {
      options = {};
    }
    return this.storage.update(records, options);
  };

  Collection.prototype.destroyAll = function(options) {
    var ret;
    if (options == null) {
      options = {};
    }
    ret = this.storage["delete"](this, options);
    this.removeAll();
    return ret;
  };

  Collection.prototype.destroy = function(records, options) {
    var ret;
    if (options == null) {
      options = {};
    }
    ret = this.storage["delete"](records, options);
    this.remove(records, options);
    return ret;
  };

  Collection.prototype.toJSON = function() {
    var record, result, _i, _len;
    result = [];
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      record = this[_i];
      result.push(record.toJSON());
    }
    return result;
  };

  return Collection;

})(Theorist.Sequence);

module.exports = Collection;

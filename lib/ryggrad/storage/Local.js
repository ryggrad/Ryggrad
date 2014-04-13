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

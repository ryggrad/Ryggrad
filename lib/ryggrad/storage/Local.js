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
    localStorage[this.collection] = JSON.stringify(records.asJSON());
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      localStorage[record.id] = record.asJSON();
      _results.push(localStorage[record.cid] = record.asJSON());
    }
    return _results;
  };

  Local.prototype.all = function() {
    return JSON.parse(localStorage[this.collection]);
  };

  Local.prototype.find = function(record) {
    if (localStorage[record.id]) {
      return new this.model(JSON.parse(localStorage[record.id]));
    } else if (localStorage[record.cid]) {
      return new this.model(JSON.parse(localStorage[record.cid]));
    } else {
      return new this.model();
    }
  };

  Local.prototype.findBy = function(callback) {
    var records;
    records = JSON.parse(localStorage[this.collection]);
    return new this.model(records.filter(callback)[0]);
  };

  Local.prototype.save = function(records) {
    return this.add(records);
  };

  Local.prototype.destroy = function(records) {
    var record, _i, _len, _results;
    if (!$.isArray(records)) {
      records = [records];
    }
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      if (localStorage[record.id]) {
        delete localStorage[record.id];
      }
      if (localStorage[record.cid]) {
        _results.push(delete localStorage[record.cid]);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return Local;

})(Storage);

module.exports = Local;

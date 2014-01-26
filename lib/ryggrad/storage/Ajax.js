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
      _this.add(result);
      return _this.promise.resolve(_this.records);
    });
    return this.records;
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
      return _this.add(record);
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
      return _this.add(record);
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

var $, Ajax, Storage,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Storage = require('./Storage');

$ = jQuery;

Ajax = (function(_super) {
  __extends(Ajax, _super);

  function Ajax() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.findRequest = __bind(this.findRequest, this);
    this.allRequest = __bind(this.allRequest, this);
    this.destroy = __bind(this.destroy, this);
    this.save = __bind(this.save, this);
    this.findBy = __bind(this.findBy, this);
    this.find = __bind(this.find, this);
    this.all = __bind(this.all, this);
    this.add = __bind(this.add, this);
    Ajax.__super__.constructor.apply(this, args);
    if ('all' in this.options) {
      this.allRequest = this.options.all;
    }
    if ('find' in this.options) {
      this.findRequest = this.options.find;
    }
  }

  Ajax.prototype.add = function(records, options) {
    var isNew, record, request, type, _i, _len, _results,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (!$.isArray(records)) {
      records = [records];
    }
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      isNew = options.isNew;
      isNew || (isNew = true);
      type = isNew ? 'POST' : 'PUT';
      request = $.ajax({
        type: type,
        url: record.uri(),
        data: record.toJSON(),
        queue: true,
        warn: true
      });
      record.request = request;
      record.promise = $.Deferred();
      _results.push(request.done(function(result) {
        if (result.id && record.id !== result.id) {
          record.changeID(result.id);
        }
        record.set(result);
        return record.promise.resolve(record);
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
    request = this.findRequest.call(this.model, record, options.request);
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

  Ajax.prototype.save = function(records, options) {
    if (options == null) {
      options = {};
    }
    return this.add(records, options);
  };

  Ajax.prototype.destroy = function(records) {
    var record, request, _i, _len, _results,
      _this = this;
    if (!$.isArray(records)) {
      records = [records];
    }
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      request = $.ajax({
        type: "DELETE",
        url: record.uri(record.getID()),
        queue: true,
        warn: true
      });
      record.request = request;
      record.promise = $.Deferred();
      _results.push(request.done(function(response) {
        record.set(response);
        return record.promise.resolve(record);
      }));
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
      type: 'GET',
      queue: true,
      warn: true
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
      type: 'GET',
      queue: true,
      warn: true
    };
    return $.ajax($.extend(defaults, options));
  };

  return Ajax;

})(Storage);

module.exports = Ajax;

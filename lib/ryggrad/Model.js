var Collection, Model, Theorist, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Theorist = require("theorist");

Collection = require('./Collection');

_ = require('underscore');

_.mixin(require('underscore.inflections'));

Model = (function(_super) {
  __extends(Model, _super);

  Model.records = function() {
    if (!this.hasOwnProperty('collection')) {
      this.collection = new Collection({
        model: this
      });
    }
    return this.collection;
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
    path = value || this.pluralName();
    if (this.host) {
      return this.host + "/" + path;
    } else {
      return "/" + path;
    }
  };

  Model.pluralName = function() {
    return "" + (_.pluralize(this.name.toLowerCase()));
  };

  Model.all = function() {
    return this.records();
  };

  Model.remove = function() {
    return this.records().removeAll();
  };

  Model.findById = function(id) {
    return this.records().findById(id);
  };

  Model.findBy = function(key, val) {
    var record, _i, _len, _ref;
    record = false;
    _ref = this.records();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      record = _ref[_i];
      if (record.get(key) === val) {
        return record;
      }
    }
    return record;
  };

  Model.count = function() {
    return this.records().realCount();
  };

  Model.toJSON = function() {
    return this.records().toJSON();
  };

  Model.create = function(atts) {
    var obj;
    if (atts == null) {
      atts = {};
    }
    obj = new this(atts);
    return this.records().create(obj);
  };

  Model.fetch = function() {
    return this.records().fetch(this.records(), arguments);
  };

  Model.save = function() {
    return this.records().save(this.records(), arguments);
  };

  Model.destroy = function() {
    return this.records().destroyAll(arguments);
  };

  function Model(atts, skipAdd) {
    var invalidMSG;
    if (atts == null) {
      atts = {};
    }
    this.url = __bind(this.url, this);
    this.uri = __bind(this.uri, this);
    Model.__super__.constructor.call(this, atts);
    invalidMSG = this.isValid();
    if (invalidMSG) {
      throw new Error(invalidMSG);
    }
    if (!skipAdd) {
      this.constructor.records().add(this);
    }
  }

  Model.prototype.isValid = function() {
    if (this.validate) {
      return this.validate();
    }
  };

  Model.prototype.isModel = true;

  Model.prototype.fetch = function() {
    return this.constructor.records().fetch(this, arguments);
  };

  Model.prototype.save = function() {
    return this.constructor.records().save(this, arguments);
  };

  Model.prototype.destroy = function() {
    Model.__super__.destroy.call(this, arguments);
    return this.constructor.records().destroy(this, arguments);
  };

  Model.prototype.changeID = function(id) {
    var oldid;
    oldid = this.id;
    this.constructor.records().remove(this);
    this.set({
      id: id
    });
    return this.constructor.records().add(this);
  };

  Model.prototype.uri = function() {
    var id, parts, _ref, _ref1;
    parts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    id = this.get('id');
    if (id) {
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

  Model.prototype.toJSON = function(options) {
    var key, result;
    result = {
      id: this.get('id')
    };
    for (key in this.declaredPropertyValues || {}) {
      result[key] = this.get(key);
    }
    return result;
  };

  Model.prototype.fromJSON = function(values) {
    if (values.id && this.id !== values.id) {
      this.changeID(values.id);
    }
    return this.set(values);
  };

  return Model;

})(Theorist.Model);

module.exports = Model;

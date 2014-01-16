var Events, Module, moduleKeywords,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice;

Events = require('./Events');

moduleKeywords = ['included', 'extended'];

Module = (function(_super) {
  __extends(Module, _super);

  Module.include = function(obj) {
    var included, key, value;
    if (!obj) {
      throw new Error('include(obj) requires obj');
    }
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this.prototype[key] = value;
      }
    }
    included = obj.included;
    if (included) {
      included.apply(this);
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

})(Events);

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

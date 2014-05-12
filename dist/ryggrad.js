!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Ryggrad=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/Ryggrad.js');

},{"./lib/Ryggrad.js":2}],2:[function(require,module,exports){
var Ryggrad, jquery;

jquery = require('jquery');

require('./ryggrad/jquery/extensions')(window);

require('./ryggrad/jquery/ajax')(window);

Ryggrad = {};

Ryggrad.Base = require('./ryggrad/Base');

Ryggrad.Events = require('./ryggrad/Events');

Ryggrad.Module = require('./ryggrad/Module');

Ryggrad.Collection = require('./ryggrad/Collection');

Ryggrad.Model = require('./ryggrad/Model');

Ryggrad.View = require('space-pen').View;

Ryggrad.Controller = require('./ryggrad/Controller');

Ryggrad.Route = require('./ryggrad/Route');

Ryggrad.Router = require('./ryggrad/Router');

Ryggrad.Util = require('./ryggrad/Util');

Ryggrad.version = "0.0.5";

module.exports = Ryggrad;

},{"./ryggrad/Base":3,"./ryggrad/Collection":4,"./ryggrad/Controller":5,"./ryggrad/Events":6,"./ryggrad/Model":7,"./ryggrad/Module":8,"./ryggrad/Route":9,"./ryggrad/Router":10,"./ryggrad/Util":11,"./ryggrad/jquery/ajax":12,"./ryggrad/jquery/extensions":13,"jquery":"IfVDOB","space-pen":16}],3:[function(require,module,exports){
var Base, Events, Module, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Events = require('./Events');

Module = require('./Module');

Base = (function(_super) {
  __extends(Base, _super);

  function Base() {
    _ref = Base.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Base.include(Events);

  Base.extend(Events);

  return Base;

})(Module);

module.exports = Base;

},{"./Events":6,"./Module":8}],4:[function(require,module,exports){
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

},{"./storage/Ajax":14,"theorist":21}],5:[function(require,module,exports){
var Base, Controller, Router,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./Base');

Router = require("./Router");

Controller = (function(_super) {
  __extends(Controller, _super);

  Controller.prototype.eventSplitter = /^(\S+)\s*(.*)$/;

  Controller.prototype.tag = 'div';

  function Controller(options) {
    this.release = __bind(this.release, this);
    this.destroy = __bind(this.destroy, this);
    var key, value, _ref;
    this.router = new Router();
    this.options = options;
    _ref = this.options;
    for (key in _ref) {
      value = _ref[key];
      this[key] = value;
    }
    if (!this.el) {
      this.el = document.createElement(this.tag);
    }
    this.el = $(this.el);
    this.$el = this.el;
    if (this.className) {
      this.el.addClass(this.className);
    }
    if (this.attributes) {
      this.el.attr(this.attributes);
    }
    if (!this.events) {
      this.events = this.constructor.events;
    }
    if (!this.elements) {
      this.elements = this.constructor.elements;
    }
    if (this.events) {
      this.delegateEvents();
    }
    if (this.elements) {
      this.refreshElements();
    }
    Controller.__super__.constructor.apply(this, arguments);
  }

  Controller.prototype.route = function(path, callback) {
    return this.router.add(path, this.proxy(callback));
  };

  Controller.prototype.routes = function(routes) {
    var key, value, _results;
    _results = [];
    for (key in routes) {
      value = routes[key];
      _results.push(this.route(key, value));
    }
    return _results;
  };

  Controller.prototype.url = function() {
    return this.router.navigate.apply(router, args);
  };

  Controller.prototype.delegateEvents = function() {
    var eventName, key, match, method, selector, _ref, _results;
    _ref = this.events;
    _results = [];
    for (key in _ref) {
      method = _ref[key];
      if (typeof method !== 'function') {
        method = this.proxy(this[method]);
      }
      match = key.match(this.eventSplitter);
      eventName = match[1];
      selector = match[2];
      if (selector === '') {
        _results.push(this.el.bind(eventName, method));
      } else {
        _results.push(this.el.delegate(selector, eventName, method));
      }
    }
    return _results;
  };

  Controller.prototype.refreshElements = function() {
    var key, value, _ref, _results;
    _ref = this.elements;
    _results = [];
    for (key in _ref) {
      value = _ref[key];
      _results.push(this[value] = this.el.find(key));
    }
    return _results;
  };

  Controller.prototype.destroy = function() {
    this.trigger('release');
    this.el.addClass('garry');
    this.unbind();
    return this.el.remove();
  };

  Controller.prototype.$ = function(selector) {
    return $(selector, this.el);
  };

  Controller.prototype.release = function() {};

  return Controller;

})(Base);

module.exports = Controller;

},{"./Base":3,"./Router":10}],6:[function(require,module,exports){
var Events,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice;

Events = {
  bind: function(event, callback) {
    return this.on(event, callback);
  },
  unbind: function(event, callback) {
    return this.off(event, callback);
  },
  on: function(event, callback) {
    var calls, events, name, _i, _len;
    if (typeof event !== 'string') {
      throw new Error('event required');
    }
    if (typeof callback !== 'function') {
      throw new Error('callback required');
    }
    events = event.split(' ');
    calls = this.hasOwnProperty('events') && this.events || (this.events = {});
    for (_i = 0, _len = events.length; _i < _len; _i++) {
      name = events[_i];
      calls[name] || (calls[name] = []);
      calls[name].push(callback);
    }
    return this;
  },
  isOn: function(event, callback) {
    var list, _ref;
    list = this.hasOwnProperty('events') && ((_ref = this.events) != null ? _ref[event] : void 0);
    return list && __indexOf.call(list, callback) >= 0;
  },
  one: function(event, callback) {
    var callee;
    if (typeof callback !== 'function') {
      throw new Error('callback required');
    }
    callee = function() {
      this.off(event, callee);
      return callback.apply(this, arguments);
    };
    return this.on(event, callee);
  },
  trigger: function() {
    var args, callback, event, iargs, list, _i, _len, _ref, _ref1;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    event = args.shift();
    list = this.hasOwnProperty('events') && ((_ref = this.events) != null ? _ref[event] : void 0);
    if (!list) {
      return;
    }
    iargs = args.concat([this]);
    _ref1 = list || [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      callback = _ref1[_i];
      if (callback.apply(this, iargs) === false) {
        break;
      }
    }
    if (event !== 'all') {
      this.trigger('all', event, args);
    }
    return true;
  },
  off: function(event, callback) {
    var cb, i, list, _i, _len, _ref;
    if (!event) {
      this.events = {};
      return this;
    }
    list = (_ref = this.events) != null ? _ref[event] : void 0;
    if (!list) {
      return this;
    }
    if (!callback) {
      delete this.events[event];
      return this;
    }
    for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
      cb = list[i];
      if (!(cb === callback)) {
        continue;
      }
      list = list.slice();
      list.splice(i, 1);
      this.events[event] = list;
      break;
    }
    return this;
  }
};

module.exports = Events;

},{}],7:[function(require,module,exports){
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

},{"./Collection":4,"theorist":21,"underscore":"pRZqWN","underscore.inflections":37}],8:[function(require,module,exports){
var Module, moduleKeywords,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

moduleKeywords = ['included', 'extended'];

Module = (function() {
  Module.include = function(obj) {
    var key, value, _ref;
    if (!obj) {
      throw new Error('include(obj) requires obj');
    }
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this.prototype[key] = value;
      }
    }
    if ((_ref = obj.included) != null) {
      _ref.apply(this);
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

})();

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

},{}],9:[function(require,module,exports){
var Route, escapeRegExp, namedParam, splatParam;

namedParam = /:([\w\d]+)/g;

splatParam = /\*([\w\d]+)/g;

escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

Route = (function() {
  function Route(path, callback) {
    var match;
    this.path = path;
    this.callback = callback;
    this.names = [];
    if (typeof path === 'string') {
      namedParam.lastIndex = 0;
      while ((match = namedParam.exec(path)) !== null) {
        this.names.push(match[1]);
      }
      splatParam.lastIndex = 0;
      while ((match = splatParam.exec(path)) !== null) {
        this.names.push(match[1]);
      }
      path = path.replace(escapeRegExp, '\\$&').replace(namedParam, '([^\/]*)').replace(splatParam, '(.*?)');
      this.route = new RegExp('^' + path + '$');
    } else {
      this.route = path;
    }
  }

  Route.prototype.match = function(path) {
    var i, match, param, params, _i, _len, _ref;
    match = this.route.exec(path);
    if (!match) {
      return false;
    }
    params = {
      match: match
    };
    if (this.names.length) {
      _ref = match.slice(1);
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        param = _ref[i];
        params[this.names[i]] = param;
      }
    }
    return this.callback.call(null, params) !== false;
  };

  return Route;

})();

module.exports = Route;

},{}],10:[function(require,module,exports){
var Base, Controller, Module, Route, Router,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controller = require('./Controller');

Module = require('./Module');

Route = require('./Route');

Base = require('./Base');

Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    this.matchRoute = __bind(this.matchRoute, this);
    this.change = __bind(this.change, this);
    this.locationPath = __bind(this.locationPath, this);
    this.getPath = __bind(this.getPath, this);
    this.navigate = __bind(this.navigate, this);
    this.path = '';
    this.routes = [];
    $(window).on('popstate', this.change);
  }

  Router.prototype.add = function(path, callback) {
    var key, value;
    if (typeof path === 'object' && !(path instanceof RegExp)) {
      for (key in path) {
        value = path[key];
        return this.add(key, value);
      }
    }
    return this.routes.push(new Route(path, callback));
  };

  Router.prototype.navigate = function(path) {
    this.path = path;
    if (this.locationPath() === this.path) {
      return;
    }
    return typeof history !== "undefined" && history !== null ? typeof history.pushState === "function" ? history.pushState({}, document.title, this.path) : void 0 : void 0;
  };

  Router.prototype.getPath = function() {
    return this.path;
  };

  Router.prototype.locationPath = function() {
    var path;
    path = window.location.pathname;
    if (path.substr(0, 1) !== '/') {
      path = '/' + path;
    }
    return path;
  };

  Router.prototype.change = function() {
    var path;
    path = this.locationPath();
    if (path === this.path) {
      return;
    }
    this.path = path;
    return this.matchRoute(this.path);
  };

  Router.prototype.matchRoute = function(path, options) {
    var route, _i, _len, _ref;
    _ref = this.routes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      route = _ref[_i];
      if (route.match(path, options)) {
        return route;
      }
    }
  };

  return Router;

})(Base);

module.exports = Router;

},{"./Base":3,"./Controller":5,"./Module":8,"./Route":9}],11:[function(require,module,exports){
var Util;

Util = {
  getInputValue: function(el) {
    var o, _i, _len, _results;
    if (window.jQuery != null) {
      switch (el[0].type) {
        case 'checkbox':
          return el.is(':checked');
        default:
          return el.val();
      }
    } else {
      switch (el.type) {
        case 'checkbox':
          return el.checked;
        case 'select-multiple':
          _results = [];
          for (_i = 0, _len = el.length; _i < _len; _i++) {
            o = el[_i];
            if (o.selected) {
              _results.push(o.value);
            }
          }
          return _results;
          break;
        default:
          return el.value;
      }
    }
  },
  isArray: function(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  },
  isBlank: function(value) {
    var key;
    if (!value) {
      return true;
    }
    for (key in value) {
      return false;
    }
    return true;
  },
  makeArray: function(args) {
    return Array.prototype.slice.call(args, 0);
  },
  singularize: function(str) {
    return str.replace(/s$/, '');
  },
  underscore: function(str) {
    return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
  }
};

if (typeof Object.create !== 'function') {
  Object.create = function(o) {
    var Func;
    Func = function() {};
    Func.prototype = o;
    return new Func();
  };
}

module.exports = Util;

},{}],12:[function(require,module,exports){
module.exports = function(window) {
  var $, next, push, queue, queues, remove, running;
  $ = window.jQuery;
  queues = {};
  running = false;
  queue = function(name) {
    if (name === true) {
      name = 'default';
    }
    return queues[name] || (queues[name] = []);
  };
  next = function(name) {
    var deferred, list, options, _ref;
    list = queue(name);
    if (!list.length) {
      running = false;
      return;
    }
    _ref = list.shift(), options = _ref[0], deferred = _ref[1];
    return $.ajax(options).always(function() {
      return next(name);
    }).done(function() {
      return deferred.resolve.apply(deferred, arguments);
    }).fail(function() {
      return deferred.reject.apply(deferred, arguments);
    });
  };
  push = function(name, options) {
    var deferred, list;
    list = queue(name);
    deferred = $.Deferred();
    list.push([options, deferred]);
    if (!running) {
      next(name);
    }
    running = true;
    return deferred.promise();
  };
  remove = function(name, options) {
    var i, list, value, _, _i, _len, _ref, _results;
    list = queue(name);
    _results = [];
    for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
      _ref = list[i], value = _ref[0], _ = _ref[1];
      if (!(value === options)) {
        continue;
      }
      list.splice(i, 1);
      break;
    }
    return _results;
  };
  return $.ajaxTransport('+*', function(options) {
    var queuedOptions;
    if (options.queue) {
      queuedOptions = $.extend({}, options);
      queuedOptions.queue = false;
      queuedOptions.processData = false;
      return {
        send: function(headers, complete) {
          return push(options.queue, queuedOptions).done(function(data, textStatus, jqXHR) {
            return complete(jqXHR.status, jqXHR.statusText, {
              text: jqXHR.responseText
            }, jqXHR.getAllResponseHeaders());
          }).fail(function(jqXHR, textStatus, errorThrown) {
            return complete(jqXHR.status, jqXHR.statusText, {
              text: jqXHR.responseText
            }, jqXHR.getAllResponseHeaders());
          });
        },
        abort: function() {
          return remove(options.queue, queuedOptions);
        }
      };
    }
  });
};

},{}],13:[function(require,module,exports){
module.exports = function(window) {
  var jQuery;
  jQuery = require('jquery')(window);
  jQuery.event.special.removed = {
    remove: function(e) {
      return typeof e.handler === "function" ? e.handler() : void 0;
    }
  };
  $.fn.extend({
    hasEvent: function(A, F, E) {
      var L, S, T, V, e;
      L = 0;
      T = typeof A;
      V = false;
      E = (E ? E : this);
      A = (T === "string" ? $.trim(A) : A);
      if (T === "function") {
        F = A;
        A = null;
      }
      if (F === E) {
        F = null;
      }
      S = E.data("events");
      for (e in S) {
        if (S.hasOwnProperty(e)) {
          L++;
        }
      }
      if (L < 1) {
        return V = false;
      }
      if (A && !F) {
        return V = S.hasOwnProperty(A);
      } else if (A && S.hasOwnProperty(A) && F) {
        $.each(S[A], function(i, r) {
          if (V === false && r.handler === F) {
            return V = true;
          }
        });
        return V;
      } else if (!A && F) {
        $.each(S, function(i, s) {
          if (V === false) {
            return $.each(s, function(k, r) {
              if (V === false && r.handler === F) {
                return V = true;
              }
            });
          }
        });
      }
      return V;
    }
  });
  return $.extend($.fn.hasEvent);
};

},{"jquery":"IfVDOB"}],14:[function(require,module,exports){
var Ajax;

Ajax = (function() {
  function Ajax() {}

  Ajax.prototype.create = function(modelOrModels, options) {
    var url,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (modelOrModels.isModel) {
      url = modelOrModels.constructor.url();
    }
    url || (url = modelOrModels.url());
    return this.request("POST", url, modelOrModels, options.ajax).done(function(resp) {
      return modelOrModels.fromJSON(resp);
    });
  };

  Ajax.prototype.read = function(modelOrModels, options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    return this.request("GET", modelOrModels.url(), modelOrModels, options.ajax).done(function(resp) {
      return modelOrModels.fromJSON(resp);
    });
  };

  Ajax.prototype.update = function(modelOrModels, options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    return this.request("PUT", modelOrModels.url(), modelOrModels, options.ajax).done(function(resp) {
      return modelOrModels.fromJSON(resp);
    });
  };

  Ajax.prototype["delete"] = function(modelOrModels, options) {
    if (options == null) {
      options = {};
    }
    return this.request("DELETE", modelOrModels.url(), modelOrModels, options.ajax);
  };

  Ajax.prototype.request = function(method, url, data, options) {
    var defaults;
    if (options == null) {
      options = {};
    }
    defaults = {
      type: method,
      url: url,
      queue: true,
      warn: true,
      dataType: "json"
    };
    if ($.inArray(method, ["POST", "PUT"]) > -1) {
      defaults['data'] = data.toJSON();
    }
    return $.ajax($.extend(defaults, options));
  };

  return Ajax;

})();

module.exports = Ajax;

},{}],15:[function(require,module,exports){
(function() {
  var $, _,
    __slice = [].slice;

  if (window) {
    $ = window.$, _ = window._;
  } else if (typeof require === 'function') {
    $ = require('jquery');
    _ = require('underscore-plus');
  } else {
    throw new Error("Space Pen Couldn't Load jQuery");
  }

  $.fn.scrollBottom = function(newValue) {
    if (newValue != null) {
      return this.scrollTop(newValue - this.height());
    } else {
      return this.scrollTop() + this.height();
    }
  };

  $.fn.scrollDown = function() {
    return this.scrollTop(this.scrollTop() + $(window).height() / 20);
  };

  $.fn.scrollUp = function() {
    return this.scrollTop(this.scrollTop() - $(window).height() / 20);
  };

  $.fn.scrollToTop = function() {
    return this.scrollTop(0);
  };

  $.fn.scrollToBottom = function() {
    return this.scrollTop(this.prop('scrollHeight'));
  };

  $.fn.scrollRight = function(newValue) {
    if (newValue != null) {
      return this.scrollLeft(newValue - this.width());
    } else {
      return this.scrollLeft() + this.width();
    }
  };

  $.fn.pageUp = function() {
    return this.scrollTop(this.scrollTop() - this.height());
  };

  $.fn.pageDown = function() {
    return this.scrollTop(this.scrollTop() + this.height());
  };

  $.fn.isOnDom = function() {
    return this.closest(document.body).length === 1;
  };

  $.fn.isVisible = function() {
    return !this.isHidden();
  };

  $.fn.isHidden = function() {
    var style;
    style = this[0].style;
    if (style.display === 'none' || !this.isOnDom()) {
      return true;
    } else if (style.display) {
      return false;
    } else {
      return getComputedStyle(this[0]).display === 'none';
    }
  };

  $.fn.isDisabled = function() {
    return !!this.attr('disabled');
  };

  $.fn.enable = function() {
    return this.removeAttr('disabled');
  };

  $.fn.disable = function() {
    return this.attr('disabled', 'disabled');
  };

  $.fn.insertAt = function(index, element) {
    var target;
    target = this.children(":eq(" + index + ")");
    if (target.length) {
      return $(element).insertBefore(target);
    } else {
      return this.append(element);
    }
  };

  $.fn.removeAt = function(index) {
    return this.children(":eq(" + index + ")").remove();
  };

  $.fn.indexOf = function(child) {
    return this.children().toArray().indexOf($(child)[0]);
  };

  $.fn.containsElement = function(element) {
    return (element[0].compareDocumentPosition(this[0]) & 8) === 8;
  };

  $.fn.preempt = function(eventName, handler) {
    var eventNameWithoutNamespace, handlers, _ref;
    this.on(eventName, function() {
      var args, e;
      e = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (handler.apply(null, [e].concat(__slice.call(args))) === false) {
        return e.stopImmediatePropagation();
      }
    });
    eventNameWithoutNamespace = eventName.split('.')[0];
    handlers = (_ref = this.handlers()[eventNameWithoutNamespace]) != null ? _ref : [];
    return handlers.unshift(handlers.pop());
  };

  $.fn.handlers = function(eventName) {
    var handlers, _ref, _ref1;
    handlers = this.length ? (_ref = $._data(this[0], 'events')) != null ? _ref : {} : {};
    if (arguments.length === 1) {
      handlers = (_ref1 = handlers[eventName]) != null ? _ref1 : [];
    }
    return handlers;
  };

  $.fn.hasParent = function() {
    return this.parent()[0] != null;
  };

  $.fn.flashError = function() {
    var removeErrorClass,
      _this = this;
    this.addClass('error');
    removeErrorClass = function() {
      return _this.removeClass('error');
    };
    return window.setTimeout(removeErrorClass, 300);
  };

  $.fn.trueHeight = function() {
    return this[0].getBoundingClientRect().height;
  };

  $.fn.trueWidth = function() {
    return this[0].getBoundingClientRect().width;
  };

  $.fn.document = function(eventName, docString) {
    var eventDescriptions;
    eventDescriptions = {};
    eventDescriptions[eventName] = docString;
    if (!this.data('documentation')) {
      this.data('documentation', {});
    }
    return _.extend(this.data('documentation'), eventDescriptions);
  };

  $.fn.events = function() {
    var documentation, eventName, events, _ref, _ref1;
    documentation = (_ref = this.data('documentation')) != null ? _ref : {};
    events = {};
    for (eventName in this.handlers()) {
      events[eventName] = (_ref1 = documentation[eventName]) != null ? _ref1 : null;
    }
    if (this.hasParent()) {
      return _.extend(this.parent().events(), events);
    } else {
      return events;
    }
  };

  $.fn.command = function(eventName, selector, options, handler) {
    if (options == null) {
      handler = selector;
      selector = null;
    } else if (handler == null) {
      handler = options;
      options = null;
    }
    if ((selector != null) && typeof selector === 'object') {
      options = selector;
      selector = null;
    }
    this.document(eventName, _.humanizeEventName(eventName, options != null ? options['doc'] : void 0));
    return this.on(eventName, selector, options != null ? options['data'] : void 0, handler);
  };

  $.fn.iconSize = function(size) {
    return this.width(size).height(size).css('font-size', size);
  };

  $.fn.intValue = function() {
    return parseInt(this.text());
  };

  $.Event.prototype.abortKeyBinding = function() {};

  $.Event.prototype.currentTargetView = function() {
    return $(this.currentTarget).view();
  };

  $.Event.prototype.targetView = function() {
    return $(this.target).view();
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = $;
  } else {
    this.$ = $;
  }

}).call(this);

},{"jquery":"IfVDOB","underscore-plus":17}],16:[function(require,module,exports){
(function() {
  var $, Builder, Events, SelfClosingTags, Tags, View, callAttachHook, exports, idCounter, jQuery, methodName, originalCleanData, _fn, _fn1, _i, _j, _len, _len1, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  if (typeof require === 'function') {
    $ = jQuery = require('./jquery-extensions');
  } else {
    $ = jQuery = window.jQuery;
  }

  Tags = 'a abbr address article aside audio b bdi bdo blockquote body button\
   canvas caption cite code colgroup datalist dd del details dfn div dl dt em\
   fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup\
   html i iframe ins kbd label legend li map mark menu meter nav noscript object\
   ol optgroup option output p pre progress q rp rt ruby s samp script section\
   select small span strong style sub summary sup table tbody td textarea tfoot\
   th thead time title tr u ul video area base br col command embed hr img input\
   keygen link meta param source track wbrk'.split(/\s+/);

  SelfClosingTags = {};

  'area base br col command embed hr img input keygen link meta param\
 source track wbr'.split(/\s+/).forEach(function(tag) {
    return SelfClosingTags[tag] = true;
  });

  Events = 'blur change click dblclick error focus input keydown\
   keypress keyup load mousedown mousemove mouseout mouseover\
   mouseup resize scroll select submit unload'.split(/\s+/);

  idCounter = 0;

  View = (function(_super) {
    __extends(View, _super);

    View.builderStack = null;

    Tags.forEach(function(tagName) {
      return View[tagName] = function() {
        var args, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return (_ref = this.currentBuilder).tag.apply(_ref, [tagName].concat(__slice.call(args)));
      };
    });

    View.subview = function(name, view) {
      return this.currentBuilder.subview(name, view);
    };

    View.text = function(string) {
      return this.currentBuilder.text(string);
    };

    View.tag = function() {
      var args, tagName, _ref;
      tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref = this.currentBuilder).tag.apply(_ref, [tagName].concat(__slice.call(args)));
    };

    View.raw = function(string) {
      return this.currentBuilder.raw(string);
    };

    View.pushBuilder = function() {
      var builder;
      builder = new Builder;
      if (this.builderStack == null) {
        this.builderStack = [];
      }
      this.builderStack.push(builder);
      return this.currentBuilder = builder;
    };

    View.popBuilder = function() {
      this.currentBuilder = this.builderStack[this.builderStack.length - 2];
      return this.builderStack.pop();
    };

    View.buildHtml = function(fn) {
      var html, postProcessingSteps, _ref;
      this.pushBuilder();
      fn.call(this);
      return _ref = this.popBuilder().buildHtml(), html = _ref[0], postProcessingSteps = _ref[1], _ref;
    };

    View.render = function(fn) {
      var div, fragment, html, postProcessingSteps, step, _i, _len, _ref;
      _ref = this.buildHtml(fn), html = _ref[0], postProcessingSteps = _ref[1];
      div = document.createElement('div');
      div.innerHTML = html;
      fragment = $(div.childNodes);
      for (_i = 0, _len = postProcessingSteps.length; _i < _len; _i++) {
        step = postProcessingSteps[_i];
        step(fragment);
      }
      return fragment;
    };

    function View() {
      var args, element, html, postProcessingSteps, step, _i, _j, _len, _len1, _ref, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = this.constructor.buildHtml(function() {
        return this.content.apply(this, args);
      }), html = _ref[0], postProcessingSteps = _ref[1];
      jQuery.fn.init.call(this, html);
      if (this.length !== 1) {
        throw new Error("View markup must have a single root element");
      }
      this.wireOutlets(this);
      this.bindEventHandlers(this);
      jQuery.data(this[0], 'view', this);
      _ref1 = this[0].getElementsByTagName('*');
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        element = _ref1[_i];
        jQuery.data(element, 'view', this);
      }
      this[0].setAttribute('callAttachHooks', true);
      for (_j = 0, _len1 = postProcessingSteps.length; _j < _len1; _j++) {
        step = postProcessingSteps[_j];
        step(this);
      }
      if (typeof this.initialize === "function") {
        this.initialize.apply(this, args);
      }
    }

    View.prototype.buildHtml = function(params) {
      var html, postProcessingSteps, _ref;
      this.constructor.builder = new Builder;
      this.constructor.content(params);
      _ref = this.constructor.builder.buildHtml(), html = _ref[0], postProcessingSteps = _ref[1];
      this.constructor.builder = null;
      return postProcessingSteps;
    };

    View.prototype.wireOutlets = function(view) {
      var element, outlet, _i, _len, _ref;
      _ref = view[0].querySelectorAll('[outlet]');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        outlet = element.getAttribute('outlet');
        view[outlet] = $(element);
        element.removeAttribute('outlet');
      }
      return void 0;
    };

    View.prototype.bindEventHandlers = function(view) {
      var element, eventName, methodName, selector, _fn, _i, _j, _len, _len1, _ref;
      for (_i = 0, _len = Events.length; _i < _len; _i++) {
        eventName = Events[_i];
        selector = "[" + eventName + "]";
        _ref = view[0].querySelectorAll(selector);
        _fn = function(element) {
          var methodName;
          methodName = element.getAttribute(eventName);
          element = $(element);
          return element.on(eventName, function(event) {
            return view[methodName](event, element);
          });
        };
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          element = _ref[_j];
          _fn(element);
        }
        if (view.is(selector)) {
          methodName = view[0].getAttribute(eventName);
          (function(methodName) {
            return view.on(eventName, function(event) {
              return view[methodName](event, view);
            });
          })(methodName);
        }
      }
      return void 0;
    };

    View.prototype.pushStack = function(elems) {
      var ret;
      ret = jQuery.merge(jQuery(), elems);
      ret.prevObject = this;
      ret.context = this.context;
      return ret;
    };

    View.prototype.end = function() {
      var _ref;
      return (_ref = this.prevObject) != null ? _ref : jQuery(null);
    };

    return View;

  })(jQuery);

  Builder = (function() {
    function Builder() {
      this.document = [];
      this.postProcessingSteps = [];
    }

    Builder.prototype.buildHtml = function() {
      return [this.document.join(''), this.postProcessingSteps];
    };

    Builder.prototype.tag = function() {
      var args, name, options;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      options = this.extractOptions(args);
      this.openTag(name, options.attributes);
      if (SelfClosingTags.hasOwnProperty(name)) {
        if ((options.text != null) || (options.content != null)) {
          throw new Error("Self-closing tag " + name + " cannot have text or content");
        }
      } else {
        if (typeof options.content === "function") {
          options.content();
        }
        if (options.text) {
          this.text(options.text);
        }
        return this.closeTag(name);
      }
    };

    Builder.prototype.openTag = function(name, attributes) {
      var attributeName, attributePairs, attributesString, value;
      attributePairs = (function() {
        var _results;
        _results = [];
        for (attributeName in attributes) {
          value = attributes[attributeName];
          _results.push("" + attributeName + "=\"" + value + "\"");
        }
        return _results;
      })();
      attributesString = attributePairs.length ? " " + attributePairs.join(" ") : "";
      return this.document.push("<" + name + attributesString + ">");
    };

    Builder.prototype.closeTag = function(name) {
      return this.document.push("</" + name + ">");
    };

    Builder.prototype.text = function(string) {
      var escapedString;
      escapedString = string.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return this.document.push(escapedString);
    };

    Builder.prototype.raw = function(string) {
      return this.document.push(string);
    };

    Builder.prototype.subview = function(outletName, subview) {
      var subviewId;
      subviewId = "subview-" + (++idCounter);
      this.tag('div', {
        id: subviewId
      });
      return this.postProcessingSteps.push(function(view) {
        view[outletName] = subview;
        subview.parentView = view;
        return view.find("div#" + subviewId).replaceWith(subview);
      });
    };

    Builder.prototype.extractOptions = function(args) {
      var arg, options, _i, _len;
      options = {};
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        switch (typeof arg) {
          case 'function':
            options.content = arg;
            break;
          case 'string':
          case 'number':
            options.text = arg.toString();
            break;
          default:
            options.attributes = arg;
        }
      }
      return options;
    };

    return Builder;

  })();

  jQuery.fn.view = function() {
    return this.data('view');
  };

  jQuery.fn.views = function() {
    return this.toArray().map(function(elt) {
      return $(elt).view();
    });
  };

  callAttachHook = function(element) {
    var child, elementsWithHooks, onDom, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (!(element instanceof jQuery && element[0])) {
      return;
    }
    onDom = (typeof element.parents === "function" ? element.parents('html').length : void 0) > 0;
    elementsWithHooks = [];
    if (element[0].getAttribute('callAttachHooks')) {
      elementsWithHooks.push(element[0]);
    }
    if (onDom) {
      _ref = element[0].querySelectorAll('[callAttachHooks]');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        elementsWithHooks.push(child);
      }
    }
    _results = [];
    for (_j = 0, _len1 = elementsWithHooks.length; _j < _len1; _j++) {
      element = elementsWithHooks[_j];
      _results.push((_ref1 = $(element).view()) != null ? typeof _ref1.afterAttach === "function" ? _ref1.afterAttach(onDom) : void 0 : void 0);
    }
    return _results;
  };

  _ref = ['append', 'prepend', 'after', 'before'];
  _fn = function(methodName) {
    var originalMethod;
    originalMethod = $.fn[methodName];
    return jQuery.fn[methodName] = function() {
      var arg, args, flatArgs, result, _j, _len1, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      flatArgs = (_ref1 = []).concat.apply(_ref1, args);
      result = originalMethod.apply(this, flatArgs);
      for (_j = 0, _len1 = flatArgs.length; _j < _len1; _j++) {
        arg = flatArgs[_j];
        callAttachHook(arg);
      }
      return result;
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    methodName = _ref[_i];
    _fn(methodName);
  }

  _ref1 = ['prependTo', 'appendTo', 'insertAfter', 'insertBefore'];
  _fn1 = function(methodName) {
    var originalMethod;
    originalMethod = jQuery.fn[methodName];
    return jQuery.fn[methodName] = function() {
      var args, result;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      result = originalMethod.apply(this, args);
      callAttachHook(this);
      return result;
    };
  };
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    methodName = _ref1[_j];
    _fn1(methodName);
  }

  originalCleanData = jQuery.cleanData;

  jQuery.cleanData = function(elements) {
    var element, view, _k, _len2;
    for (_k = 0, _len2 = elements.length; _k < _len2; _k++) {
      element = elements[_k];
      view = $(element).view();
      if (view && (view != null ? view[0] : void 0) === element) {
        if (typeof view.beforeRemove === "function") {
          view.beforeRemove();
        }
      }
    }
    return originalCleanData(elements);
  };

  exports = exports != null ? exports : this;

  exports.View = View;

  exports.jQuery = jQuery;

  exports.$ = $;

  exports.$$ = function(fn) {
    return View.render.call(View, fn);
  };

  exports.$$$ = function(fn) {
    return View.buildHtml.call(View, fn)[0];
  };

}).call(this);

},{"./jquery-extensions":15}],17:[function(require,module,exports){
(function() {
  var isEqual, modifierKeyMap, plus, _,
    __slice = [].slice;

  _ = require('underscore');

  isEqual = require('tantamount');

  modifierKeyMap = {
    cmd: '\u2318',
    ctrl: '\u2303',
    alt: '\u2325',
    option: '\u2325',
    shift: '\u21e7',
    enter: '\u23ce',
    left: '\u2190',
    right: '\u2192',
    up: '\u2191',
    down: '\u2193'
  };

  plus = {
    adviseBefore: function(object, methodName, advice) {
      var original;
      original = object[methodName];
      return object[methodName] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (advice.apply(this, args) !== false) {
          return original.apply(this, args);
        }
      };
    },
    camelize: function(string) {
      return string.replace(/[_-]+(\w)/g, function(m) {
        return m[1].toUpperCase();
      });
    },
    capitalize: function(word) {
      if (word.toLowerCase() === 'github') {
        return 'GitHub';
      } else {
        return word[0].toUpperCase() + word.slice(1);
      }
    },
    compactObject: function(object) {
      var key, newObject, value;
      newObject = {};
      for (key in object) {
        value = object[key];
        if (value != null) {
          newObject[key] = value;
        }
      }
      return newObject;
    },
    dasherize: function(string) {
      string = string[0].toLowerCase() + string.slice(1);
      return string.replace(/([A-Z])|(_)/g, function(m, letter, underscore) {
        if (letter) {
          return "-" + letter.toLowerCase();
        } else {
          return "-";
        }
      });
    },
    deepClone: function(object) {
      var _this = this;
      if (_.isArray(object)) {
        return object.map(function(value) {
          return plus.deepClone(value);
        });
      } else if (_.isObject(object)) {
        return plus.mapObject(object, function(key, value) {
          return [key, plus.deepClone(value)];
        });
      } else {
        return object;
      }
    },
    deepExtend: function() {
      var key, object, objects, result, value, _i, _len;
      objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      result = {};
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (key in object) {
          value = object[key];
          if (_.isObject(value) && !_.isArray(value)) {
            result[key] = plus.deepExtend(result[key], value);
          } else {
            if (result[key] == null) {
              result[key] = value;
            }
          }
        }
      }
      return result;
    },
    endsWith: function(string, suffix) {
      return string.indexOf(suffix, string.length - suffix.length) !== -1;
    },
    escapeAttribute: function(string) {
      return string.replace(/"/g, '&quot;').replace(/\n/g, '').replace(/\\/g, '-');
    },
    escapeRegExp: function(string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    humanizeEventName: function(eventName, eventDoc) {
      var event, namespace, namespaceDoc, _ref;
      _ref = eventName.split(':'), namespace = _ref[0], event = _ref[1];
      if (event == null) {
        return plus.undasherize(namespace);
      }
      namespaceDoc = plus.undasherize(namespace);
      if (eventDoc == null) {
        eventDoc = plus.undasherize(event);
      }
      return "" + namespaceDoc + ": " + eventDoc;
    },
    humanizeKey: function(key) {
      if (!key) {
        return key;
      }
      if (modifierKeyMap[key]) {
        return modifierKeyMap[key];
      } else if (key.length === 1 && key === key.toUpperCase() && key.toUpperCase() !== key.toLowerCase()) {
        return [modifierKeyMap.shift, key.toUpperCase()];
      } else if (key.length === 1 || /f[0-9]{1,2}/.test(key)) {
        return key.toUpperCase();
      } else {
        return key;
      }
    },
    humanizeKeystroke: function(keystroke) {
      var humanizedKeystrokes, key, keys, keystrokes, _i, _len;
      if (!keystroke) {
        return keystroke;
      }
      keystrokes = keystroke.split(' ');
      humanizedKeystrokes = [];
      for (_i = 0, _len = keystrokes.length; _i < _len; _i++) {
        keystroke = keystrokes[_i];
        keys = keystroke.split('-');
        keys = _.flatten((function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
            key = keys[_j];
            _results.push(plus.humanizeKey(key));
          }
          return _results;
        })());
        humanizedKeystrokes.push(keys.join(''));
      }
      return humanizedKeystrokes.join(' ');
    },
    isSubset: function(potentialSubset, potentialSuperset) {
      return _.every(potentialSubset, function(element) {
        return _.include(potentialSuperset, element);
      });
    },
    losslessInvert: function(hash) {
      var inverted, key, value;
      inverted = {};
      for (key in hash) {
        value = hash[key];
        if (inverted[value] == null) {
          inverted[value] = [];
        }
        inverted[value].push(key);
      }
      return inverted;
    },
    mapObject: function(object, iterator) {
      var key, newObject, value, _ref;
      newObject = {};
      for (key in object) {
        value = object[key];
        _ref = iterator(key, value), key = _ref[0], value = _ref[1];
        newObject[key] = value;
      }
      return newObject;
    },
    multiplyString: function(string, n) {
      return new Array(1 + n).join(string);
    },
    pluralize: function(count, singular, plural) {
      if (count == null) {
        count = 0;
      }
      if (plural == null) {
        plural = singular + 's';
      }
      if (count === 1) {
        return "" + count + " " + singular;
      } else {
        return "" + count + " " + plural;
      }
    },
    remove: function(array, element) {
      var index;
      index = array.indexOf(element);
      if (index >= 0) {
        array.splice(index, 1);
      }
      return array;
    },
    setValueForKeyPath: function(object, keyPath, value) {
      var key, keys;
      keys = keyPath.split('.');
      while (keys.length > 1) {
        key = keys.shift();
        if (object[key] == null) {
          object[key] = {};
        }
        object = object[key];
      }
      if (value != null) {
        return object[keys.shift()] = value;
      } else {
        return delete object[keys.shift()];
      }
    },
    spliceWithArray: function(originalArray, start, length, insertedArray, chunkSize) {
      var chunkStart, _i, _ref, _results;
      if (chunkSize == null) {
        chunkSize = 100000;
      }
      if (insertedArray.length < chunkSize) {
        return originalArray.splice.apply(originalArray, [start, length].concat(__slice.call(insertedArray)));
      } else {
        originalArray.splice(start, length);
        _results = [];
        for (chunkStart = _i = 0, _ref = insertedArray.length; chunkSize > 0 ? _i <= _ref : _i >= _ref; chunkStart = _i += chunkSize) {
          _results.push(originalArray.splice.apply(originalArray, [start + chunkStart, 0].concat(__slice.call(insertedArray.slice(chunkStart, chunkStart + chunkSize)))));
        }
        return _results;
      }
    },
    sum: function(array) {
      var elt, sum, _i, _len;
      sum = 0;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        elt = array[_i];
        sum += elt;
      }
      return sum;
    },
    uncamelcase: function(string) {
      var result;
      result = string.replace(/([A-Z])|(_)/g, function(m, letter, underscore) {
        return " " + letter;
      });
      return plus.capitalize(result);
    },
    undasherize: function(string) {
      return string.split('-').map(plus.capitalize).join(' ');
    },
    underscore: function(string) {
      string = string[0].toLowerCase() + string.slice(1);
      return string.replace(/([A-Z])|(-)/g, function(m, letter, dash) {
        if (letter) {
          return "_" + letter.toLowerCase();
        } else {
          return "_";
        }
      });
    },
    valueForKeyPath: function(object, keyPath) {
      var key, keys, _i, _len;
      keys = keyPath.split('.');
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        object = object[key];
        if (object == null) {
          return;
        }
      }
      return object;
    }
  };

  module.exports = _.extend({}, _, plus, {
    isEqual: isEqual
  });

}).call(this);

},{"tantamount":18,"underscore":"pRZqWN"}],18:[function(require,module,exports){
(function() {
  var isEqual, _, _isEqual;

  _ = require('underscore');

  _isEqual = _.isEqual;

  isEqual = function(a, b, aStack, bStack) {
    var aCtor, aCtorValid, aElement, aKeyCount, aValue, bCtor, bCtorValid, bKeyCount, bValue, equal, i, key, stackIndex, _i, _len;
    if (aStack == null) {
      aStack = [];
    }
    if (bStack == null) {
      bStack = [];
    }
    if (a === b) {
      return _isEqual(a, b);
    }
    if (_.isFunction(a) || _.isFunction(b)) {
      return _isEqual(a, b);
    }
    if (_.isFunction(a != null ? a.isEqual : void 0)) {
      return a.isEqual(b);
    }
    if (_.isFunction(b != null ? b.isEqual : void 0)) {
      return b.isEqual(a);
    }
    stackIndex = aStack.length;
    while (stackIndex--) {
      if (aStack[stackIndex] === a) {
        return bStack[stackIndex] === b;
      }
    }
    aStack.push(a);
    bStack.push(b);
    equal = false;
    if (_.isArray(a) && _.isArray(b) && a.length === b.length) {
      equal = true;
      for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
        aElement = a[i];
        if (!isEqual(aElement, b[i], aStack, bStack)) {
          equal = false;
          break;
        }
      }
    } else if (_.isRegExp(a) && _.isRegExp(b)) {
      equal = _isEqual(a, b);
    } else if (_.isObject(a) && _.isObject(b)) {
      aCtor = a.constructor;
      bCtor = b.constructor;
      aCtorValid = _.isFunction(aCtor) && aCtor instanceof aCtor;
      bCtorValid = _.isFunction(bCtor) && bCtor instanceof bCtor;
      if (aCtor !== bCtor && !(aCtorValid && bCtorValid)) {
        equal = false;
      } else {
        aKeyCount = 0;
        equal = true;
        for (key in a) {
          aValue = a[key];
          if (!_.has(a, key)) {
            continue;
          }
          aKeyCount++;
          if (!(_.has(b, key) && isEqual(aValue, b[key], aStack, bStack))) {
            equal = false;
            break;
          }
        }
        if (equal) {
          bKeyCount = 0;
          for (key in b) {
            bValue = b[key];
            if (_.has(b, key)) {
              bKeyCount++;
            }
          }
          equal = aKeyCount === bKeyCount;
        }
      }
    } else {
      equal = _isEqual(a, b);
    }
    aStack.pop();
    bStack.pop();
    return equal;
  };

  module.exports = function(a, b) {
    return isEqual(a, b);
  };

}).call(this);

},{"underscore":"pRZqWN"}],19:[function(require,module,exports){
(function() {
  var Behavior, Delegator, Emitter, Model, PropertyAccessors, Subscriber, nextInstanceId, _ref,
    __slice = [].slice;

  _ref = require('emissary'), Behavior = _ref.Behavior, Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  PropertyAccessors = require('property-accessors');

  Delegator = require('delegato');

  nextInstanceId = 1;

  module.exports = Model = (function() {
    Subscriber.includeInto(Model);

    Emitter.includeInto(Model);

    PropertyAccessors.includeInto(Model);

    Delegator.includeInto(Model);

    Model.resetNextInstanceId = function() {
      return nextInstanceId = 1;
    };

    Model.properties = function() {
      var arg, args, defaultValue, name, _i, _len, _ref1, _results, _results1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (typeof args[0] === 'object') {
        _ref1 = args[0];
        _results = [];
        for (name in _ref1) {
          defaultValue = _ref1[name];
          _results.push(this.property(name, defaultValue));
        }
        return _results;
      } else {
        _results1 = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          arg = args[_i];
          _results1.push(this.property(arg));
        }
        return _results1;
      }
    };

    Model.property = function(name, defaultValue) {
      if (this.declaredProperties == null) {
        this.declaredProperties = {};
      }
      this.declaredProperties[name] = defaultValue;
      this.prototype.accessor(name, {
        get: function() {
          return this.get(name);
        },
        set: function(value) {
          return this.set(name, value);
        }
      });
      return this.prototype.accessor("$" + name, {
        get: function() {
          return this.behavior(name);
        }
      });
    };

    Model.behavior = function(name, definition) {
      if (this.declaredBehaviors == null) {
        this.declaredBehaviors = {};
      }
      this.declaredBehaviors[name] = definition;
      this.prototype.accessor(name, {
        get: function() {
          return this.behavior(name).getValue();
        }
      });
      return this.prototype.accessor("$" + name, {
        get: function() {
          return this.behavior(name);
        }
      });
    };

    Model.hasDeclaredProperty = function(name) {
      var _ref1;
      return (_ref1 = this.declaredProperties) != null ? _ref1.hasOwnProperty(name) : void 0;
    };

    Model.hasDeclaredBehavior = function(name) {
      var _ref1;
      return (_ref1 = this.declaredBehaviors) != null ? _ref1.hasOwnProperty(name) : void 0;
    };

    Model.evaluateDeclaredBehavior = function(name, instance) {
      return this.declaredBehaviors[name].call(instance);
    };

    Model.prototype.declaredPropertyValues = null;

    Model.prototype.behaviors = null;

    Model.prototype.alive = true;

    function Model(params) {
      var propertyName;
      this.assignId(params != null ? params.id : void 0);
      for (propertyName in this.constructor.declaredProperties) {
        if (params != null ? params.hasOwnProperty(propertyName) : void 0) {
          this.set(propertyName, params[propertyName]);
        } else {
          if (this.get(propertyName, true) == null) {
            this.setDefault(propertyName);
          }
        }
      }
    }

    Model.prototype.assignId = function(id) {
      return this.id != null ? this.id : this.id = id != null ? id : nextInstanceId++;
    };

    Model.prototype.setDefault = function(name) {
      var defaultValue, _ref1;
      defaultValue = (_ref1 = this.constructor.declaredProperties) != null ? _ref1[name] : void 0;
      if (typeof defaultValue === 'function') {
        defaultValue = defaultValue.call(this);
      }
      return this.set(name, defaultValue);
    };

    Model.prototype.get = function(name, suppressDefault) {
      if (this.constructor.hasDeclaredProperty(name)) {
        if (this.declaredPropertyValues == null) {
          this.declaredPropertyValues = {};
        }
        if (!(suppressDefault || this.declaredPropertyValues.hasOwnProperty(name))) {
          this.setDefault(name);
        }
        return this.declaredPropertyValues[name];
      } else {
        return this[name];
      }
    };

    Model.prototype.set = function(name, value) {
      var properties, _ref1, _ref2;
      if (typeof name === 'object') {
        properties = name;
        for (name in properties) {
          value = properties[name];
          this.set(name, value);
        }
        return properties;
      } else {
        if (this.get(name, true) !== value) {
          if (this.constructor.hasDeclaredProperty(name)) {
            if (this.declaredPropertyValues == null) {
              this.declaredPropertyValues = {};
            }
            this.declaredPropertyValues[name] = value;
          } else {
            this[name] = value;
          }
          if ((_ref1 = this.behaviors) != null) {
            if ((_ref2 = _ref1[name]) != null) {
              _ref2.emitValue(value);
            }
          }
        }
        return value;
      }
    };

    Model.prototype.advisedAccessor('id', {
      set: function(id) {
        if (id >= nextInstanceId) {
          return nextInstanceId = id + 1;
        }
      }
    });

    Model.prototype.behavior = function(name) {
      var behavior;
      if (this.behaviors == null) {
        this.behaviors = {};
      }
      if (behavior = this.behaviors[name]) {
        return behavior;
      } else {
        if (this.constructor.hasDeclaredProperty(name)) {
          return this.behaviors[name] = new Behavior(this.get(name)).retain();
        } else if (this.constructor.hasDeclaredBehavior(name)) {
          return this.behaviors[name] = this.constructor.evaluateDeclaredBehavior(name, this).retain();
        }
      }
    };

    Model.prototype.when = function(signal, action) {
      var _this = this;
      return this.subscribe(signal, function(value) {
        if (value) {
          if (typeof action === 'function') {
            return action.call(_this);
          } else {
            return _this[action]();
          }
        }
      });
    };

    Model.prototype.destroy = function() {
      var behavior, name, _ref1;
      if (!this.isAlive()) {
        return;
      }
      this.alive = false;
      if (typeof this.destroyed === "function") {
        this.destroyed();
      }
      this.unsubscribe();
      _ref1 = this.behaviors;
      for (name in _ref1) {
        behavior = _ref1[name];
        behavior.release();
      }
      return this.emit('destroyed');
    };

    Model.prototype.isAlive = function() {
      return this.alive;
    };

    Model.prototype.isDestroyed = function() {
      return !this.isAlive();
    };

    return Model;

  })();

}).call(this);

},{"delegato":22,"emissary":25,"property-accessors":33}],20:[function(require,module,exports){
(function() {
  var Emitter, PropertyAccessors, Sequence, isEqual,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  isEqual = require('underscore-plus').isEqual;

  Emitter = require('emissary').Emitter;

  PropertyAccessors = require('property-accessors');

  module.exports = Sequence = (function(_super) {
    __extends(Sequence, _super);

    Emitter.includeInto(Sequence);

    PropertyAccessors.includeInto(Sequence);

    Sequence.prototype.suppressChangeEvents = false;

    Sequence.fromArray = function(array) {
      if (array == null) {
        array = [];
      }
      array = array.slice();
      array.__proto__ = this.prototype;
      return array;
    };

    function Sequence() {
      var elements;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return Sequence.fromArray(elements);
    }

    Sequence.prototype.set = function(index, value) {
      var insertedValues, oldLength, removedValues;
      if (index >= this.length) {
        oldLength = this.length;
        removedValues = [];
        this[index] = value;
        insertedValues = this.slice(oldLength, +(index + 1) + 1 || 9e9);
        index = oldLength;
      } else {
        removedValues = [this[index]];
        insertedValues = [value];
        this[index] = value;
      }
      return this.emitChanged({
        index: index,
        removedValues: removedValues,
        insertedValues: insertedValues
      });
    };

    Sequence.prototype.splice = function() {
      var count, index, insertedValues, removedValues;
      index = arguments[0], count = arguments[1], insertedValues = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      removedValues = Sequence.__super__.splice.apply(this, arguments);
      this.emitChanged({
        index: index,
        removedValues: removedValues,
        insertedValues: insertedValues
      });
      return removedValues;
    };

    Sequence.prototype.push = function() {
      var index, insertedValues, result;
      insertedValues = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      index = this.length;
      this.suppressChangeEvents = true;
      result = Sequence.__super__.push.apply(this, arguments);
      this.suppressChangeEvents = false;
      this.emitChanged({
        index: index,
        removedValues: [],
        insertedValues: insertedValues
      });
      return result;
    };

    Sequence.prototype.pop = function() {
      var result;
      this.suppressChangeEvents = true;
      result = Sequence.__super__.pop.apply(this, arguments);
      this.suppressChangeEvents = false;
      this.emitChanged({
        index: this.length,
        removedValues: [result],
        insertedValues: []
      });
      return result;
    };

    Sequence.prototype.unshift = function() {
      var insertedValues, result;
      insertedValues = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.suppressChangeEvents = true;
      result = Sequence.__super__.unshift.apply(this, arguments);
      this.suppressChangeEvents = false;
      this.emitChanged({
        index: 0,
        removedValues: [],
        insertedValues: insertedValues
      });
      return result;
    };

    Sequence.prototype.shift = function() {
      var result;
      this.suppressChangeEvents = true;
      result = Sequence.__super__.shift.apply(this, arguments);
      this.suppressChangeEvents = false;
      this.emitChanged({
        index: 0,
        removedValues: [result],
        insertedValues: []
      });
      return result;
    };

    Sequence.prototype.isEqual = function(other) {
      var v;
      return (this === other) || isEqual((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = this.length; _i < _len; _i++) {
          v = this[_i];
          _results.push(v);
        }
        return _results;
      }).call(this), (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = other.length; _i < _len; _i++) {
          v = other[_i];
          _results.push(v);
        }
        return _results;
      })());
    };

    Sequence.prototype.onEach = function(callback) {
      this.forEach(callback);
      return this.on('changed', function(_arg) {
        var i, index, insertedValues, value, _i, _len, _results;
        index = _arg.index, insertedValues = _arg.insertedValues;
        _results = [];
        for (i = _i = 0, _len = insertedValues.length; _i < _len; i = ++_i) {
          value = insertedValues[i];
          _results.push(callback(value, index + i));
        }
        return _results;
      });
    };

    Sequence.prototype.onRemoval = function(callback) {
      return this.on('changed', function(_arg) {
        var index, removedValues, value, _i, _len, _results;
        index = _arg.index, removedValues = _arg.removedValues;
        _results = [];
        for (_i = 0, _len = removedValues.length; _i < _len; _i++) {
          value = removedValues[_i];
          _results.push(callback(value, index));
        }
        return _results;
      });
    };

    Sequence.prototype.lazyAccessor('$length', function() {
      var _this = this;
      return this.signal('changed').map(function() {
        return _this.length;
      }).distinctUntilChanged().toBehavior(this.length);
    });

    Sequence.prototype.setLength = function(length) {
      var index, insertedValues, removedValues;
      if (length < this.length) {
        index = length;
        removedValues = this.slice(index);
        insertedValues = [];
        this.length = length;
        return this.emitChanged({
          index: index,
          removedValues: removedValues,
          insertedValues: insertedValues
        });
      } else if (length > this.length) {
        index = this.length;
        removedValues = [];
        this.length = length;
        insertedValues = this.slice(index);
        return this.emitChanged({
          index: index,
          removedValues: removedValues,
          insertedValues: insertedValues
        });
      }
    };

    Sequence.prototype.emitChanged = function(event) {
      if (!this.suppressChangeEvents) {
        return this.emit('changed', event);
      }
    };

    return Sequence;

  })(Array);

}).call(this);

},{"emissary":25,"property-accessors":33,"underscore-plus":36}],21:[function(require,module,exports){
(function() {
  module.exports = {
    Model: require('./model'),
    Sequence: require('./sequence')
  };

}).call(this);

},{"./model":19,"./sequence":20}],22:[function(require,module,exports){
(function() {
  var Delegator, Mixin, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Mixin = require('mixto');

  module.exports = Delegator = (function(_super) {
    __extends(Delegator, _super);

    function Delegator() {
      _ref = Delegator.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Delegator.delegatesProperties = function() {
      var propertyName, propertyNames, toMethod, toProperty, _arg, _i, _j, _len, _results,
        _this = this;
      propertyNames = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), _arg = arguments[_i++];
      toProperty = _arg.toProperty, toMethod = _arg.toMethod;
      _results = [];
      for (_j = 0, _len = propertyNames.length; _j < _len; _j++) {
        propertyName = propertyNames[_j];
        _results.push((function(propertyName) {
          return Object.defineProperty(_this.prototype, propertyName, (function() {
            if (toProperty != null) {
              return {
                get: function() {
                  return this[toProperty][propertyName];
                },
                set: function(value) {
                  return this[toProperty][propertyName] = value;
                }
              };
            } else if (toMethod != null) {
              return {
                get: function() {
                  return this[toMethod]()[propertyName];
                },
                set: function(value) {
                  return this[toMethod]()[propertyName] = value;
                }
              };
            } else {
              throw new Error("No delegation target specified");
            }
          })());
        })(propertyName));
      }
      return _results;
    };

    Delegator.delegatesMethods = function() {
      var methodName, methodNames, toMethod, toProperty, _arg, _i, _j, _len, _results,
        _this = this;
      methodNames = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), _arg = arguments[_i++];
      toProperty = _arg.toProperty, toMethod = _arg.toMethod;
      _results = [];
      for (_j = 0, _len = methodNames.length; _j < _len; _j++) {
        methodName = methodNames[_j];
        _results.push((function(methodName) {
          if (toProperty != null) {
            return _this.prototype[methodName] = function() {
              var args, _ref1;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return (_ref1 = this[toProperty])[methodName].apply(_ref1, args);
            };
          } else if (toMethod != null) {
            return _this.prototype[methodName] = function() {
              var args, _ref1;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return (_ref1 = this[toMethod]())[methodName].apply(_ref1, args);
            };
          } else {
            throw new Error("No delegation target specified");
          }
        })(methodName));
      }
      return _results;
    };

    Delegator.delegatesProperty = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.delegatesProperties.apply(this, args);
    };

    Delegator.delegatesMethod = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.delegatesMethods.apply(this, args);
    };

    return Delegator;

  })(Mixin);

}).call(this);

},{"mixto":23}],23:[function(require,module,exports){
(function() {
  var ExcludedClassProperties, ExcludedPrototypeProperties, Mixin, name;

  module.exports = Mixin = (function() {
    Mixin.includeInto = function(constructor) {
      var name, value, _ref;
      this.extend(constructor.prototype);
      for (name in this) {
        value = this[name];
        if (ExcludedClassProperties.indexOf(name) === -1) {
          if (!constructor.hasOwnProperty(name)) {
            constructor[name] = value;
          }
        }
      }
      return (_ref = this.included) != null ? _ref.call(constructor) : void 0;
    };

    Mixin.extend = function(object) {
      var name, _i, _len, _ref, _ref1;
      _ref = Object.getOwnPropertyNames(this.prototype);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        if (ExcludedPrototypeProperties.indexOf(name) === -1) {
          if (!object.hasOwnProperty(name)) {
            object[name] = this.prototype[name];
          }
        }
      }
      return (_ref1 = this.prototype.extended) != null ? _ref1.call(object) : void 0;
    };

    function Mixin() {
      if (typeof this.extended === "function") {
        this.extended();
      }
    }

    return Mixin;

  })();

  ExcludedClassProperties = ['__super__'];

  for (name in Mixin) {
    ExcludedClassProperties.push(name);
  }

  ExcludedPrototypeProperties = ['constructor', 'extended'];

}).call(this);

},{}],24:[function(require,module,exports){
(function() {
  var Behavior, PropertyAccessors, Signal, helpers, isEqual,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  isEqual = require('underscore-plus').isEqual;

  PropertyAccessors = require('property-accessors');

  Signal = require('./signal');

  module.exports = Behavior = (function(_super) {
    __extends(Behavior, _super);

    PropertyAccessors.includeInto(Behavior);

    function Behavior() {
      var args, subscribeCallback, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (typeof ((_ref = args[0]) != null ? _ref.call : void 0) !== 'function') {
        this.value = args.shift();
      }
      Behavior.__super__.constructor.call(this, subscribeCallback = args.shift());
    }

    Behavior.prototype.retained = function() {
      var _this = this;
      this.subscribe(this, 'value-internal', function(value) {
        return _this.value = value;
      });
      this.subscribe(this, 'value-subscription-added', function(handler) {
        return handler(_this.value);
      });
      return typeof this.subscribeCallback === "function" ? this.subscribeCallback() : void 0;
    };

    Behavior.prototype.emit = function() {
      var args, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (name === 'value') {
        this.emit.apply(this, ['value-internal'].concat(__slice.call(args)));
      }
      return Behavior.__super__.emit.apply(this, arguments);
    };

    Behavior.prototype.getValue = function() {
      if (!(this.retainCount > 0)) {
        throw new Error("Subscribe to or retain this behavior before calling getValue");
      }
      return this.value;
    };

    Behavior.prototype.and = function(right) {
      return helpers.combine(this, right, (function(leftValue, rightValue) {
        return leftValue && rightValue;
      })).distinctUntilChanged();
    };

    Behavior.prototype.or = function(right) {
      return helpers.combine(this, right, (function(leftValue, rightValue) {
        return leftValue || rightValue;
      })).distinctUntilChanged();
    };

    Behavior.prototype.toBehavior = function() {
      return this;
    };

    Behavior.prototype.lazyAccessor('changes', function() {
      var source;
      source = this;
      return new Signal(function() {
        var gotFirst,
          _this = this;
        gotFirst = false;
        return this.subscribe(source, 'value', function() {
          var metadata, value;
          value = arguments[0], metadata = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (gotFirst) {
            _this.emitValue.apply(_this, [value].concat(__slice.call(metadata)));
          }
          return gotFirst = true;
        });
      });
    });

    Behavior.prototype.becomes = function(predicateOrTargetValue) {
      var predicate, targetValue;
      if (typeof predicateOrTargetValue !== 'function') {
        targetValue = predicateOrTargetValue;
        return this.becomes(function(value) {
          return isEqual(value, targetValue);
        });
      }
      predicate = predicateOrTargetValue;
      return this.map(function(value) {
        return !!predicate(value);
      }).distinctUntilChanged().changes;
    };

    Behavior.prototype.becomesLessThan = function(targetValue) {
      return this.becomes(function(value) {
        return value < targetValue;
      });
    };

    Behavior.prototype.becomesGreaterThan = function(targetValue) {
      return this.becomes(function(value) {
        return value > targetValue;
      });
    };

    return Behavior;

  })(Signal);

  helpers = require('./helpers');

}).call(this);

},{"./helpers":27,"./signal":28,"property-accessors":33,"underscore-plus":36}],25:[function(require,module,exports){
(function() {
  var combine;

  combine = require('./helpers').combine;

  module.exports = {
    Emitter: require('./emitter'),
    Subscriber: require('./subscriber'),
    Signal: require('./signal'),
    Behavior: require('./behavior'),
    combine: combine
  };

}).call(this);

},{"./behavior":24,"./emitter":26,"./helpers":27,"./signal":28,"./subscriber":29}],26:[function(require,module,exports){
(function() {
  var Emitter, Mixin, Signal, Subscription, removeFromArray, subscriptionRemovedPattern, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Mixin = require('mixto');

  Signal = null;

  Subscription = null;

  subscriptionRemovedPattern = /^(last-)?.+-subscription-removed$/;

  module.exports = Emitter = (function(_super) {
    __extends(Emitter, _super);

    function Emitter() {
      _ref = Emitter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Emitter.prototype.eventHandlersByEventName = null;

    Emitter.prototype.eventHandlersByNamespace = null;

    Emitter.prototype.subscriptionCounts = null;

    Emitter.prototype.pauseCountsByEventName = null;

    Emitter.prototype.queuedEventsByEventName = null;

    Emitter.prototype.globalPauseCount = null;

    Emitter.prototype.globalQueuedEvents = null;

    Emitter.prototype.signalsByEventName = null;

    Emitter.prototype.on = function(eventNames, handler) {
      var eventName, namespace, _base, _base1, _base2, _i, _len, _ref1, _ref2;
      _ref1 = eventNames.split(/\s+/);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        eventName = _ref1[_i];
        if (!(eventName !== '')) {
          continue;
        }
        _ref2 = eventName.split('.'), eventName = _ref2[0], namespace = _ref2[1];
        this.emit("" + eventName + "-subscription-will-be-added", handler);
        if (this.incrementSubscriptionCount(eventName) === 1) {
          this.emit("first-" + eventName + "-subscription-will-be-added", handler);
        }
        if (this.eventHandlersByEventName == null) {
          this.eventHandlersByEventName = {};
        }
        if ((_base = this.eventHandlersByEventName)[eventName] == null) {
          _base[eventName] = [];
        }
        this.eventHandlersByEventName[eventName].push(handler);
        if (namespace) {
          if (this.eventHandlersByNamespace == null) {
            this.eventHandlersByNamespace = {};
          }
          if ((_base1 = this.eventHandlersByNamespace)[namespace] == null) {
            _base1[namespace] = {};
          }
          if ((_base2 = this.eventHandlersByNamespace[namespace])[eventName] == null) {
            _base2[eventName] = [];
          }
          this.eventHandlersByNamespace[namespace][eventName].push(handler);
        }
        this.emit("" + eventName + "-subscription-added", handler);
      }
      if (Subscription == null) {
        Subscription = require('./subscription');
      }
      return new Subscription(this, eventNames, handler);
    };

    Emitter.prototype.once = function(eventName, handler) {
      var subscription;
      return subscription = this.on(eventName, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        subscription.off();
        return handler.apply(null, args);
      });
    };

    Emitter.prototype.signal = function(eventName) {
      var _base;
      if (Signal == null) {
        Signal = require('./signal');
      }
      if (this.signalsByEventName == null) {
        this.signalsByEventName = {};
      }
      return (_base = this.signalsByEventName)[eventName] != null ? (_base = this.signalsByEventName)[eventName] : _base[eventName] = Signal.fromEmitter(this, eventName);
    };

    Emitter.prototype.behavior = function(eventName, initialValue) {
      return this.signal(eventName).toBehavior(initialValue);
    };

    Emitter.prototype.emit = function() {
      var args, eventName, handlers, namespace, queuedEvents, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (this.globalQueuedEvents) {
        return this.globalQueuedEvents.push([eventName].concat(__slice.call(args)));
      } else {
        _ref1 = eventName.split('.'), eventName = _ref1[0], namespace = _ref1[1];
        if (namespace) {
          if (queuedEvents = (_ref2 = this.queuedEventsByEventName) != null ? _ref2[eventName] : void 0) {
            return queuedEvents.push(["" + eventName + "." + namespace].concat(__slice.call(args)));
          } else if (handlers = (_ref3 = this.eventHandlersByNamespace) != null ? (_ref4 = _ref3[namespace]) != null ? _ref4[eventName] : void 0 : void 0) {
            (function(func, args, ctor) {
              ctor.prototype = func.prototype;
              var child = new ctor, result = func.apply(child, args);
              return Object(result) === result ? result : child;
            })(Array, handlers, function(){}).forEach(function(handler) {
              return handler.apply(null, args);
            });
            return this.emit.apply(this, ["after-" + eventName].concat(__slice.call(args)));
          }
        } else {
          if (queuedEvents = (_ref5 = this.queuedEventsByEventName) != null ? _ref5[eventName] : void 0) {
            return queuedEvents.push([eventName].concat(__slice.call(args)));
          } else if (handlers = (_ref6 = this.eventHandlersByEventName) != null ? _ref6[eventName] : void 0) {
            (function(func, args, ctor) {
              ctor.prototype = func.prototype;
              var child = new ctor, result = func.apply(child, args);
              return Object(result) === result ? result : child;
            })(Array, handlers, function(){}).forEach(function(handler) {
              return handler.apply(null, args);
            });
            return this.emit.apply(this, ["after-" + eventName].concat(__slice.call(args)));
          }
        }
      }
    };

    Emitter.prototype.off = function(eventNames, handler) {
      var eventHandlers, eventName, handlers, namespace, namespaceHandlers, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref1, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (eventNames) {
        _ref1 = eventNames.split(/\s+/);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          eventName = _ref1[_i];
          if (!(eventName !== '')) {
            continue;
          }
          _ref2 = eventName.split('.'), eventName = _ref2[0], namespace = _ref2[1];
          if (eventName === '') {
            eventName = void 0;
          }
          if (namespace) {
            if (eventName) {
              handlers = (_ref3 = (_ref4 = this.eventHandlersByNamespace) != null ? (_ref5 = _ref4[namespace]) != null ? _ref5[eventName] : void 0 : void 0) != null ? _ref3 : [];
              if (handler != null) {
                removeFromArray(handlers, handler);
                this.off(eventName, handler);
              } else {
                _ref6 = (function(func, args, ctor) {
                  ctor.prototype = func.prototype;
                  var child = new ctor, result = func.apply(child, args);
                  return Object(result) === result ? result : child;
                })(Array, handlers, function(){});
                for (_j = 0, _len1 = _ref6.length; _j < _len1; _j++) {
                  handler = _ref6[_j];
                  removeFromArray(handlers, handler);
                  this.off(eventName, handler);
                }
              }
            } else {
              namespaceHandlers = (_ref7 = (_ref8 = this.eventHandlersByNamespace) != null ? _ref8[namespace] : void 0) != null ? _ref7 : {};
              if (handler != null) {
                for (eventName in namespaceHandlers) {
                  handlers = namespaceHandlers[eventName];
                  removeFromArray(handlers, handler);
                  this.off(eventName, handler);
                }
              } else {
                for (eventName in namespaceHandlers) {
                  handlers = namespaceHandlers[eventName];
                  _ref9 = (function(func, args, ctor) {
                    ctor.prototype = func.prototype;
                    var child = new ctor, result = func.apply(child, args);
                    return Object(result) === result ? result : child;
                  })(Array, handlers, function(){});
                  for (_k = 0, _len2 = _ref9.length; _k < _len2; _k++) {
                    handler = _ref9[_k];
                    removeFromArray(handlers, handler);
                    this.off(eventName, handler);
                  }
                }
              }
            }
          } else {
            eventHandlers = (_ref10 = this.eventHandlersByEventName) != null ? _ref10[eventName] : void 0;
            if (eventHandlers == null) {
              return;
            }
            if (handler == null) {
              for (_l = 0, _len3 = eventHandlers.length; _l < _len3; _l++) {
                handler = eventHandlers[_l];
                this.off(eventName, handler);
              }
              return;
            }
            if (removeFromArray(eventHandlers, handler)) {
              this.decrementSubscriptionCount(eventName);
              this.emit("" + eventName + "-subscription-removed", handler);
              if (this.getSubscriptionCount(eventName) === 0) {
                this.emit("last-" + eventName + "-subscription-removed", handler);
                delete this.eventHandlersByEventName[eventName];
              }
            }
          }
        }
      } else {
        for (eventName in this.eventHandlersByEventName) {
          if (!subscriptionRemovedPattern.test(eventName)) {
            this.off(eventName);
          }
        }
        for (eventName in this.eventHandlersByEventName) {
          this.off(eventName);
        }
        return this.eventHandlersByNamespace = {};
      }
    };

    Emitter.prototype.pauseEvents = function(eventNames) {
      var eventName, _base, _base1, _i, _len, _ref1, _results;
      if (eventNames) {
        _ref1 = eventNames.split(/\s+/);
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          eventName = _ref1[_i];
          if (!(eventName !== '')) {
            continue;
          }
          if (this.pauseCountsByEventName == null) {
            this.pauseCountsByEventName = {};
          }
          if (this.queuedEventsByEventName == null) {
            this.queuedEventsByEventName = {};
          }
          if ((_base = this.pauseCountsByEventName)[eventName] == null) {
            _base[eventName] = 0;
          }
          this.pauseCountsByEventName[eventName]++;
          _results.push((_base1 = this.queuedEventsByEventName)[eventName] != null ? (_base1 = this.queuedEventsByEventName)[eventName] : _base1[eventName] = []);
        }
        return _results;
      } else {
        if (this.globalPauseCount == null) {
          this.globalPauseCount = 0;
        }
        if (this.globalQueuedEvents == null) {
          this.globalQueuedEvents = [];
        }
        return this.globalPauseCount++;
      }
    };

    Emitter.prototype.resumeEvents = function(eventNames) {
      var event, eventName, queuedEvents, _i, _j, _len, _len1, _ref1, _ref2, _results, _results1;
      if (eventNames) {
        _ref1 = eventNames.split(/\s+/);
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          eventName = _ref1[_i];
          if (eventName !== '') {
            if (((_ref2 = this.pauseCountsByEventName) != null ? _ref2[eventName] : void 0) > 0 && --this.pauseCountsByEventName[eventName] === 0) {
              queuedEvents = this.queuedEventsByEventName[eventName];
              this.queuedEventsByEventName[eventName] = null;
              _results.push((function() {
                var _j, _len1, _results1;
                _results1 = [];
                for (_j = 0, _len1 = queuedEvents.length; _j < _len1; _j++) {
                  event = queuedEvents[_j];
                  _results1.push(this.emit.apply(this, event));
                }
                return _results1;
              }).call(this));
            } else {
              _results.push(void 0);
            }
          }
        }
        return _results;
      } else {
        for (eventName in this.pauseCountsByEventName) {
          this.resumeEvents(eventName);
        }
        if (this.globalPauseCount > 0 && --this.globalPauseCount === 0) {
          queuedEvents = this.globalQueuedEvents;
          this.globalQueuedEvents = null;
          _results1 = [];
          for (_j = 0, _len1 = queuedEvents.length; _j < _len1; _j++) {
            event = queuedEvents[_j];
            _results1.push(this.emit.apply(this, event));
          }
          return _results1;
        }
      }
    };

    Emitter.prototype.incrementSubscriptionCount = function(eventName) {
      var _base;
      if (this.subscriptionCounts == null) {
        this.subscriptionCounts = {};
      }
      if ((_base = this.subscriptionCounts)[eventName] == null) {
        _base[eventName] = 0;
      }
      return ++this.subscriptionCounts[eventName];
    };

    Emitter.prototype.decrementSubscriptionCount = function(eventName) {
      var count;
      count = --this.subscriptionCounts[eventName];
      if (count === 0) {
        delete this.subscriptionCounts[eventName];
      }
      return count;
    };

    Emitter.prototype.getSubscriptionCount = function(eventName) {
      var count, name, total, _ref1, _ref2, _ref3;
      if (eventName != null) {
        return (_ref1 = (_ref2 = this.subscriptionCounts) != null ? _ref2[eventName] : void 0) != null ? _ref1 : 0;
      } else {
        total = 0;
        _ref3 = this.subscriptionCounts;
        for (name in _ref3) {
          count = _ref3[name];
          total += count;
        }
        return total;
      }
    };

    Emitter.prototype.hasSubscriptions = function(eventName) {
      return this.getSubscriptionCount(eventName) > 0;
    };

    return Emitter;

  })(Mixin);

  removeFromArray = function(array, element) {
    var index;
    index = array.indexOf(element);
    if (index > -1) {
      array.splice(index, 1);
      return true;
    } else {
      return false;
    }
  };

}).call(this);

},{"./signal":28,"./subscription":30,"mixto":32}],27:[function(require,module,exports){
(function() {
  var Behavior, combineArray, combineWithFunction,
    __slice = [].slice;

  Behavior = require('./behavior');

  exports.combine = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 1 && Array.isArray(args[0])) {
      return combineArray(args[0]);
    } else if (typeof args[args.length - 1] === 'function') {
      return combineWithFunction(args);
    } else {
      throw new Error("Invalid object type");
    }
  };

  combineArray = function(array) {
    var behavior;
    return behavior = new Behavior(function() {
      var element, i, outputArray, ready, _i, _len,
        _this = this;
      outputArray = array.slice();
      ready = false;
      for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
        element = array[i];
        if (element.constructor.name === 'Behavior') {
          (function(element, i) {
            return _this.subscribe(element.onValue(function(value, metadata) {
              if (ready) {
                outputArray = outputArray.slice();
              }
              outputArray[i] = value;
              if (ready) {
                return _this.emitValue(outputArray, metadata);
              }
            }));
          })(element, i);
        }
      }
      ready = true;
      return this.emitValue(outputArray);
    });
  };

  combineWithFunction = function(args) {
    var fn;
    fn = args.pop();
    return combineArray(args).map(function(argsArray) {
      return fn.apply(null, argsArray);
    });
  };

}).call(this);

},{"./behavior":24}],28:[function(require,module,exports){
(function() {
  var Behavior, Emitter, Signal, Subscriber, isEqual,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  isEqual = require('underscore-plus').isEqual;

  Emitter = require('./emitter');

  Subscriber = require('./subscriber');

  Behavior = null;

  module.exports = Signal = (function(_super) {
    __extends(Signal, _super);

    Subscriber.includeInto(Signal);

    Signal.fromEmitter = function(emitter, eventName) {
      return new Signal(function() {
        var _this = this;
        return this.subscribe(emitter, eventName, function() {
          var metadata, value;
          value = arguments[0], metadata = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          return _this.emitValue.apply(_this, [value].concat(__slice.call(metadata)));
        });
      });
    };

    function Signal(subscribeCallback) {
      var _this = this;
      this.subscribeCallback = subscribeCallback;
      this.retainCount = 0;
      this.on('value-subscription-will-be-added', function() {
        return _this.retain();
      });
      this.on('value-subscription-removed', function() {
        return _this.release();
      });
    }

    Signal.prototype.isSignal = true;

    Signal.prototype.retained = function() {
      return typeof this.subscribeCallback === "function" ? this.subscribeCallback() : void 0;
    };

    Signal.prototype.released = function() {
      return this.unsubscribe();
    };

    Signal.prototype.retain = function() {
      if (++this.retainCount === 1) {
        if (typeof this.retained === "function") {
          this.retained();
        }
      }
      return this;
    };

    Signal.prototype.release = function() {
      if (--this.retainCount === 0) {
        if (typeof this.released === "function") {
          this.released();
        }
      }
      return this;
    };

    Signal.prototype.onValue = function(handler) {
      return this.on('value', handler);
    };

    Signal.prototype.emitValue = function(value, metadata) {
      if (metadata == null) {
        metadata = {};
      }
      if (metadata.source == null) {
        metadata.source = this;
      }
      return this.emit('value', value, metadata);
    };

    Signal.prototype.toBehavior = function(initialValue) {
      var source;
      source = this;
      return this.buildBehavior(initialValue, function() {
        var _this = this;
        return this.subscribe(source, 'value', function() {
          var metadata, value;
          value = arguments[0], metadata = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          return _this.emitValue.apply(_this, [value].concat(__slice.call(metadata)));
        });
      });
    };

    Signal.prototype.changes = function() {
      return this;
    };

    Signal.prototype.injectMetadata = function(fn) {
      var source;
      source = this;
      return new this.constructor(function() {
        var _this = this;
        return this.subscribe(source, 'value', function(value, metadata) {
          var k, newMetadata, v;
          newMetadata = fn(value, metadata);
          for (k in newMetadata) {
            v = newMetadata[k];
            metadata[k] = v;
          }
          return _this.emitValue(value, metadata);
        });
      });
    };

    Signal.prototype.filter = function(predicate) {
      var source;
      source = this;
      return new this.constructor(function() {
        var _this = this;
        return this.subscribe(source, 'value', function() {
          var metadata, value;
          value = arguments[0], metadata = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (predicate.call(value, value)) {
            return _this.emitValue.apply(_this, [value].concat(__slice.call(metadata)));
          }
        });
      });
    };

    Signal.prototype.filterDefined = function() {
      return this.filter(function(value) {
        return value != null;
      });
    };

    Signal.prototype.map = function(fn) {
      var property, source;
      if (typeof fn === 'string') {
        property = fn;
        fn = function(value) {
          return value != null ? value[property] : void 0;
        };
      }
      source = this;
      return new this.constructor(function() {
        var _this = this;
        return this.subscribe(source, 'value', function() {
          var metadata, value;
          value = arguments[0], metadata = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          return _this.emitValue.apply(_this, [fn.call(value, value)].concat(__slice.call(metadata)));
        });
      });
    };

    Signal.prototype["switch"] = function(fn) {
      var source;
      source = this.map(fn);
      return new this.constructor(function() {
        var currentSignal,
          _this = this;
        currentSignal = null;
        return this.subscribe(source, 'value', function(newSignal, outerMetadata) {
          if (currentSignal != null) {
            _this.unsubscribe(currentSignal);
          }
          currentSignal = newSignal;
          if (currentSignal != null) {
            return _this.subscribe(currentSignal, 'value', function(value, innerMetadata) {
              return _this.emitValue(value, innerMetadata);
            });
          } else {
            return _this.emitValue(void 0, outerMetadata);
          }
        });
      });
    };

    Signal.prototype.skipUntil = function(predicateOrTargetValue) {
      var doneSkipping, predicate, targetValue;
      if (typeof predicateOrTargetValue !== 'function') {
        targetValue = predicateOrTargetValue;
        return this.skipUntil(function(value) {
          return isEqual(value, targetValue);
        });
      }
      predicate = predicateOrTargetValue;
      doneSkipping = false;
      return this.filter(function(value) {
        if (doneSkipping) {
          return true;
        }
        if (predicate(value)) {
          return doneSkipping = true;
        } else {
          return false;
        }
      });
    };

    Signal.prototype.scan = function(initialValue, fn) {
      var source;
      source = this;
      return this.buildBehavior(initialValue, function() {
        var oldValue,
          _this = this;
        oldValue = initialValue;
        return this.subscribe(source, 'value', function() {
          var metadata, newValue;
          newValue = arguments[0], metadata = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          return _this.emitValue.apply(_this, [(oldValue = fn(oldValue, newValue))].concat(__slice.call(metadata)));
        });
      });
    };

    Signal.prototype.diff = function(initialValue, fn) {
      var source;
      source = this;
      return this.buildBehavior(function() {
        var oldValue,
          _this = this;
        oldValue = initialValue;
        return this.subscribe(source, 'value', function() {
          var fnOldValue, metadata, newValue;
          newValue = arguments[0], metadata = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          fnOldValue = oldValue;
          oldValue = newValue;
          return _this.emitValue.apply(_this, [fn(fnOldValue, newValue)].concat(__slice.call(metadata)));
        });
      });
    };

    Signal.prototype.distinctUntilChanged = function() {
      var source;
      source = this;
      return new this.constructor(function() {
        var oldValue, receivedValue,
          _this = this;
        receivedValue = false;
        oldValue = void 0;
        return this.subscribe(source, 'value', function() {
          var metadata, newValue;
          newValue = arguments[0], metadata = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (receivedValue) {
            if (isEqual(oldValue, newValue)) {
              return oldValue = newValue;
            } else {
              oldValue = newValue;
              return _this.emitValue.apply(_this, [newValue].concat(__slice.call(metadata)));
            }
          } else {
            receivedValue = true;
            oldValue = newValue;
            return _this.emitValue.apply(_this, [newValue].concat(__slice.call(metadata)));
          }
        });
      });
    };

    Signal.prototype.equals = function(expected) {
      return this.map(function(actual) {
        return isEqual(actual, expected);
      }).distinctUntilChanged();
    };

    Signal.prototype.isDefined = function() {
      return this.map(function(value) {
        return value != null;
      }).distinctUntilChanged();
    };

    Signal.prototype.buildBehavior = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (Behavior == null) {
        Behavior = require('./behavior');
      }
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Behavior, args, function(){});
    };

    return Signal;

  })(Emitter);

}).call(this);

},{"./behavior":24,"./emitter":26,"./subscriber":29,"underscore-plus":36}],29:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};(function() {
  var Mixin, Signal, Subscriber, Subscription, WeakMap, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Mixin = require('mixto');

  Signal = null;

  WeakMap = (_ref = global.WeakMap) != null ? _ref : require('harmony-collections').WeakMap;

  Subscription = require('./subscription');

  module.exports = Subscriber = (function(_super) {
    __extends(Subscriber, _super);

    function Subscriber() {
      _ref1 = Subscriber.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Subscriber.prototype.subscribeWith = function(eventEmitter, methodName, args) {
      var callback, eventNames;
      if (eventEmitter[methodName] == null) {
        throw new Error("Object does not have method '" + methodName + "' with which to subscribe");
      }
      eventEmitter[methodName].apply(eventEmitter, args);
      eventNames = args[0];
      callback = args[args.length - 1];
      return this.addSubscription(new Subscription(eventEmitter, eventNames, callback));
    };

    Subscriber.prototype.addSubscription = function(subscription) {
      var emitter;
      if (this.subscriptions == null) {
        this.subscriptions = [];
      }
      this.subscriptions.push(subscription);
      emitter = subscription.emitter;
      if (emitter != null) {
        if (this.subscriptionsByObject == null) {
          this.subscriptionsByObject = new WeakMap;
        }
        if (this.subscriptionsByObject.has(emitter)) {
          this.subscriptionsByObject.get(emitter).push(subscription);
        } else {
          this.subscriptionsByObject.set(emitter, [subscription]);
        }
      }
      return subscription;
    };

    Subscriber.prototype.subscribe = function() {
      var args, eventEmitterOrSubscription;
      eventEmitterOrSubscription = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (args.length === 0) {
        return this.addSubscription(eventEmitterOrSubscription);
      } else {
        if (args.length === 1 && eventEmitterOrSubscription.isSignal) {
          args.unshift('value');
        }
        return this.subscribeWith(eventEmitterOrSubscription, 'on', args);
      }
    };

    Subscriber.prototype.subscribeToCommand = function() {
      var args, eventEmitter;
      eventEmitter = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.subscribeWith(eventEmitter, 'command', args);
    };

    Subscriber.prototype.unsubscribe = function(object) {
      var index, subscription, _i, _j, _len, _len1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (object != null) {
        _ref4 = (_ref2 = (_ref3 = this.subscriptionsByObject) != null ? _ref3.get(object) : void 0) != null ? _ref2 : [];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          subscription = _ref4[_i];
          subscription.off();
          index = this.subscriptions.indexOf(subscription);
          if (index >= 0) {
            this.subscriptions.splice(index, 1);
          }
        }
        return (_ref5 = this.subscriptionsByObject) != null ? _ref5["delete"](object) : void 0;
      } else {
        _ref7 = (_ref6 = this.subscriptions) != null ? _ref6 : [];
        for (_j = 0, _len1 = _ref7.length; _j < _len1; _j++) {
          subscription = _ref7[_j];
          subscription.off();
        }
        this.subscriptions = null;
        return this.subscriptionsByObject = null;
      }
    };

    return Subscriber;

  })(Mixin);

}).call(this);

},{"./subscription":30,"harmony-collections":31,"mixto":32}],30:[function(require,module,exports){
(function() {
  var Emitter, Subscription,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Emitter = require('./emitter');

  module.exports = Subscription = (function(_super) {
    __extends(Subscription, _super);

    Subscription.prototype.cancelled = false;

    function Subscription(emitter, eventNames, handler) {
      this.emitter = emitter;
      this.eventNames = eventNames;
      this.handler = handler;
    }

    Subscription.prototype.off = function() {
      var unsubscribe, _ref;
      if (this.cancelled) {
        return;
      }
      unsubscribe = (_ref = this.emitter.off) != null ? _ref : this.emitter.removeListener;
      unsubscribe.call(this.emitter, this.eventNames, this.handler);
      this.emitter = null;
      this.handler = null;
      this.cancelled = true;
      return this.emit('cancelled');
    };

    return Subscription;

  })(Emitter);

}).call(this);

},{"./emitter":26}],31:[function(require,module,exports){
/* (The MIT License)
 *
 * Copyright (c) 2012 Brandon Benvie <http://bbenvie.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the 'Software'), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included with all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY  CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Original WeakMap implementation by Gozala @ https://gist.github.com/1269991
// Updated and bugfixed by Raynos @ https://gist.github.com/1638059
// Expanded by Benvie @ https://github.com/Benvie/harmony-collections

void function(string_, object_, function_, prototype_, toString_,
              Array, Object, Function, FP, global, exports, undefined_, undefined){

  var getProperties = Object.getOwnPropertyNames,
      es5 = typeof getProperties === function_ && !(prototype_ in getProperties);

  var callbind = FP.bind
    ? FP.bind.bind(FP.call)
    : (function(call){
        return function(func){
          return function(){
            return call.apply(func, arguments);
          };
        };
      }(FP.call));

  var functionToString = callbind(FP[toString_]),
      objectToString = callbind({}[toString_]),
      numberToString = callbind(.0.toString),
      call = callbind(FP.call),
      apply = callbind(FP.apply),
      hasOwn = callbind({}.hasOwnProperty),
      push = callbind([].push),
      splice = callbind([].splice);

  var name = function(func){
    if (typeof func !== function_)
      return '';
    else if ('name' in func)
      return func.name;

    return functionToString(func).match(/^\n?function\s?(\w*)?_?\(/)[1];
  };

  var create = es5
    ? Object.create
    : function(proto, descs){
        var Ctor = function(){};
        Ctor[prototype_] = Object(proto);
        var object = new Ctor;

        if (descs)
          for (var key in descs)
            defineProperty(object, key, descs[k]);

        return object;
      };


  function Hash(){}

  if (es5 || typeof document === "undefined") {
    void function(ObjectCreate){
      Hash.prototype = ObjectCreate(null);
      function inherit(obj){
        return ObjectCreate(obj);
      }
      Hash.inherit = inherit;
    }(Object.create);
  } else {
    void function(F){
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      iframe.src = 'javascript:'
      Hash.prototype = iframe.contentWindow.Object.prototype;
      document.body.removeChild(iframe);
      iframe = null;

      var props = ['constructor', 'hasOwnProperty', 'propertyIsEnumerable',
                   'isProtoypeOf', 'toLocaleString', 'toString', 'valueOf'];

      for (var i=0; i < props.length; i++)
        delete Hash.prototype[props[i]];

      function inherit(obj){
        F.prototype = obj;
        obj = new F;
        F.prototype = null;
        return obj;
      }

      Hash.inherit = inherit;
    }(function(){});
  }

  var defineProperty = es5
    ? Object.defineProperty
    : function(object, key, desc) {
        object[key] = desc.value;
        return object;
      };

  var define = function(object, key, value){
    if (typeof key === function_) {
      value = key;
      key = name(value).replace(/_$/, '');
    }

    return defineProperty(object, key, { configurable: true, writable: true, value: value });
  };

  var isArray = es5
    ? (function(isArray){
        return function(o){
          return isArray(o) || o instanceof Array;
        };
      })(Array.isArray)
    : function(o){
        return o instanceof Array || objectToString(o) === '[object Array]';
      };

  // ############
  // ### Data ###
  // ############

  var builtinWeakMap = 'WeakMap' in global;

  var MapData = builtinWeakMap
    ? (function(){
      var BuiltinWeakMap = global.WeakMap,
          wmget = callbind(BuiltinWeakMap[prototype_].get),
          wmset = callbind(BuiltinWeakMap[prototype_].set),
          wmhas = callbind(BuiltinWeakMap[prototype_].has);

      function MapData(name){
        var map = new BuiltinWeakMap;

        this.get = function(o){
          return wmget(map, o);
        };
        this.set = function(o, v){
          wmset(map, o, v);
        };

        if (name) {
          this.wrap = function(o, v){
            if (wmhas(map, o))
              throw new TypeError("Object is already a " + name);
            wmset(map, o, v);
          };
          this.unwrap = function(o){
            var storage = wmget(map, o);
            if (!storage)
              throw new TypeError(name + " is not generic");
            return storage;
          };
        }
      }

      return MapData;
    })()
    : (function(){
      var locker = 'return function(k){if(k===s)return l}',
          random = Math.random,
          uids = new Hash,
          slice = callbind(''.slice),
          indexOf = callbind([].indexOf);

      var createUID = function(){
        var key = slice(numberToString(random(), 36), 2);
        return key in uids ? createUID() : uids[key] = key;
      };

      var globalID = createUID();

      // common per-object storage area made visible by patching getOwnPropertyNames'
      function getOwnPropertyNames(obj){
        var props = getProperties(obj);
        if (hasOwn(obj, globalID))
          splice(props, indexOf(props, globalID), 1);
        return props;
      }

      if (es5) {
        // check for the random key on an object, create new storage if missing, return it
        var storage = function(obj){
          if (!hasOwn(obj, globalID))
            defineProperty(obj, globalID, { value: new Hash });
          return obj[globalID];
        };

        define(Object, getOwnPropertyNames);
      } else {

        var toStringToString = function(s){
          function toString(){ return s }
          return toString[toString_] = toString;
        }(Object[prototype_][toString_]+'');

        // store the values on a custom valueOf in order to hide them but store them locally
        var storage = function(obj){
          if (hasOwn(obj, toString_) && globalID in obj[toString_])
            return obj[toString_][globalID];

          if (!(toString_ in obj))
            throw new Error("Can't store values for "+obj);

          var oldToString = obj[toString_];
          function toString(){ return oldToString.call(this) }
          obj[toString_] = toString;
          toString[toString_] = toStringToString;
          return toString[globalID] = {};
        };
      }



      // shim for [[MapData]] from es6 spec, and pulls double duty as WeakMap storage
      function MapData(name){
        var puid = createUID(),
            iuid = createUID(),
            secret = { value: undefined, writable: true };

        var attach = function(obj){
          var store = storage(obj);
          if (hasOwn(store, puid))
            return store[puid](secret);

          var lockbox = new Hash;
          defineProperty(lockbox, iuid, secret);
          defineProperty(store, puid, {
            value: new Function('s', 'l', locker)(secret, lockbox)
          });
          return lockbox;
        };

        this.get = function(o){
          return attach(o)[iuid];
        };
        this.set = function(o, v){
          attach(o)[iuid] = v;
        };

        if (name) {
          this.wrap = function(o, v){
            var lockbox = attach(o);
            if (lockbox[iuid])
              throw new TypeError("Object is already a " + name);
            lockbox[iuid] = v;
          };
          this.unwrap = function(o){
            var storage = attach(o)[iuid];
            if (!storage)
              throw new TypeError(name + " is not generic");
            return storage;
          };
        }
      }

      return MapData;
    }());

  var exporter = (function(){
    // [native code] looks slightly different in each engine
    var src = (''+Object).split('Object');

    // fake [native code]
    function toString(){
      return src[0] + name(this) + src[1];
    }

    define(toString, toString);

    // attempt to use __proto__ so the methods don't all have an own toString
    var prepFunction = { __proto__: [] } instanceof Array
      ? function(func){ func.__proto__ = toString }
      : function(func){ define(func, toString) };

    // assemble an array of functions into a fully formed class
    var prepare = function(methods){
      var Ctor = methods.shift(),
          brand = '[object ' + name(Ctor) + ']';

      function toString(){ return brand }
      methods.push(toString);
      prepFunction(Ctor);

      for (var i=0; i < methods.length; i++) {
        prepFunction(methods[i]);
        define(Ctor[prototype_], methods[i]);
      }

      return Ctor;
    };

    return function(name, init){
      if (name in exports)
        return exports[name];

      var data = new MapData(name);

      return exports[name] = prepare(init(
        function(collection, value){
          data.wrap(collection, value);
        },
        function(collection){
          return data.unwrap(collection);
        }
      ));
    };
  }());


  // initialize collection with an iterable, currently only supports forEach function
  var initialize = function(iterable, callback){
    if (iterable !== null && typeof iterable === object_ && typeof iterable.forEach === function_) {
      iterable.forEach(function(item, i){
        if (isArray(item) && item.length === 2)
          callback(iterable[i][0], iterable[i][1]);
        else
          callback(iterable[i], i);
      });
    }
  }

  // attempt to fix the name of "delete_" methods, should work in V8 and spidermonkey
  var fixDelete = function(func, scopeNames, scopeValues){
    try {
      scopeNames[scopeNames.length] = ('return '+func).replace('e_', '\\u0065');
      return Function.apply(0, scopeNames).apply(0, scopeValues);
    } catch (e) {
      return func;
    }
  }

  var WM, HM, M;

  // ###############
  // ### WeakMap ###
  // ###############

  WM = builtinWeakMap ? (exports.WeakMap = global.WeakMap) : exporter('WeakMap', function(wrap, unwrap){
    var prototype = WeakMap[prototype_];
    var validate = function(key){
      if (key == null || typeof key !== object_ && typeof key !== function_)
        throw new TypeError("Invalid WeakMap key");
    };

    /**
     * @class        WeakMap
     * @description  Collection using objects with unique identities as keys that disallows enumeration
     *               and allows for better garbage collection.
     * @param        {Iterable} [iterable]  An item to populate the collection with.
     */
    function WeakMap(iterable){
      if (this === global || this == null || this === prototype)
        return new WeakMap(iterable);

      wrap(this, new MapData);

      var self = this;
      iterable && initialize(iterable, function(value, key){
        call(set, self, value, key);
      });
    }
    /**
     * @method       <get>
     * @description  Retrieve the value in the collection that matches key
     * @param        {Any} key
     * @return       {Any}
     */
    function get(key){
      validate(key);
      var value = unwrap(this).get(key);
      return value === undefined_ ? undefined : value;
    }
    /**
     * @method       <set>
     * @description  Add or update a pair in the collection. Enforces uniqueness by overwriting.
     * @param        {Any} key
     * @param        {Any} val
     **/
    function set(key, value){
      validate(key);
      // store a token for explicit undefined so that "has" works correctly
      unwrap(this).set(key, value === undefined ? undefined_ : value);
    }
    /*
     * @method       <has>
     * @description  Check if key is in the collection
     * @param        {Any} key
     * @return       {Boolean}
     **/
    function has(key){
      validate(key);
      return unwrap(this).get(key) !== undefined;
    }
    /**
     * @method       <delete>
     * @description  Remove key and matching value if found
     * @param        {Any} key
     * @return       {Boolean} true if item was in collection
     */
    function delete_(key){
      validate(key);
      var data = unwrap(this);

      if (data.get(key) === undefined)
        return false;

      data.set(key, undefined);
      return true;
    }

    delete_ = fixDelete(delete_, ['validate', 'unwrap'], [validate, unwrap]);
    return [WeakMap, get, set, has, delete_];
  });


  // ###############
  // ### HashMap ###
  // ###############

  HM = exporter('HashMap', function(wrap, unwrap){
    // separate numbers, strings, and atoms to compensate for key coercion to string

    var prototype = HashMap[prototype_],
        STRING = 0, NUMBER = 1, OTHER = 2,
        others = { 'true': true, 'false': false, 'null': null, 0: -0 };

    var proto = Math.random().toString(36).slice(2);

    var coerce = function(key){
      return key === '__proto__' ? proto : key;
    };

    var uncoerce = function(type, key){
      switch (type) {
        case STRING: return key === proto ? '__proto__' : key;
        case NUMBER: return +key;
        case OTHER: return others[key];
      }
    }


    var validate = function(key){
      if (key == null) return OTHER;
      switch (typeof key) {
        case 'boolean': return OTHER;
        case string_: return STRING;
        // negative zero has to be explicitly accounted for
        case 'number': return key === 0 && Infinity / key === -Infinity ? OTHER : NUMBER;
        default: throw new TypeError("Invalid HashMap key");
      }
    }

    /**
     * @class          HashMap
     * @description    Collection that only allows primitives to be keys.
     * @param          {Iterable} [iterable]  An item to populate the collection with.
     */
    function HashMap(iterable){
      if (this === global || this == null || this === prototype)
        return new HashMap(iterable);

      wrap(this, {
        size: 0,
        0: new Hash,
        1: new Hash,
        2: new Hash
      });

      var self = this;
      iterable && initialize(iterable, function(value, key){
        call(set, self, value, key);
      });
    }
    /**
     * @method       <get>
     * @description  Retrieve the value in the collection that matches key
     * @param        {Any} key
     * @return       {Any}
     */
    function get(key){
      return unwrap(this)[validate(key)][coerce(key)];
    }
    /**
     * @method       <set>
     * @description  Add or update a pair in the collection. Enforces uniqueness by overwriting.
     * @param        {Any} key
     * @param        {Any} val
     **/
    function set(key, value){
      var items = unwrap(this),
          data = items[validate(key)];

      key = coerce(key);
      key in data || items.size++;
      data[key] = value;
    }
    /**
     * @method       <has>
     * @description  Check if key exists in the collection.
     * @param        {Any} key
     * @return       {Boolean} is in collection
     **/
    function has(key){
      return coerce(key) in unwrap(this)[validate(key)];
    }
    /**
     * @method       <delete>
     * @description  Remove key and matching value if found
     * @param        {Any} key
     * @return       {Boolean} true if item was in collection
     */
    function delete_(key){
      var items = unwrap(this),
          data = items[validate(key)];

      key = coerce(key);
      if (key in data) {
        delete data[key];
        items.size--;
        return true;
      }

      return false;
    }
    /**
     * @method       <size>
     * @description  Retrieve the amount of items in the collection
     * @return       {Number}
     */
    function size(){
      return unwrap(this).size;
    }
    /**
     * @method       <forEach>
     * @description  Loop through the collection raising callback for each
     * @param        {Function} callback  `callback(value, key)`
     * @param        {Object}   context    The `this` binding for callbacks, default null
     */
    function forEach(callback, context){
      var data = unwrap(this);
      context = context == null ? global : context;
      for (var i=0; i < 3; i++)
        for (var key in data[i])
          call(callback, context, data[i][key], uncoerce(i, key), this);
    }

    delete_ = fixDelete(delete_, ['validate', 'unwrap', 'coerce'], [validate, unwrap, coerce]);
    return [HashMap, get, set, has, delete_, size, forEach];
  });


  // ###########
  // ### Map ###
  // ###########

  // if a fully implemented Map exists then use it
  if ('Map' in global && 'forEach' in global.Map.prototype) {
    M = exports.Map = global.Map;
  } else {
    M = exporter('Map', function(wrap, unwrap){
      // attempt to use an existing partially implemented Map
      var BuiltinMap = global.Map,
          prototype = Map[prototype_],
          wm = WM[prototype_],
          hm = (BuiltinMap || HM)[prototype_],
          mget    = [callbind(hm.get), callbind(wm.get)],
          mset    = [callbind(hm.set), callbind(wm.set)],
          mhas    = [callbind(hm.has), callbind(wm.has)],
          mdelete = [callbind(hm['delete']), callbind(wm['delete'])];

      var type = BuiltinMap
        ? function(){ return 0 }
        : function(o){ return +(typeof o === object_ ? o !== null : typeof o === function_) }

      // if we have a builtin Map we can let it do most of the heavy lifting
      var init = BuiltinMap
        ? function(){ return { 0: new BuiltinMap } }
        : function(){ return { 0: new HM, 1: new WM } };

      /**
       * @class         Map
       * @description   Collection that allows any kind of value to be a key.
       * @param         {Iterable} [iterable]  An item to populate the collection with.
       */
      function Map(iterable){
        if (this === global || this == null || this === prototype)
          return new Map(iterable);

        var data = init();
        data.keys = [];
        data.values = [];
        wrap(this, data);

        var self = this;
        iterable && initialize(iterable, function(value, key){
          call(set, self, value, key);
        });
      }
      /**
       * @method       <get>
       * @description  Retrieve the value in the collection that matches key
       * @param        {Any} key
       * @return       {Any}
       */
      function get(key){
        var data = unwrap(this),
            t = type(key);
        return data.values[mget[t](data[t], key)];
      }
      /**
       * @method       <set>
       * @description  Add or update a pair in the collection. Enforces uniqueness by overwriting.
       * @param        {Any} key
       * @param        {Any} val
       **/
      function set(key, value){
        var data = unwrap(this),
            t = type(key),
            index = mget[t](data[t], key);

        if (index === undefined) {
          mset[t](data[t], key, data.keys.length);
          push(data.keys, key);
          push(data.values, value);
        } else {
          data.keys[index] = key;
          data.values[index] = value;
        }
      }
      /**
       * @method       <has>
       * @description  Check if key exists in the collection.
       * @param        {Any} key
       * @return       {Boolean} is in collection
       **/
      function has(key){
        var t = type(key);
        return mhas[t](unwrap(this)[t], key);
      }
      /**
       * @method       <delete>
       * @description  Remove key and matching value if found
       * @param        {Any} key
       * @return       {Boolean} true if item was in collection
       */
      function delete_(key){
        var data = unwrap(this),
            t = type(key),
            index = mget[t](data[t], key);

        if (index === undefined)
          return false;

        mdelete[t](data[t], key);
        splice(data.keys, index, 1);
        splice(data.values, index, 1);
        return true;
      }
      /**
       * @method       <size>
       * @description  Retrieve the amount of items in the collection
       * @return       {Number}
       */
      function size(){
        return unwrap(this).keys.length;
      }
      /**
       * @method       <forEach>
       * @description  Loop through the collection raising callback for each
       * @param        {Function} callback  `callback(value, key)`
       * @param        {Object}   context    The `this` binding for callbacks, default null
       */
      function forEach(callback, context){
        var data = unwrap(this),
            keys = data.keys,
            values = data.values;

        context = context == null ? global : context;

        for (var i=0, len=keys.length; i < len; i++)
          call(callback, context, values[i], keys[i], this);
      }

      delete_ = fixDelete(delete_,
        ['type', 'unwrap', 'call', 'splice'],
        [type, unwrap, call, splice]
      );
      return [Map, get, set, has, delete_, size, forEach];
    });
  }


  // ###########
  // ### Set ###
  // ###########

  exporter('Set', function(wrap, unwrap){
    var prototype = Set[prototype_],
        m = M[prototype_],
        msize = callbind(m.size),
        mforEach = callbind(m.forEach),
        mget = callbind(m.get),
        mset = callbind(m.set),
        mhas = callbind(m.has),
        mdelete = callbind(m['delete']);

    /**
     * @class        Set
     * @description  Collection of values that enforces uniqueness.
     * @param        {Iterable} [iterable]  An item to populate the collection with.
     **/
    function Set(iterable){
      if (this === global || this == null || this === prototype)
        return new Set(iterable);

      wrap(this, new M);

      var self = this;
      iterable && initialize(iterable, function(value, key){
        call(add, self, key);
      });
    }
    /**
     * @method       <add>
     * @description  Insert value if not found, enforcing uniqueness.
     * @param        {Any} val
     */
    function add(key){
      mset(unwrap(this), key, key);
    }
    /**
     * @method       <has>
     * @description  Check if key exists in the collection.
     * @param        {Any} key
     * @return       {Boolean} is in collection
     **/
    function has(key){
      return mhas(unwrap(this), key);
    }
    /**
     * @method       <delete>
     * @description  Remove key and matching value if found
     * @param        {Any} key
     * @return       {Boolean} true if item was in collection
     */
    function delete_(key){
      return mdelete(unwrap(this), key);
    }
    /**
     * @method       <size>
     * @description  Retrieve the amount of items in the collection
     * @return       {Number}
     */
    function size(){
      return msize(unwrap(this));
    }
    /**
     * @method       <forEach>
     * @description  Loop through the collection raising callback for each. Index is simply the counter for the current iteration.
     * @param        {Function} callback  `callback(value, index)`
     * @param        {Object}   context    The `this` binding for callbacks, default null
     */
    function forEach(callback, context){
      var index = 0,
          self = this;
      mforEach(unwrap(this), function(key){
        call(callback, this, key, index++, self);
      }, context);
    }

    delete_ = fixDelete(delete_, ['mdelete', 'unwrap'], [mdelete, unwrap]);
    return [Set, add, has, delete_, size, forEach];
  });
}('string', 'object', 'function', 'prototype', 'toString',
  Array, Object, Function, Function.prototype, (0, eval)('this'),
  typeof exports === 'undefined' ? this : exports, {});

},{}],32:[function(require,module,exports){
module.exports=require(23)
},{}],33:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};(function() {
  var Mixin, PropertyAccessors, WeakMap, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  WeakMap = (_ref = global.WeakMap) != null ? _ref : require('harmony-collections').WeakMap;

  module.exports = PropertyAccessors = (function(_super) {
    __extends(PropertyAccessors, _super);

    function PropertyAccessors() {
      _ref1 = PropertyAccessors.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    PropertyAccessors.prototype.accessor = function(name, definition) {
      if (typeof definition === 'function') {
        definition = {
          get: definition
        };
      }
      return Object.defineProperty(this, name, definition);
    };

    PropertyAccessors.prototype.advisedAccessor = function(name, definition) {
      var getAdvice, setAdvice, values;
      if (typeof definition === 'function') {
        getAdvice = definition;
      } else {
        getAdvice = definition.get;
        setAdvice = definition.set;
      }
      values = new WeakMap;
      return this.accessor(name, {
        get: function() {
          if (getAdvice != null) {
            getAdvice.call(this);
          }
          return values.get(this);
        },
        set: function(newValue) {
          if (setAdvice != null) {
            setAdvice.call(this, newValue, values.get(this));
          }
          return values.set(this, newValue);
        }
      });
    };

    PropertyAccessors.prototype.lazyAccessor = function(name, definition) {
      var values;
      values = new WeakMap;
      return this.accessor(name, {
        get: function() {
          if (values.has(this)) {
            return values.get(this);
          } else {
            values.set(this, definition.call(this));
            return values.get(this);
          }
        },
        set: function(value) {
          return values.set(this, value);
        }
      });
    };

    return PropertyAccessors;

  })(Mixin);

}).call(this);

},{"harmony-collections":34,"mixto":35}],34:[function(require,module,exports){
module.exports=require(31)
},{}],35:[function(require,module,exports){
module.exports=require(23)
},{}],36:[function(require,module,exports){
(function() {
  var isEqual, modifierKeyMap, plus, shiftKeyMap, _,
    __slice = [].slice;

  _ = require('underscore');

  modifierKeyMap = {
    cmd: '\u2318',
    ctrl: '\u2303',
    alt: '\u2325',
    option: '\u2325',
    shift: '\u21e7',
    enter: '\u23ce',
    left: '\u2190',
    right: '\u2192',
    up: '\u2191',
    down: '\u2193'
  };

  shiftKeyMap = {
    '~': '`',
    '_': '-',
    '+': '=',
    '|': '\\',
    '{': '[',
    '}': ']',
    ':': ';',
    '"': '\'',
    '<': ',',
    '>': '.',
    '?': '/'
  };

  plus = {
    adviseBefore: function(object, methodName, advice) {
      var original;
      original = object[methodName];
      return object[methodName] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (advice.apply(this, args) !== false) {
          return original.apply(this, args);
        }
      };
    },
    camelize: function(string) {
      if (string) {
        return string.replace(/[_-]+(\w)/g, function(m) {
          return m[1].toUpperCase();
        });
      } else {
        return '';
      }
    },
    capitalize: function(word) {
      if (!word) {
        return '';
      }
      if (word.toLowerCase() === 'github') {
        return 'GitHub';
      } else {
        return word[0].toUpperCase() + word.slice(1);
      }
    },
    compactObject: function(object) {
      var key, newObject, value;
      newObject = {};
      for (key in object) {
        value = object[key];
        if (value != null) {
          newObject[key] = value;
        }
      }
      return newObject;
    },
    dasherize: function(string) {
      if (!string) {
        return '';
      }
      string = string[0].toLowerCase() + string.slice(1);
      return string.replace(/([A-Z])|(_)/g, function(m, letter) {
        if (letter) {
          return "-" + letter.toLowerCase();
        } else {
          return "-";
        }
      });
    },
    deepClone: function(object) {
      if (_.isArray(object)) {
        return object.map(function(value) {
          return plus.deepClone(value);
        });
      } else if (_.isObject(object)) {
        return plus.mapObject(object, (function(_this) {
          return function(key, value) {
            return [key, plus.deepClone(value)];
          };
        })(this));
      } else {
        return object;
      }
    },
    deepExtend: function() {
      var key, object, objects, result, value, _i, _len;
      objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      result = {};
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (key in object) {
          value = object[key];
          if (_.isObject(value) && !_.isArray(value)) {
            result[key] = plus.deepExtend(result[key], value);
          } else {
            if (result[key] == null) {
              result[key] = value;
            }
          }
        }
      }
      return result;
    },
    endsWith: function(string, suffix) {
      if (suffix == null) {
        suffix = '';
      }
      if (string) {
        return string.indexOf(suffix, string.length - suffix.length) !== -1;
      } else {
        return false;
      }
    },
    escapeAttribute: function(string) {
      if (string) {
        return string.replace(/"/g, '&quot;').replace(/\n/g, '').replace(/\\/g, '-');
      } else {
        return '';
      }
    },
    escapeRegExp: function(string) {
      if (string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      } else {
        return '';
      }
    },
    humanizeEventName: function(eventName, eventDoc) {
      var event, namespace, namespaceDoc, _ref;
      _ref = eventName.split(':'), namespace = _ref[0], event = _ref[1];
      if (event == null) {
        return plus.undasherize(namespace);
      }
      namespaceDoc = plus.undasherize(namespace);
      if (eventDoc == null) {
        eventDoc = plus.undasherize(event);
      }
      return "" + namespaceDoc + ": " + eventDoc;
    },
    humanizeKey: function(key) {
      if (!key) {
        return key;
      }
      if (modifierKeyMap[key]) {
        return modifierKeyMap[key];
      } else if (key.length === 1 && (shiftKeyMap[key] != null)) {
        return [modifierKeyMap.shift, shiftKeyMap[key]];
      } else if (key.length === 1 && key === key.toUpperCase() && key.toUpperCase() !== key.toLowerCase()) {
        return [modifierKeyMap.shift, key.toUpperCase()];
      } else if (key.length === 1 || /f[0-9]{1,2}/.test(key)) {
        return key.toUpperCase();
      } else {
        return key;
      }
    },
    humanizeKeystroke: function(keystroke) {
      var humanizedKeystrokes, index, key, keys, keystrokes, splitKeystroke, _i, _j, _len, _len1;
      if (!keystroke) {
        return keystroke;
      }
      keystrokes = keystroke.split(' ');
      humanizedKeystrokes = [];
      for (_i = 0, _len = keystrokes.length; _i < _len; _i++) {
        keystroke = keystrokes[_i];
        keys = [];
        splitKeystroke = keystroke.split('-');
        for (index = _j = 0, _len1 = splitKeystroke.length; _j < _len1; index = ++_j) {
          key = splitKeystroke[index];
          if (key === '' && splitKeystroke[index - 1] === '') {
            key = '-';
          }
          if (key) {
            keys.push(plus.humanizeKey(key));
          }
        }
        humanizedKeystrokes.push(_.uniq(_.flatten(keys)).join(''));
      }
      return humanizedKeystrokes.join(' ');
    },
    isSubset: function(potentialSubset, potentialSuperset) {
      return _.every(potentialSubset, function(element) {
        return _.include(potentialSuperset, element);
      });
    },
    losslessInvert: function(hash) {
      var inverted, key, value;
      inverted = {};
      for (key in hash) {
        value = hash[key];
        if (inverted[value] == null) {
          inverted[value] = [];
        }
        inverted[value].push(key);
      }
      return inverted;
    },
    mapObject: function(object, iterator) {
      var key, newObject, value, _ref;
      newObject = {};
      for (key in object) {
        value = object[key];
        _ref = iterator(key, value), key = _ref[0], value = _ref[1];
        newObject[key] = value;
      }
      return newObject;
    },
    multiplyString: function(string, n) {
      return new Array(1 + n).join(string);
    },
    pluralize: function(count, singular, plural) {
      if (count == null) {
        count = 0;
      }
      if (plural == null) {
        plural = singular + 's';
      }
      if (count === 1) {
        return "" + count + " " + singular;
      } else {
        return "" + count + " " + plural;
      }
    },
    remove: function(array, element) {
      var index;
      index = array.indexOf(element);
      if (index >= 0) {
        array.splice(index, 1);
      }
      return array;
    },
    setValueForKeyPath: function(object, keyPath, value) {
      var key, keys;
      keys = keyPath.split('.');
      while (keys.length > 1) {
        key = keys.shift();
        if (object[key] == null) {
          object[key] = {};
        }
        object = object[key];
      }
      if (value != null) {
        return object[keys.shift()] = value;
      } else {
        return delete object[keys.shift()];
      }
    },
    hasKeyPath: function(object, keyPath) {
      var key, keys, _i, _len;
      keys = keyPath.split('.');
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        if (!object.hasOwnProperty(key)) {
          return false;
        }
        object = object[key];
      }
      return true;
    },
    spliceWithArray: function(originalArray, start, length, insertedArray, chunkSize) {
      var chunkStart, _i, _ref, _results;
      if (chunkSize == null) {
        chunkSize = 100000;
      }
      if (insertedArray.length < chunkSize) {
        return originalArray.splice.apply(originalArray, [start, length].concat(__slice.call(insertedArray)));
      } else {
        originalArray.splice(start, length);
        _results = [];
        for (chunkStart = _i = 0, _ref = insertedArray.length; chunkSize > 0 ? _i <= _ref : _i >= _ref; chunkStart = _i += chunkSize) {
          _results.push(originalArray.splice.apply(originalArray, [start + chunkStart, 0].concat(__slice.call(insertedArray.slice(chunkStart, chunkStart + chunkSize)))));
        }
        return _results;
      }
    },
    sum: function(array) {
      var elt, sum, _i, _len;
      sum = 0;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        elt = array[_i];
        sum += elt;
      }
      return sum;
    },
    uncamelcase: function(string) {
      var result;
      if (!string) {
        return '';
      }
      result = string.replace(/([A-Z])|_+/g, function(match, letter) {
        if (letter == null) {
          letter = '';
        }
        return " " + letter;
      });
      return plus.capitalize(result.trim());
    },
    undasherize: function(string) {
      if (string) {
        return string.split('-').map(plus.capitalize).join(' ');
      } else {
        return '';
      }
    },
    underscore: function(string) {
      if (!string) {
        return '';
      }
      string = string[0].toLowerCase() + string.slice(1);
      return string.replace(/([A-Z])|-+/g, function(match, letter) {
        if (letter == null) {
          letter = '';
        }
        return "_" + (letter.toLowerCase());
      });
    },
    valueForKeyPath: function(object, keyPath) {
      var key, keys, _i, _len;
      keys = keyPath.split('.');
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        object = object[key];
        if (object == null) {
          return;
        }
      }
      return object;
    },
    isEqual: function(a, b, aStack, bStack) {
      if (_.isArray(aStack) && _.isArray(bStack)) {
        return isEqual(a, b, aStack, bStack);
      } else {
        return isEqual(a, b);
      }
    },
    isEqualForProperties: function() {
      var a, b, properties, property, _i, _len;
      a = arguments[0], b = arguments[1], properties = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        property = properties[_i];
        if (!_.isEqual(a[property], b[property])) {
          return false;
        }
      }
      return true;
    }
  };

  isEqual = function(a, b, aStack, bStack) {
    var aCtor, aCtorValid, aElement, aKeyCount, aValue, bCtor, bCtorValid, bKeyCount, bValue, equal, i, key, stackIndex, _i, _len;
    if (aStack == null) {
      aStack = [];
    }
    if (bStack == null) {
      bStack = [];
    }
    if (a === b) {
      return _.isEqual(a, b);
    }
    if (_.isFunction(a) || _.isFunction(b)) {
      return _.isEqual(a, b);
    }
    stackIndex = aStack.length;
    while (stackIndex--) {
      if (aStack[stackIndex] === a) {
        return bStack[stackIndex] === b;
      }
    }
    aStack.push(a);
    bStack.push(b);
    equal = false;
    if (_.isFunction(a != null ? a.isEqual : void 0)) {
      equal = a.isEqual(b, aStack, bStack);
    } else if (_.isFunction(b != null ? b.isEqual : void 0)) {
      equal = b.isEqual(a, bStack, aStack);
    } else if (_.isArray(a) && _.isArray(b) && a.length === b.length) {
      equal = true;
      for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
        aElement = a[i];
        if (!isEqual(aElement, b[i], aStack, bStack)) {
          equal = false;
          break;
        }
      }
    } else if (_.isRegExp(a) && _.isRegExp(b)) {
      equal = _.isEqual(a, b);
    } else if (_.isObject(a) && _.isObject(b)) {
      aCtor = a.constructor;
      bCtor = b.constructor;
      aCtorValid = _.isFunction(aCtor) && aCtor instanceof aCtor;
      bCtorValid = _.isFunction(bCtor) && bCtor instanceof bCtor;
      if (aCtor !== bCtor && !(aCtorValid && bCtorValid)) {
        equal = false;
      } else {
        aKeyCount = 0;
        equal = true;
        for (key in a) {
          aValue = a[key];
          if (!_.has(a, key)) {
            continue;
          }
          aKeyCount++;
          if (!(_.has(b, key) && isEqual(aValue, b[key], aStack, bStack))) {
            equal = false;
            break;
          }
        }
        if (equal) {
          bKeyCount = 0;
          for (key in b) {
            bValue = b[key];
            if (_.has(b, key)) {
              bKeyCount++;
            }
          }
          equal = aKeyCount === bKeyCount;
        }
      }
    } else {
      equal = _.isEqual(a, b);
    }
    aStack.pop();
    bStack.pop();
    return equal;
  };

  module.exports = _.extend({}, _, plus);

}).call(this);

},{"underscore":"pRZqWN"}],37:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Inflections, root, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  Inflections = (function() {
    Inflections.prototype.defaultUncountables = ['equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'jeans', 'moose', 'deer', 'news', 'music'];

    Inflections.prototype.defaultPluralRules = [[/$/, 's'], [/s$/i, 's'], [/^(ax|test)is$/i, '$1es'], [/(octop|vir)us$/i, '$1i'], [/(octop|vir)i$/i, '$1i'], [/(alias|status)$/i, '$1es'], [/(bu)s$/i, '$1ses'], [/(buffal|tomat)o$/i, '$1oes'], [/([ti])um$/i, '$1a'], [/([ti])a$/i, '$1a'], [/sis$/i, 'ses'], [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'], [/(hive)$/i, '$1s'], [/([^aeiouy]|qu)y$/i, '$1ies'], [/(x|ch|ss|sh)$/i, '$1es'], [/(matr|vert|ind)(?:ix|ex)$/i, '$1ices'], [/(m|l)ouse$/i, '$1ice'], [/(m|l)ice$/i, '$1ice'], [/^(ox)$/i, '$1en'], [/^(oxen)$/i, '$1'], [/(quiz)$/i, '$1zes']];

    Inflections.prototype.defaultSingularRules = [[/s$/i, ''], [/(ss)$/i, '$1'], [/(n)ews$/i, '$1ews'], [/([ti])a$/i, '$1um'], [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1$2sis'], [/(^analy)(sis|ses)$/i, '$1sis'], [/([^f])ves$/i, '$1fe'], [/(hive)s$/i, '$1'], [/(tive)s$/i, '$1'], [/([lr])ves$/i, '$1f'], [/([^aeiouy]|qu)ies$/i, '$1y'], [/(s)eries$/i, '$1eries'], [/(m)ovies$/i, '$1ovie'], [/(x|ch|ss|sh)es$/i, '$1'], [/(m|l)ice$/i, '$1ouse'], [/(bus)(es)?$/i, '$1'], [/(o)es$/i, '$1'], [/(shoe)s$/i, '$1'], [/(cris|test)(is|es)$/i, '$1is'], [/^(a)x[ie]s$/i, '$1xis'], [/(octop|vir)(us|i)$/i, '$1us'], [/(alias|status)(es)?$/i, '$1'], [/^(ox)en/i, '$1'], [/(vert|ind)ices$/i, '$1ex'], [/(matr)ices$/i, '$1ix'], [/(quiz)zes$/i, '$1'], [/(database)s$/i, '$1']];

    Inflections.prototype.defaultIrregularRules = [['person', 'people'], ['man', 'men'], ['child', 'children'], ['sex', 'sexes'], ['move', 'moves'], ['cow', 'kine'], ['zombie', 'zombies']];

    Inflections.prototype.defaultHumanRules = [];

    function Inflections() {
      this.apply_inflections = __bind(this.apply_inflections, this);

      this.titleize = __bind(this.titleize, this);
      this.humanize = __bind(this.humanize, this);
      this.underscore = __bind(this.underscore, this);
      this.camelize = __bind(this.camelize, this);
      this.singularize = __bind(this.singularize, this);

      this.pluralize = __bind(this.pluralize, this);

      this.clearInflections = __bind(this.clearInflections, this);

      this.human = __bind(this.human, this);
      this.uncountable = __bind(this.uncountable, this);

      this.irregular = __bind(this.irregular, this);

      this.singular = __bind(this.singular, this);

      this.plural = __bind(this.plural, this);

      this.acronym = __bind(this.acronym, this);
      this.applyDefaultPlurals = __bind(this.applyDefaultPlurals, this);

      this.applyDefaultUncountables = __bind(this.applyDefaultUncountables, this);

      this.applyDefaultRules = __bind(this.applyDefaultRules, this);
      this.plurals = [];
      this.singulars = [];
      this.uncountables = [];
      this.humans = [];
      this.acronyms = {};
      this.applyDefaultRules();
    }

    Inflections.prototype.applyDefaultRules = function() {
      this.applyDefaultUncountables();
      this.applyDefaultPlurals();
      this.applyDefaultSingulars();
      return this.applyDefaultIrregulars();
    };

    Inflections.prototype.applyDefaultUncountables = function() {
      return this.uncountable(this.defaultUncountables);
    };

    Inflections.prototype.applyDefaultPlurals = function() {
      var _this = this;
      return _.each(this.defaultPluralRules, function(rule) {
        var capture, regex;
        regex = rule[0], capture = rule[1];
        return _this.plural(regex, capture);
      });
    };

    Inflections.prototype.applyDefaultSingulars = function() {
      var _this = this;
      return _.each(this.defaultSingularRules, function(rule) {
        var capture, regex;
        regex = rule[0], capture = rule[1];
        return _this.singular(regex, capture);
      });
    };

    Inflections.prototype.applyDefaultIrregulars = function() {
      var _this = this;
      return _.each(this.defaultIrregularRules, function(rule) {
        var plural, singular;
        singular = rule[0], plural = rule[1];
        return _this.irregular(singular, plural);
      });
    };

    Inflections.prototype.acronym = function(word) {
      this.acronyms[word.toLowerCase()] = word;
      return this.acronym_matchers = _.values(this.acronyms).join("|");
    };

    Inflections.prototype.plural = function(rule, replacement) {
      if (typeof rule === 'string') {
        delete this.uncountables[_.indexOf(this.uncountables, rule)];
      }
      delete this.uncountables[_.indexOf(this.uncountables, replacement)];
      return this.plurals.unshift([rule, replacement]);
    };

    Inflections.prototype.singular = function(rule, replacement) {
      if (typeof rule === 'string') {
        delete this.uncountables[_.indexOf(this.uncountables, rule)];
      }
      delete this.uncountables[_.indexOf(this.uncountables, replacement)];
      return this.singulars.unshift([rule, replacement]);
    };

    Inflections.prototype.irregular = function(singular, plural) {
      delete this.uncountables[_.indexOf(this.uncountables, singular)];
      delete this.uncountables[_.indexOf(this.uncountables, plural)];
      if (singular.substring(0, 1).toUpperCase() === plural.substring(0, 1).toUpperCase()) {
        this.plural(new RegExp("(" + (singular.substring(0, 1)) + ")" + (singular.substring(1, plural.length)) + "$", "i"), '$1' + plural.substring(1, plural.length));
        this.plural(new RegExp("(" + (plural.substring(0, 1)) + ")" + (plural.substring(1, plural.length)) + "$", "i"), '$1' + plural.substring(1, plural.length));
        return this.singular(new RegExp("(" + (plural.substring(0, 1)) + ")" + (plural.substring(1, plural.length)) + "$", "i"), '$1' + singular.substring(1, plural.length));
      } else {
        this.plural(new RegExp("" + (singular.substring(0, 1)) + (singular.substring(1, plural.length)) + "$", "i"), plural.substring(0, 1) + plural.substring(1, plural.length));
        this.plural(new RegExp("" + (singular.substring(0, 1)) + (singular.substring(1, plural.length)) + "$", "i"), plural.substring(0, 1) + plural.substring(1, plural.length));
        this.plural(new RegExp("" + (plural.substring(0, 1)) + (plural.substring(1, plural.length)) + "$", "i"), plural.substring(0, 1) + plural.substring(1, plural.length));
        this.plural(new RegExp("" + (plural.substring(0, 1)) + (plural.substring(1, plural.length)) + "$", "i"), plural.substring(0, 1) + plural.substring(1, plural.length));
        this.singular(new RegExp("" + (plural.substring(0, 1)) + (plural.substring(1, plural.length)) + "$", "i"), singular.substring(0, 1) + singular.substring(1, plural.length));
        return this.singular(new RegExp("" + (plural.substring(0, 1)) + (plural.substring(1, plural.length)) + "$", "i"), singular.substring(0, 1) + singular.substring(1, plural.length));
      }
    };

    Inflections.prototype.uncountable = function() {
      var words;
      words = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.uncountables.push(words);
      return this.uncountables = _.flatten(this.uncountables);
    };

    Inflections.prototype.human = function(rule, replacement) {
      return this.humans.unshift([rule, replacement]);
    };

    Inflections.prototype.clearInflections = function(scope) {
      if (scope == null) {
        scope = 'all';
      }
      return this[scope] = [];
    };

    Inflections.prototype.pluralize = function(word, count, options) {
      var result, _ref;
      if (options == null) {
        options = {};
      }
      options = _.extend({
        plural: void 0,
        showNumber: true
      }, options);
      if (count !== void 0) {
        result = "";
        if (options.showNumber === true) {
          result += "" + (count != null ? count : 0) + " ";
        }
        return result += count === 1 || (count != null ? typeof count.toString === "function" ? count.toString().match(/^1(\.0+)?$/) : void 0 : void 0) ? word : (_ref = options.plural) != null ? _ref : this.pluralize(word);
      } else {
        return this.apply_inflections(word, this.plurals);
      }
    };

    Inflections.prototype.singularize = function(word) {
      return this.apply_inflections(word, this.singulars);
    };

    Inflections.prototype.camelize = function(term, uppercase_first_letter) {
      var _this = this;
      if (uppercase_first_letter == null) {
        uppercase_first_letter = true;
      }
      if (uppercase_first_letter) {
        term = term.replace(/^[a-z\d]*/, function(a) {
          return _this.acronyms[a] || _.capitalize(a);
        });
      } else {
        term = term.replace(RegExp("^(?:" + this.acronym_matchers + "(?=\\b|[A-Z_])|\\w)"), function(a) {
          return a.toLowerCase();
        });
      }
      return term = term.replace(/(?:_|(\/))([a-z\d]*)/gi, function(match, $1, $2, idx, string) {
        $1 || ($1 = '');
        return "" + $1 + (_this.acronyms[$2] || _.capitalize($2));
      });
    };

    Inflections.prototype.underscore = function(camel_cased_word) {
      var word;
      word = camel_cased_word;
      word = word.replace(RegExp("(?:([A-Za-z\\d])|^)(" + this.acronym_matchers + ")(?=\\b|[^a-z])", "g"), function(match, $1, $2) {
        return "" + ($1 || '') + ($1 ? '_' : '') + ($2.toLowerCase());
      });
      word = word.replace(/([A-Z\d]+)([A-Z][a-z])/g, "$1_$2");
      word = word.replace(/([a-z\d])([A-Z])/g, "$1_$2");
      word = word.replace('-', '_');
      return word = word.toLowerCase();
    };

    Inflections.prototype.humanize = function(lower_case_and_underscored_word) {
      var human, replacement, rule, word, _i, _len, _ref,
        _this = this;
      word = lower_case_and_underscored_word;
      _ref = this.humans;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        human = _ref[_i];
        rule = human[0];
        replacement = human[1];
        if (((rule.test != null) && rule.test(word)) || ((rule.indexOf != null) && word.indexOf(rule) >= 0)) {
          word = word.replace(rule, replacement);
          break;
        }
      }
      word = word.replace(/_id$/g, '');
      word = word.replace(/_/g, ' ');
      word = word.replace(/([a-z\d]*)/gi, function(match) {
        return _this.acronyms[match] || match.toLowerCase();
      });
      return word = _.trim(word).replace(/^\w/g, function(match) {
        return match.toUpperCase();
      });
    };

    Inflections.prototype.titleize = function(word) {
      return this.humanize(this.underscore(word)).replace(/([\s¿]+)([a-z])/g, function(match, boundary, letter, idx, string) {
        return match.replace(letter, letter.toUpperCase());
      });
    };

    Inflections.prototype.apply_inflections = function(word, rules) {
      var capture, match, regex, result, rule, _i, _len;
      if (!word) {
        return word;
      } else {
        result = word;
        match = result.toLowerCase().match(/\b\w+$/);
        if (match && _.indexOf(this.uncountables, match[0]) !== -1) {
          return result;
        } else {
          for (_i = 0, _len = rules.length; _i < _len; _i++) {
            rule = rules[_i];
            regex = rule[0], capture = rule[1];
            if (result.match(regex)) {
              result = result.replace(regex, capture);
              break;
            }
          }
          return result;
        }
      }
    };

    return Inflections;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  _ = root._ || require('underscore');

  if (typeof require !== "undefined" && require !== null) {
    _.str = require('underscore.string');
    _.mixin(_.str.exports());
    _.str.include('Underscore.string', 'string');
  } else {
    _.mixin(_.str.exports());
  }

  if (typeof exports === 'undefined') {
    _.mixin(new Inflections);
  } else {
    module.exports = new Inflections;
  }

}).call(this);

},{"underscore":"pRZqWN","underscore.string":38}],38:[function(require,module,exports){
//  Underscore.string
//  (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
//  Underscore.string is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/epeli/underscore.string
//  Some code is borrowed from MooTools and Alexandru Marasteanu.
//  Version '2.3.2'

!function(root, String){
  'use strict';

  // Defining helper functions.

  var nativeTrim = String.prototype.trim;
  var nativeTrimRight = String.prototype.trimRight;
  var nativeTrimLeft = String.prototype.trimLeft;

  var parseNumber = function(source) { return source * 1 || 0; };

  var strRepeat = function(str, qty){
    if (qty < 1) return '';
    var result = '';
    while (qty > 0) {
      if (qty & 1) result += str;
      qty >>= 1, str += str;
    }
    return result;
  };

  var slice = [].slice;

  var defaultToWhiteSpace = function(characters) {
    if (characters == null)
      return '\\s';
    else if (characters.source)
      return characters.source;
    else
      return '[' + _s.escapeRegExp(characters) + ']';
  };

  // Helper for toBoolean
  function boolMatch(s, matchers) {
    var i, matcher, down = s.toLowerCase();
    matchers = [].concat(matchers);
    for (i = 0; i < matchers.length; i += 1) {
      matcher = matchers[i];
      if (!matcher) continue;
      if (matcher.test && matcher.test(s)) return true;
      if (matcher.toLowerCase() === down) return true;
    }
  }

  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    amp: '&',
    apos: "'"
  };

  var reversedEscapeChars = {};
  for(var key in escapeChars) reversedEscapeChars[escapeChars[key]] = key;
  reversedEscapeChars["'"] = '#39';

  // sprintf() for JavaScript 0.7-beta1
  // http://www.diveintojavascript.com/projects/javascript-sprintf
  //
  // Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
  // All rights reserved.

  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    var str_repeat = strRepeat;

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          } else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
          }
          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw new Error('[_.sprintf] huh?');
                }
              }
            }
            else {
              throw new Error('[_.sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw new Error('[_.sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();



  // Defining underscore.string

  var _s = {

    VERSION: '2.3.0',

    isBlank: function(str){
      if (str == null) str = '';
      return (/^\s*$/).test(str);
    },

    stripTags: function(str){
      if (str == null) return '';
      return String(str).replace(/<\/?[^>]+>/g, '');
    },

    capitalize : function(str){
      str = str == null ? '' : String(str);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    chop: function(str, step){
      if (str == null) return [];
      str = String(str);
      step = ~~step;
      return step > 0 ? str.match(new RegExp('.{1,' + step + '}', 'g')) : [str];
    },

    clean: function(str){
      return _s.strip(str).replace(/\s+/g, ' ');
    },

    count: function(str, substr){
      if (str == null || substr == null) return 0;

      str = String(str);
      substr = String(substr);

      var count = 0,
        pos = 0,
        length = substr.length;

      while (true) {
        pos = str.indexOf(substr, pos);
        if (pos === -1) break;
        count++;
        pos += length;
      }

      return count;
    },

    chars: function(str) {
      if (str == null) return [];
      return String(str).split('');
    },

    swapCase: function(str) {
      if (str == null) return '';
      return String(str).replace(/\S/g, function(c){
        return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
      });
    },

    escapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; });
    },

    unescapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      });
    },

    escapeRegExp: function(str){
      if (str == null) return '';
      return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    },

    splice: function(str, i, howmany, substr){
      var arr = _s.chars(str);
      arr.splice(~~i, ~~howmany, substr);
      return arr.join('');
    },

    insert: function(str, i, substr){
      return _s.splice(str, i, 0, substr);
    },

    include: function(str, needle){
      if (needle === '') return true;
      if (str == null) return false;
      return String(str).indexOf(needle) !== -1;
    },

    join: function() {
      var args = slice.call(arguments),
        separator = args.shift();

      if (separator == null) separator = '';

      return args.join(separator);
    },

    lines: function(str) {
      if (str == null) return [];
      return String(str).split("\n");
    },

    reverse: function(str){
      return _s.chars(str).reverse().join('');
    },

    startsWith: function(str, starts){
      if (starts === '') return true;
      if (str == null || starts == null) return false;
      str = String(str); starts = String(starts);
      return str.length >= starts.length && str.slice(0, starts.length) === starts;
    },

    endsWith: function(str, ends){
      if (ends === '') return true;
      if (str == null || ends == null) return false;
      str = String(str); ends = String(ends);
      return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
    },

    succ: function(str){
      if (str == null) return '';
      str = String(str);
      return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length-1) + 1);
    },

    titleize: function(str){
      if (str == null) return '';
      str  = String(str).toLowerCase();
      return str.replace(/(?:^|\s|-)\S/g, function(c){ return c.toUpperCase(); });
    },

    camelize: function(str){
      return _s.trim(str).replace(/[-_\s]+(.)?/g, function(match, c){ return c ? c.toUpperCase() : ""; });
    },

    underscored: function(str){
      return _s.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
    },

    dasherize: function(str){
      return _s.trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
    },

    classify: function(str){
      return _s.titleize(String(str).replace(/[\W_]/g, ' ')).replace(/\s/g, '');
    },

    humanize: function(str){
      return _s.capitalize(_s.underscored(str).replace(/_id$/,'').replace(/_/g, ' '));
    },

    trim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrim) return nativeTrim.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
    },

    ltrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('^' + characters + '+'), '');
    },

    rtrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp(characters + '+$'), '');
    },

    truncate: function(str, length, truncateStr){
      if (str == null) return '';
      str = String(str); truncateStr = truncateStr || '...';
      length = ~~length;
      return str.length > length ? str.slice(0, length) + truncateStr : str;
    },

    /**
     * _s.prune: a more elegant version of truncate
     * prune extra chars, never leaving a half-chopped word.
     * @author github.com/rwz
     */
    prune: function(str, length, pruneStr){
      if (str == null) return '';

      str = String(str); length = ~~length;
      pruneStr = pruneStr != null ? String(pruneStr) : '...';

      if (str.length <= length) return str;

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = _s.rtrim(template.slice(0, template.length-1));

      return (template+pruneStr).length > str.length ? str : str.slice(0, template.length)+pruneStr;
    },

    words: function(str, delimiter) {
      if (_s.isBlank(str)) return [];
      return _s.trim(str, delimiter).split(delimiter || /\s+/);
    },

    pad: function(str, length, padStr, type) {
      str = str == null ? '' : String(str);
      length = ~~length;

      var padlen  = 0;

      if (!padStr)
        padStr = ' ';
      else if (padStr.length > 1)
        padStr = padStr.charAt(0);

      switch(type) {
        case 'right':
          padlen = length - str.length;
          return str + strRepeat(padStr, padlen);
        case 'both':
          padlen = length - str.length;
          return strRepeat(padStr, Math.ceil(padlen/2)) + str
                  + strRepeat(padStr, Math.floor(padlen/2));
        default: // 'left'
          padlen = length - str.length;
          return strRepeat(padStr, padlen) + str;
        }
    },

    lpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr);
    },

    rpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'right');
    },

    lrpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'both');
    },

    sprintf: sprintf,

    vsprintf: function(fmt, argv){
      argv.unshift(fmt);
      return sprintf.apply(null, argv);
    },

    toNumber: function(str, decimals) {
      if (!str) return 0;
      str = _s.trim(str);
      if (!str.match(/^-?\d+(?:\.\d+)?$/)) return NaN;
      return parseNumber(parseNumber(str).toFixed(~~decimals));
    },

    numberFormat : function(number, dec, dsep, tsep) {
      if (isNaN(number) || number == null) return '';

      number = number.toFixed(~~dec);
      tsep = typeof tsep == 'string' ? tsep : ',';

      var parts = number.split('.'), fnums = parts[0],
        decimals = parts[1] ? (dsep || '.') + parts[1] : '';

      return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
    },

    strRight: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strRightBack: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.lastIndexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strLeft: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    strLeftBack: function(str, sep){
      if (str == null) return '';
      str += ''; sep = sep != null ? ''+sep : sep;
      var pos = str.lastIndexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    toSentence: function(array, separator, lastSeparator, serial) {
      separator = separator || ', ';
      lastSeparator = lastSeparator || ' and ';
      var a = array.slice(), lastMember = a.pop();

      if (array.length > 2 && serial) lastSeparator = _s.rtrim(separator) + lastSeparator;

      return a.length ? a.join(separator) + lastSeparator + lastMember : lastMember;
    },

    toSentenceSerial: function() {
      var args = slice.call(arguments);
      args[3] = true;
      return _s.toSentence.apply(_s, args);
    },

    slugify: function(str) {
      if (str == null) return '';

      var from  = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",
          to    = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",
          regex = new RegExp(defaultToWhiteSpace(from), 'g');

      str = String(str).toLowerCase().replace(regex, function(c){
        var index = from.indexOf(c);
        return to.charAt(index) || '-';
      });

      return _s.dasherize(str.replace(/[^\w\s-]/g, ''));
    },

    surround: function(str, wrapper) {
      return [wrapper, str, wrapper].join('');
    },

    quote: function(str, quoteChar) {
      return _s.surround(str, quoteChar || '"');
    },

    unquote: function(str, quoteChar) {
      quoteChar = quoteChar || '"';
      if (str[0] === quoteChar && str[str.length-1] === quoteChar)
        return str.slice(1,str.length-1);
      else return str;
    },

    exports: function() {
      var result = {};

      for (var prop in this) {
        if (!this.hasOwnProperty(prop) || prop.match(/^(?:include|contains|reverse)$/)) continue;
        result[prop] = this[prop];
      }

      return result;
    },

    repeat: function(str, qty, separator){
      if (str == null) return '';

      qty = ~~qty;

      // using faster implementation if separator is not needed;
      if (separator == null) return strRepeat(String(str), qty);

      // this one is about 300x slower in Google Chrome
      for (var repeat = []; qty > 0; repeat[--qty] = str) {}
      return repeat.join(separator);
    },

    naturalCmp: function(str1, str2){
      if (str1 == str2) return 0;
      if (!str1) return -1;
      if (!str2) return 1;

      var cmpRegex = /(\.\d+)|(\d+)|(\D+)/g,
        tokens1 = String(str1).toLowerCase().match(cmpRegex),
        tokens2 = String(str2).toLowerCase().match(cmpRegex),
        count = Math.min(tokens1.length, tokens2.length);

      for(var i = 0; i < count; i++) {
        var a = tokens1[i], b = tokens2[i];

        if (a !== b){
          var num1 = parseInt(a, 10);
          if (!isNaN(num1)){
            var num2 = parseInt(b, 10);
            if (!isNaN(num2) && num1 - num2)
              return num1 - num2;
          }
          return a < b ? -1 : 1;
        }
      }

      if (tokens1.length === tokens2.length)
        return tokens1.length - tokens2.length;

      return str1 < str2 ? -1 : 1;
    },

    levenshtein: function(str1, str2) {
      if (str1 == null && str2 == null) return 0;
      if (str1 == null) return String(str2).length;
      if (str2 == null) return String(str1).length;

      str1 = String(str1); str2 = String(str2);

      var current = [], prev, value;

      for (var i = 0; i <= str2.length; i++)
        for (var j = 0; j <= str1.length; j++) {
          if (i && j)
            if (str1.charAt(j - 1) === str2.charAt(i - 1))
              value = prev;
            else
              value = Math.min(current[j], current[j - 1], prev) + 1;
          else
            value = i + j;

          prev = current[j];
          current[j] = value;
        }

      return current.pop();
    },

    toBoolean: function(str, trueValues, falseValues) {
      if (typeof str === "number") str = "" + str;
      if (typeof str !== "string") return !!str;
      str = _s.trim(str);
      if (boolMatch(str, trueValues || ["true", "1"])) return true;
      if (boolMatch(str, falseValues || ["false", "0"])) return false;
    }
  };

  // Aliases

  _s.strip    = _s.trim;
  _s.lstrip   = _s.ltrim;
  _s.rstrip   = _s.rtrim;
  _s.center   = _s.lrpad;
  _s.rjust    = _s.lpad;
  _s.ljust    = _s.rpad;
  _s.contains = _s.include;
  _s.q        = _s.quote;
  _s.toBool   = _s.toBoolean;

  // Exporting

  // CommonJS module is defined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = _s;

    exports._s = _s;
  }

  // Register as a named module with AMD.
  if (typeof define === 'function' && define.amd)
    define('underscore.string', [], function(){ return _s; });


  // Integrate with Underscore.js if defined
  // or create our own underscore object.
  root._ = root._ || {};
  root._.string = root._.str = _s;
}(this, String);

},{}]},{},[1])
(1)
});
(function() {
  var $, Ajax, AttributeTracking, Base, Builder, ClassMethods, Collection, Controller, Events, Extend, Include, Instance, Model, Module, Queue, Ryggrad, Singleton, View, association, callAttachHook, elements, escapeRegExp, events, hashStrip, idCounter, isArray, isBlank, jQuery, makeArray, methodName, moduleKeywords, namedParam, originalCleanData, root, singularize, splatParam, underscore, voidElements, _fn, _fn1, _i, _j, _len, _len1, _ref, _ref1,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Ryggrad = {};

  Ryggrad.version = "0.0.1";

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.Ryggrad = Ryggrad;

  Ryggrad.Util = (function() {
    function Util() {}

    Util.prototype.getInputValue = function(el) {
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
    };

    return Util;

  })();

  jQuery = window.jQuery || window.Zepto;

  $ = jQuery;

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

  $.extend($.fn.hasEvent);

  if (typeof Object.create !== 'function') {
    Object.create = function(o) {
      var Func;
      Func = function() {};
      Func.prototype = o;
      return new Func();
    };
  }

  isArray = function(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };

  isBlank = function(value) {
    var key;
    if (!value) {
      return true;
    }
    for (key in value) {
      return false;
    }
    return true;
  };

  makeArray = function(args) {
    return Array.prototype.slice.call(args, 0);
  };

  moduleKeywords = ['included', 'extended'];

  Module = (function() {
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

  Ryggrad.Module = Module;

  Events = {
    bind: function(ev, callback) {
      var calls, evs, name, _i, _len;
      evs = ev.split(' ');
      calls = this.hasOwnProperty('_callbacks') && this._callbacks || (this._callbacks = {});
      for (_i = 0, _len = evs.length; _i < _len; _i++) {
        name = evs[_i];
        calls[name] || (calls[name] = []);
        calls[name].push(callback);
      }
      return this;
    },
    trigger: function() {
      var args, callback, ev, list, _i, _len, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      ev = args.shift();
      list = this.hasOwnProperty('_callbacks') && ((_ref = this._callbacks) != null ? _ref[ev] : void 0);
      if (!list) {
        return;
      }
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        callback = list[_i];
        if (callback.apply(this, args) === false) {
          break;
        }
      }
      return true;
    },
    listenTo: function(obj, ev, callback) {
      obj.bind(ev, callback);
      this.listeningTo || (this.listeningTo = []);
      this.listeningTo.push({
        obj: obj,
        ev: ev,
        callback: callback
      });
      return this;
    },
    listenToOnce: function(obj, ev, callback) {
      var handler, listeningToOnce;
      listeningToOnce = this.listeningToOnce || (this.listeningToOnce = []);
      obj.bind(ev, handler = function() {
        var i, idx, lt, _i, _len;
        idx = -1;
        for (i = _i = 0, _len = listeningToOnce.length; _i < _len; i = ++_i) {
          lt = listeningToOnce[i];
          if (lt.obj === obj) {
            if (lt.ev === ev && lt.callback === callback) {
              idx = i;
            }
          }
        }
        obj.unbind(ev, handler);
        if (idx !== -1) {
          listeningToOnce.splice(idx, 1);
        }
        return callback.apply(this, arguments);
      });
      listeningToOnce.push({
        obj: obj,
        ev: ev,
        callback: callback,
        handler: handler
      });
      return this;
    },
    stopListening: function(obj, events, callback) {
      var ev, evts, i, idx, listeningTo, lt, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;
      if (arguments.length === 0) {
        _ref = [this.listeningTo, this.listeningToOnce];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          listeningTo = _ref[_i];
          if (!listeningTo) {
            continue;
          }
          for (_j = 0, _len1 = listeningTo.length; _j < _len1; _j++) {
            lt = listeningTo[_j];
            lt.obj.unbind(lt.ev, lt.handler || lt.callback);
          }
        }
        this.listeningTo = void 0;
        return this.listeningToOnce = void 0;
      } else if (obj) {
        _ref1 = [this.listeningTo, this.listeningToOnce];
        _results = [];
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          listeningTo = _ref1[_k];
          if (!listeningTo) {
            continue;
          }
          events = events ? events.split(' ') : [void 0];
          _results.push((function() {
            var _l, _len3, _results1;
            _results1 = [];
            for (_l = 0, _len3 = events.length; _l < _len3; _l++) {
              ev = events[_l];
              _results1.push((function() {
                var _m, _ref2, _results2;
                _results2 = [];
                for (idx = _m = _ref2 = listeningTo.length - 1; _ref2 <= 0 ? _m <= 0 : _m >= 0; idx = _ref2 <= 0 ? ++_m : --_m) {
                  lt = listeningTo[idx];
                  if ((!ev) || (ev === lt.ev)) {
                    lt.obj.unbind(lt.ev, lt.handler || lt.callback);
                    if (idx !== -1) {
                      _results2.push(listeningTo.splice(idx, 1));
                    } else {
                      _results2.push(void 0);
                    }
                  } else if (ev) {
                    evts = lt.ev.split(' ');
                    if (~(i = evts.indexOf(ev))) {
                      evts.splice(i, 1);
                      lt.ev = $.trim(evts.join(' '));
                      _results2.push(lt.obj.unbind(ev, lt.handler || lt.callback));
                    } else {
                      _results2.push(void 0);
                    }
                  } else {
                    _results2.push(void 0);
                  }
                }
                return _results2;
              })());
            }
            return _results1;
          })());
        }
        return _results;
      }
    },
    unbind: function(ev, callback) {
      var cb, i, list, _i, _len, _ref;
      if (!ev) {
        this._callbacks = {};
        return this;
      }
      list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
      if (!list) {
        return this;
      }
      if (!callback) {
        delete this._callbacks[ev];
        return this;
      }
      for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
        cb = list[i];
        if (!(cb === callback)) {
          continue;
        }
        list = list.slice();
        list.splice(i, 1);
        this._callbacks[ev] = list;
        break;
      }
      return this;
    }
  };

  Ryggrad.Events = Events;

  Ryggrad.Module.extend.call(Ryggrad, Events);

  Ryggrad.Model = (function(_super) {
    __extends(Model, _super);

    Model.extend(Ryggrad.Events);

    Model.records = [];

    Model.irecords = {};

    Model.attributes = [];

    Model.configure = function() {
      var attributes, name;
      name = arguments[0], attributes = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.className = name;
      this.deleteAll();
      if (attributes.length) {
        this.attributes = attributes;
      }
      this.attributes && (this.attributes = makeArray(this.attributes));
      this.attributes || (this.attributes = []);
      this.unbind();
      return this;
    };

    Model.toString = function() {
      return "" + this.className + "(" + (this.attributes.join(", ")) + ")";
    };

    Model.create = function(atts, options) {
      var record;
      record = new this(atts);
      return record.save(options);
    };

    Model.exists = function(id) {
      var _ref;
      return (_ref = this.irecords[id]) != null ? _ref.clone() : void 0;
    };

    Model.find = function(id) {
      var record;
      record = this.exists(id);
      if (!record) {
        throw new Error("\"" + this.className + "\" model could not find a record for the ID \"" + id + "\"");
      }
      return record;
    };

    Model.update = function(id, atts, options) {
      return this.find(id).updateAttributes(atts, options);
    };

    Model.destroy = function(id, options) {
      return this.find(id).destroy(options);
    };

    Model.fetch = function(callbackOrParams) {
      if (typeof callbackOrParams === 'function') {
        return this.bind('fetch', callbackOrParams);
      } else {
        return this.trigger.apply(this, ['fetch'].concat(__slice.call(arguments)));
      }
    };

    Model.change = function(callbackOrParams) {
      if (typeof callbackOrParams === 'function') {
        return this.bind('change', callbackOrParams);
      } else {
        return this.trigger.apply(this, ['change'].concat(__slice.call(arguments)));
      }
    };

    Model.addRecord = function(record) {
      if (record.id && this.irecords[record.id]) {
        this.irecords[record.id].remove();
      }
      record.id || (record.id = record.uid);
      this.records.push(record);
      this.irecords[record.id] = record;
      return this.irecords[record.uid] = record;
    };

    Model.deleteAll = function() {
      this.records = [];
      return this.irecords = {};
    };

    Model.refresh = function(values, options) {
      var record, records, result, _i, _len;
      if (options == null) {
        options = {};
      }
      if (options.clear) {
        this.deleteAll();
      }
      records = this.fromJSON(values);
      if (!isArray(records)) {
        records = [records];
      }
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        this.addRecord(record);
      }
      this.sort();
      result = this.cloneArray(records);
      this.trigger('refresh', result, options);
      return result;
    };

    Model.toJSON = function() {
      return this.records;
    };

    Model.fromJSON = function(objects) {
      var value, _i, _len, _results;
      if (!objects) {
        return;
      }
      if (typeof objects === 'string') {
        objects = JSON.parse(objects);
      }
      if (isArray(objects)) {
        _results = [];
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          value = objects[_i];
          _results.push(new this(value));
        }
        return _results;
      } else {
        return new this(objects);
      }
    };

    Model.sort = function() {
      if (this.comparator) {
        this.records.sort(this.comparator);
      }
      return this;
    };

    Model.findBy = function(name, value) {
      var record, _i, _len, _ref;
      _ref = this.records;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        record = _ref[_i];
        if (record[name] === value) {
          return record.clone();
        }
      }
      return null;
    };

    Model.findAllBy = function(name, value) {
      return this.select(function(item) {
        return item[name] === value;
      });
    };

    Model.select = function(callback) {
      var record, _i, _len, _ref, _results;
      _ref = this.records;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        record = _ref[_i];
        if (callback(record)) {
          _results.push(record.clone());
        }
      }
      return _results;
    };

    Model.each = function(callback) {
      var record, _i, _len, _ref, _results;
      _ref = this.records;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        record = _ref[_i];
        _results.push(callback(record.clone()));
      }
      return _results;
    };

    Model.all = function() {
      return this.cloneArray(this.records);
    };

    Model.first = function() {
      var _ref;
      return (_ref = this.records[0]) != null ? _ref.clone() : void 0;
    };

    Model.last = function() {
      var _ref;
      return (_ref = this.records[this.records.length - 1]) != null ? _ref.clone() : void 0;
    };

    Model.count = function() {
      return this.records.length;
    };

    Model.recordsValues = function() {
      var key, result, value, _ref;
      result = [];
      _ref = this.records;
      for (key in _ref) {
        value = _ref[key];
        result.push(value);
      }
      return result;
    };

    Model.destroyAll = function(options) {
      var record, _i, _len, _ref, _results;
      _ref = this.records;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        record = _ref[_i];
        _results.push(record.destroy(options));
      }
      return _results;
    };

    Model.cloneArray = function(array) {
      var value, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        _results.push(value.clone());
      }
      return _results;
    };

    Model.idCounter = 0;

    Model.uid = function(prefix) {
      var uid;
      if (prefix == null) {
        prefix = '';
      }
      uid = prefix + this.idCounter++;
      if (this.exists(uid)) {
        uid = this.uid(prefix);
      }
      return uid;
    };

    function Model(attributes) {
      Model.__super__.constructor.apply(this, arguments);
      this.className = this.constructor.name;
      if (attributes) {
        this.load(attributes);
      }
      this.uid = (typeof atts !== "undefined" && atts !== null ? atts.uid : void 0) || this.constructor.uid("uid-");
    }

    Model.prototype.isNew = function() {
      return !this.exists();
    };

    Model.prototype.isValid = function() {
      return !this.validate();
    };

    Model.prototype.validate = function() {};

    Model.prototype.load = function(atts) {
      var key, value;
      if (atts.id) {
        this.id = atts.id;
      }
      for (key in atts) {
        value = atts[key];
        if (atts.hasOwnProperty(key) && typeof this[key] === 'function') {
          this[key](value);
        } else {
          this[key] = value;
        }
      }
      return this;
    };

    Model.prototype.attributes = function() {
      var key, result, _i, _len, _ref;
      result = {};
      _ref = this.constructor.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (key in this) {
          if (typeof this[key] === 'function') {
            result[key] = this[key]();
          } else {
            result[key] = this[key];
          }
        }
      }
      if (this.id) {
        result.id = this.id;
      }
      return result;
    };

    Model.prototype.eql = function(rec) {
      return !!(rec && rec.constructor === this.constructor && ((rec.uid === this.uid) || (rec.id && rec.id === this.id)));
    };

    Model.prototype.save = function(options) {
      var error, record;
      if (options == null) {
        options = {};
      }
      if (options.validate !== false) {
        error = this.validate();
        if (error) {
          this.trigger('error', error);
          return false;
        }
      }
      this.trigger('beforeSave', options);
      record = this.isNew() ? this.create(options) : this.update(options);
      this.stripCloneAttrs();
      this.trigger('save', options);
      return record;
    };

    Model.prototype.stripCloneAttrs = function() {
      var key, value;
      if (this.hasOwnProperty('uid')) {
        return;
      }
      for (key in this) {
        if (!__hasProp.call(this, key)) continue;
        value = this[key];
        if (this.constructor.attributes.indexOf(key) > -1) {
          delete this[key];
        }
      }
      return this;
    };

    Model.prototype.updateAttribute = function(name, value, options) {
      var atts;
      atts = {};
      atts[name] = value;
      return this.updateAttributes(atts, options);
    };

    Model.prototype.updateAttributes = function(atts, options) {
      this.load(atts);
      return this.save(options);
    };

    Model.prototype.changeID = function(id) {
      var records;
      if (id === this.id) {
        return;
      }
      records = this.constructor.irecords;
      records[id] = records[this.id];
      delete records[this.id];
      this.id = id;
      return this.save();
    };

    Model.prototype.changeUID = function(uid) {
      var records;
      records = this.constructor.irecords;
      records[uid] = records[this.uid];
      delete records[this.uid];
      this.uid = uid;
      return this.save();
    };

    Model.prototype.remove = function() {
      var i, record, records, _i, _len;
      records = this.constructor.records.slice(0);
      for (i = _i = 0, _len = records.length; _i < _len; i = ++_i) {
        record = records[i];
        if (!(this.eql(record))) {
          continue;
        }
        records.splice(i, 1);
        break;
      }
      this.constructor.records = records;
      delete this.constructor.irecords[this.id];
      return delete this.constructor.irecords[this.uid];
    };

    Model.prototype.destroy = function(options) {
      if (options == null) {
        options = {};
      }
      this.trigger('beforeDestroy', options);
      this.remove();
      this.destroyed = true;
      this.trigger('destroy', options);
      this.trigger('change', 'destroy', options);
      if (this.listeningTo) {
        this.stopListening();
      }
      this.unbind();
      return this;
    };

    Model.prototype.dup = function(newRecord) {
      var atts;
      if (newRecord == null) {
        newRecord = true;
      }
      atts = this.attributes();
      if (newRecord) {
        delete atts.id;
      } else {
        atts.uid = this.uid;
      }
      return new this.constructor(atts);
    };

    Model.prototype.clone = function() {
      return Object.create(this);
    };

    Model.prototype.reload = function() {
      var original;
      if (this.isNew()) {
        return this;
      }
      original = this.constructor.find(this.id);
      this.load(original.attributes());
      return original;
    };

    Model.prototype.refresh = function(data) {
      root = this.constructor.irecords[this.id];
      root.load(data);
      this.trigger('refresh');
      return this;
    };

    Model.prototype.exists = function() {
      return this.constructor.exists(this.id);
    };

    Model.prototype.update = function(options) {
      var clone, records;
      this.trigger('beforeUpdate', options);
      records = this.constructor.irecords;
      records[this.id].load(this.attributes());
      this.constructor.sort();
      clone = records[this.id].clone();
      clone.trigger('update', options);
      clone.trigger('change', 'update', options);
      return clone;
    };

    Model.prototype.create = function(options) {
      var clone, record;
      this.trigger('beforeCreate', options);
      this.id || (this.id = this.uid);
      record = this.dup(false);
      this.constructor.addRecord(record);
      this.constructor.sort();
      clone = record.clone();
      clone.trigger('create', options);
      clone.trigger('change', 'create', options);
      return clone;
    };

    Model.prototype.bind = function(events, callback) {
      var binder, singleEvent, _fn, _i, _len, _ref,
        _this = this;
      this.constructor.bind(events, binder = function(record) {
        if (record && _this.eql(record)) {
          return callback.apply(_this, arguments);
        }
      });
      _ref = events.split(' ');
      _fn = function(singleEvent) {
        var unbinder;
        return _this.constructor.bind("unbind", unbinder = function(record, event, cb) {
          if (record && _this.eql(record)) {
            if (event && event !== singleEvent) {
              return;
            }
            if (cb && cb !== callback) {
              return;
            }
            _this.constructor.unbind(singleEvent, binder);
            return _this.constructor.unbind("unbind", unbinder);
          }
        });
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        singleEvent = _ref[_i];
        _fn(singleEvent);
      }
      return this;
    };

    Model.prototype.one = function(events, callback) {
      var handler,
        _this = this;
      return this.bind(events, handler = function() {
        _this.unbind(events, handler);
        return callback.apply(_this, arguments);
      });
    };

    Model.prototype.trigger = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      args.splice(1, 0, this);
      return (_ref = this.constructor).trigger.apply(_ref, args);
    };

    Model.prototype.listenTo = function() {
      return Ryggrad.Events.listenTo.apply(this, arguments);
    };

    Model.prototype.listenToOnce = function() {
      return Ryggrad.Events.listenToOnce.apply(this, arguments);
    };

    Model.prototype.stopListening = function() {
      return Ryggrad.Events.stopListening.apply(this, arguments);
    };

    Model.prototype.unbind = function(events, callback) {
      var event, _i, _len, _ref, _results;
      if (arguments.length === 0) {
        return this.trigger('unbind');
      } else if (events) {
        _ref = events.split(' ');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          _results.push(this.trigger('unbind', event, callback));
        }
        return _results;
      }
    };

    Model.prototype.toJSON = function() {
      return this.attributes();
    };

    Model.prototype.toString = function() {
      return "<" + this.constructor.className + " (" + (JSON.stringify(this)) + ")>";
    };

    return Model;

  })(Ryggrad.Module);

  Ryggrad.Model.setup = function(name, attributes) {
    var Instance, _ref;
    if (attributes == null) {
      attributes = [];
    }
    Instance = (function(_super) {
      __extends(Instance, _super);

      function Instance() {
        _ref = Instance.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      return Instance;

    })(this);
    Instance.configure.apply(Instance, [name].concat(__slice.call(attributes)));
    return Instance;
  };

  if (typeof require === 'function') {
    $ = jQuery = require('jquery');
  } else {
    $ = jQuery = window.jQuery;
  }

  elements = 'a abbr address article aside audio b bdi bdo blockquote body button\
   canvas caption cite code colgroup datalist dd del details dfn div dl dt em\
   fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup\
   html i iframe ins kbd label legend li map mark menu meter nav noscript object\
   ol optgroup option output p pre progress q rp rt ruby s samp script section\
   select small span strong style sub summary sup table tbody td textarea tfoot\
   th thead time title tr u ul video area base br col command embed hr img input\
   keygen link meta param source track wbrk'.split(/\s+/);

  voidElements = 'area base br col command embed hr img input keygen link meta param\
   source track wbr'.split(/\s+/);

  events = 'blur change click dblclick error focus input keydown\
   keypress keyup load mousedown mousemove mouseout mouseover\
   mouseup resize scroll select submit unload'.split(/\s+/);

  idCounter = 0;

  View = (function(_super) {
    __extends(View, _super);

    View.prototype.model = null;

    View.builderStack = [];

    elements.forEach(function(tagName) {
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
      var args, html, postProcessingSteps, step, _i, _len, _ref;
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
      this.find('*').andSelf().data('view', this);
      this.attr('callAttachHooks', true);
      for (_i = 0, _len = postProcessingSteps.length; _i < _len; _i++) {
        step = postProcessingSteps[_i];
        step(this);
      }
      if (typeof this.initialize === "function") {
        this.initialize.apply(this, args);
      }
    }

    View.prototype.setModel = function(model) {
      this.model = model;
      if (this.model) {
        return this.bindModelEvents();
      }
    };

    View.prototype.buildHtml = function(params) {
      var html, postProcessingSteps, _ref;
      this.constructor.builder = new Builder;
      this.constructor.content(params);
      _ref = this.constructor.builder.buildHtml(), html = _ref[0], postProcessingSteps = _ref[1];
      this.constructor.builder = null;
      return postProcessingSteps;
    };

    View.prototype.wireOutlets = function(view) {
      return this.find('[outlet]').each(function() {
        var element, outlet;
        element = $(this);
        outlet = element.attr('outlet');
        view[outlet] = element;
        return element.attr('outlet', null);
      });
    };

    View.prototype.bindEventHandlers = function(view) {
      var eventName, selector, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        eventName = events[_i];
        selector = "[" + eventName + "]";
        elements = view.find(selector).add(view.filter(selector));
        _results.push(elements.each(function() {
          var element, methodName;
          element = $(this);
          methodName = element.attr(eventName);
          return element.on(eventName, function(event) {
            return view[methodName](event, element);
          });
        }));
      }
      return _results;
    };

    View.prototype.bindModelEvents = function() {
      var event, handler, _ref, _results;
      _ref = this.constructor.model_events;
      _results = [];
      for (event in _ref) {
        handler = _ref[event];
        _results.push(this.model.bind(event, this[handler]));
      }
      return _results;
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
      if (__indexOf.call(voidElements, name) >= 0) {
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
      var arg, options, type, _i, _len;
      options = {};
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        type = typeof arg;
        if (type === "function") {
          options.content = arg;
        } else if (type === "string" || type === "number") {
          options.text = arg.toString();
        } else {
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
    var elementsWithHooks, onDom, _i, _len, _ref, _ref1, _results;
    if (!element) {
      return;
    }
    onDom = (typeof element.parents === "function" ? element.parents('html').length : void 0) > 0;
    elementsWithHooks = [];
    if (typeof element.attr === "function" ? element.attr('callAttachHooks') : void 0) {
      elementsWithHooks.push(element[0]);
    }
    if (onDom) {
      elementsWithHooks = elementsWithHooks.concat((_ref = typeof element.find === "function" ? element.find('[callAttachHooks]').toArray() : void 0) != null ? _ref : []);
    }
    _results = [];
    for (_i = 0, _len = elementsWithHooks.length; _i < _len; _i++) {
      element = elementsWithHooks[_i];
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

  (typeof exports !== "undefined" && exports !== null ? exports : this).$$ = function(fn) {
    return View.render.call(View, fn);
  };

  (typeof exports !== "undefined" && exports !== null ? exports : this).$$$ = function(fn) {
    return View.buildHtml.call(View, fn)[0];
  };

  Ryggrad.View = View;

  Controller = (function(_super) {
    __extends(Controller, _super);

    Controller.include(Ryggrad.Events);

    Controller.prototype.eventSplitter = /^(\S+)\s*(.*)$/;

    Controller.prototype.tag = 'div';

    function Controller(options) {
      this.destroy = __bind(this.destroy, this);
      var key, value, _ref2;
      this.options = options;
      _ref2 = this.options;
      for (key in _ref2) {
        value = _ref2[key];
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

    Controller.prototype.delegateEvents = function() {
      var eventName, key, match, method, selector, _ref2, _results;
      _ref2 = this.events;
      _results = [];
      for (key in _ref2) {
        method = _ref2[key];
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
      var key, value, _ref2, _results;
      _ref2 = this.elements;
      _results = [];
      for (key in _ref2) {
        value = _ref2[key];
        _results.push(this[value] = this.el.find(key));
      }
      return _results;
    };

    Controller.prototype.destroy = function() {
      this.trigger('release');
      this.el.addClass('garry');
      return this.unbind();
    };

    Controller.prototype.$ = function(selector) {
      return $(selector, this.el);
    };

    return Controller;

  })(Ryggrad.Module);

  Ryggrad.Controller = Controller;

  Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection(options) {
      var key, value;
      if (options == null) {
        options = {};
      }
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
    }

    Collection.prototype.all = function() {
      var _this = this;
      return this.model.select(function(rec) {
        return _this.associated(rec);
      });
    };

    Collection.prototype.first = function() {
      return this.all()[0];
    };

    Collection.prototype.last = function() {
      var values;
      values = this.all();
      return values[values.length - 1];
    };

    Collection.prototype.count = function() {
      return this.all().length;
    };

    Collection.prototype.find = function(id) {
      var records,
        _this = this;
      records = this.select(function(rec) {
        return ("" + rec.id) === ("" + id);
      });
      if (!records[0]) {
        throw new Error("\"" + this.model.className + "\" model could not find a record for the ID \"" + id + "\"");
      }
      return records[0];
    };

    Collection.prototype.findAllBy = function(name, value) {
      var _this = this;
      return this.model.select(function(rec) {
        return _this.associated(rec) && rec[name] === value;
      });
    };

    Collection.prototype.findBy = function(name, value) {
      return this.findAllBy(name, value)[0];
    };

    Collection.prototype.select = function(cb) {
      var _this = this;
      return this.model.select(function(rec) {
        return _this.associated(rec) && cb(rec);
      });
    };

    Collection.prototype.refresh = function(values) {
      var i, match, record, _k, _l, _len2, _len3, _len4, _m, _ref2, _ref3;
      if (values == null) {
        return this;
      }
      _ref2 = this.all();
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        record = _ref2[_k];
        delete this.model.irecords[record.id];
        _ref3 = this.model.records;
        for (i = _l = 0, _len3 = _ref3.length; _l < _len3; i = ++_l) {
          match = _ref3[i];
          if (!(match.id === record.id)) {
            continue;
          }
          this.model.records.splice(i, 1);
          break;
        }
      }
      if (!isArray(values)) {
        values = [values];
      }
      for (_m = 0, _len4 = values.length; _m < _len4; _m++) {
        record = values[_m];
        record.newRecord = false;
        record[this.fkey] = this.record.id;
      }
      this.model.refresh(values);
      return this;
    };

    Collection.prototype.create = function(record, options) {
      record[this.fkey] = this.record.id;
      return this.model.create(record, options);
    };

    Collection.prototype.add = function(record, options) {
      return record.updateAttribute(this.fkey, this.record.id, options);
    };

    Collection.prototype.remove = function(record, options) {
      return record.updateAttribute(this.fkey, null, options);
    };

    Collection.prototype.associated = function(record) {
      return record[this.fkey] === this.record.id;
    };

    return Collection;

  })(Ryggrad.Module);

  Instance = (function(_super) {
    __extends(Instance, _super);

    function Instance(options) {
      var key, value;
      if (options == null) {
        options = {};
      }
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
    }

    Instance.prototype.exists = function() {
      if (this.record[this.fkey]) {
        return this.model.exists(this.record[this.fkey]);
      } else {
        return false;
      }
    };

    Instance.prototype.update = function(value) {
      if (value == null) {
        return this;
      }
      if (!(value instanceof this.model)) {
        value = new this.model(value);
      }
      if (value.isNew()) {
        value.save();
      }
      this.record[this.fkey] = value && value.id;
      return this;
    };

    return Instance;

  })(Ryggrad.Module);

  Singleton = (function(_super) {
    __extends(Singleton, _super);

    function Singleton(options) {
      var key, value;
      if (options == null) {
        options = {};
      }
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
    }

    Singleton.prototype.find = function() {
      return this.record.id && this.model.findBy(this.fkey, this.record.id);
    };

    Singleton.prototype.update = function(value) {
      if (value == null) {
        return this;
      }
      if (!(value instanceof this.model)) {
        value = this.model.fromJSON(value);
      }
      value[this.fkey] = this.record.id;
      value.save();
      return this;
    };

    return Singleton;

  })(Ryggrad.Module);

  singularize = function(str) {
    return str.replace(/s$/, '');
  };

  underscore = function(str) {
    return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
  };

  association = function(name, model, record, fkey, Ctor) {
    if (typeof model === 'string') {
      model = require(model);
    }
    return new Ctor({
      name: name,
      model: model,
      record: record,
      fkey: fkey
    });
  };

  Ryggrad.Collection = Collection;

  Ryggrad.Singleton = Singleton;

  Ryggrad.Instance = Instance;

  Ryggrad.Model.extend({
    hasMany: function(name, model, fkey) {
      if (fkey == null) {
        fkey = "" + (underscore(this.className)) + "_id";
      }
      return this.prototype[name] = function(value) {
        return association(name, model, this, fkey, Ryggrad.Collection).refresh(value);
      };
    },
    belongsTo: function(name, model, fkey) {
      if (fkey == null) {
        fkey = "" + (underscore(singularize(name))) + "_id";
      }
      this.prototype[name] = function(value) {
        return association(name, model, this, fkey, Ryggrad.Instance).update(value).exists();
      };
      return this.attributes.push(fkey);
    },
    hasOne: function(name, model, fkey) {
      if (fkey == null) {
        fkey = "" + (underscore(this.className)) + "_id";
      }
      return this.prototype[name] = function(value) {
        return association(name, model, this, fkey, Ryggrad.Singleton).update(value).find();
      };
    }
  });

  ClassMethods = {
    setAttributesSnapshot: function(model) {
      var attrCopy, k, v, _ref2;
      attrCopy = {};
      _ref2 = model.attributes();
      for (k in _ref2) {
        v = _ref2[k];
        attrCopy[k] = v;
      }
      return this._attributesSnapshots[model.id] = attrCopy;
    },
    getAttributesSnapshot: function(model) {
      return this._attributesSnapshots[model.id];
    }
  };

  AttributeTracking = {
    extended: function() {
      var _this = this;
      this._attributesSnapshots = {};
      this.bind('refresh create', function(models) {
        var model, _k, _len2, _results;
        models || (models = _this.all());
        if (models.length != null) {
          _results = [];
          for (_k = 0, _len2 = models.length; _k < _len2; _k++) {
            model = models[_k];
            _results.push(_this.setAttributesSnapshot(model));
          }
          return _results;
        } else {
          return _this.setAttributesSnapshot(models);
        }
      });
      this.bind('update', function(model) {
        var k, v, _ref2;
        _ref2 = model.attributes();
        for (k in _ref2) {
          v = _ref2[k];
          if (!_.isEqual(_this.getAttributesSnapshot(model)[k], v)) {
            model.trigger("update:" + k);
          }
        }
        return _this.setAttributesSnapshot(model);
      });
      return this.extend(ClassMethods);
    }
  };

  Ryggrad.AttributeTracking = AttributeTracking;

  hashStrip = /^#*/;

  namedParam = /:([\w\d]+)/g;

  splatParam = /\*([\w\d]+)/g;

  escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

  Ryggrad.Route = (function(_super) {
    var _ref2;

    __extends(Route, _super);

    Route.extend(Ryggrad.Events);

    Route.historySupport = ((_ref2 = window.history) != null ? _ref2.pushState : void 0) != null;

    Route.routes = [];

    Route.options = {
      trigger: true,
      history: false,
      shim: false,
      replace: false,
      redirect: false
    };

    Route.add = function(path, callback) {
      var key, value, _results;
      if (typeof path === 'object' && !(path instanceof RegExp)) {
        _results = [];
        for (key in path) {
          value = path[key];
          _results.push(this.add(key, value));
        }
        return _results;
      } else {
        return this.routes.push(new this(path, callback));
      }
    };

    Route.setup = function(options) {
      if (options == null) {
        options = {};
      }
      this.options = $.extend({}, this.options, options);
      if (this.options.history) {
        this.history = this.historySupport && this.options.history;
      }
      if (this.options.shim) {
        return;
      }
      if (this.history) {
        $(window).bind('popstate', this.change);
      } else {
        $(window).bind('hashchange', this.change);
      }
      return this.change();
    };

    Route.unbind = function() {
      if (this.options.shim) {
        return;
      }
      if (this.history) {
        return $(window).unbind('popstate', this.change);
      } else {
        return $(window).unbind('hashchange', this.change);
      }
    };

    Route.navigate = function() {
      var args, lastArg, options, path, route;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      options = {};
      lastArg = args[args.length - 1];
      if (typeof lastArg === 'object') {
        options = args.pop();
      } else if (typeof lastArg === 'boolean') {
        options.trigger = args.pop();
      }
      options = $.extend({}, this.options, options);
      path = args.join('/');
      if (this.path === path) {
        return;
      }
      this.path = path;
      this.trigger('navigate', this.path);
      if (options.trigger) {
        route = this.matchRoute(this.path, options);
      }
      if (options.shim) {
        return;
      }
      if (!route) {
        if (typeof options.redirect === 'function') {
          return options.redirect.apply(this, [this.path, options]);
        } else {
          if (options.redirect === true) {
            this.redirect(this.path);
          }
        }
      }
      if (this.history && options.replace) {
        history.replaceState({}, document.title, this.path);
      } else if (this.history) {
        history.pushState({}, document.title, this.path);
      } else {
        window.location.hash = this.path;
      }
      return this;
    };

    Route.getEventName = function() {
      if (this.history) {
        return "popstate";
      } else {
        return "hashchange";
      }
    };

    Route.getPath = function() {
      var path;
      if (this.history) {
        path = window.location.pathname;
        if (path.substr(0, 1) !== '/') {
          path = '/' + path;
        }
      } else {
        path = window.location.hash;
        path = path.replace(hashStrip, '');
      }
      return path;
    };

    Route.getFragment = function() {
      return this.getHash().replace(hashStrip, '');
    };

    Route.getHost = function() {
      return "" + window.location.protocol + "//" + window.location.host;
    };

    Route.getHash = function() {
      return window.location.hash;
    };

    Route.change = function() {
      var path;
      path = this.getPath();
      if (path === this.path) {
        return;
      }
      this.path = path;
      this.matchRoute(this.path);
      return this;
    };

    Route.matchRoute = function(path, options) {
      var route, _k, _len2, _ref3;
      _ref3 = this.routes;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        route = _ref3[_k];
        if (!(route.match(path, options))) {
          continue;
        }
        this.trigger('change', route, path);
        return route;
      }
    };

    Route.redirect = function(path) {
      return window.location = path;
    };

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
        this.route = new RegExp("^" + path + "$");
      } else {
        this.route = path;
      }
    }

    Route.prototype.match = function(path, options) {
      var i, match, param, params, _k, _len2;
      if (options == null) {
        options = {};
      }
      match = this.route.exec(path);
      if (!match) {
        return false;
      }
      options.match = match;
      params = match.slice(1);
      if (this.names.length) {
        for (i = _k = 0, _len2 = params.length; _k < _len2; i = ++_k) {
          param = params[i];
          options[this.names[i]] = param;
        }
      }
      return this.callback.call(null, options) !== false;
    };

    return Route;

  })(Ryggrad.Module);

  Ryggrad.Route.change = Ryggrad.Route.proxy(Ryggrad.Route.change);

  Ryggrad.Controller.include({
    route: function(path, callback) {
      return Ryggrad.Route.add(path, this.proxy(callback));
    },
    routes: function(routes) {
      var key, value, _results;
      _results = [];
      for (key in routes) {
        value = routes[key];
        _results.push(this.route(key, value));
      }
      return _results;
    },
    url: function() {
      return Ryggrad.Route.navigate.apply(Ryggrad.Route, arguments);
    }
  });

  Queue = $({});

  Model = Ryggrad.Model;

  Ajax = {
    getURL: function(object) {
      return (typeof object.url === "function" ? object.url() : void 0) || object.url;
    },
    getCollectionURL: function(object) {
      if (object) {
        if (typeof object.url === "function") {
          return this.generateURL(object);
        } else {
          return object.url;
        }
      }
    },
    getScope: function(object) {
      return (typeof object.scope === "function" ? object.scope() : void 0) || object.scope;
    },
    generateURL: function() {
      var args, collection, object, path, scope;
      object = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (object.className) {
        collection = object.className.toLowerCase() + 's';
        scope = Ajax.getScope(object);
      } else {
        if (typeof object.constructor.url === 'string') {
          collection = object.constructor.url;
        } else {
          collection = object.constructor.className.toLowerCase() + 's';
        }
        scope = Ajax.getScope(object) || Ajax.getScope(object.constructor);
      }
      args.unshift(collection);
      args.unshift(scope);
      path = args.join('/');
      path = path.replace(/(\/\/)/g, "/");
      path = path.replace(/^\/|\/$/g, "");
      if (path.indexOf("../") !== 0) {
        return Model.host + "/" + path;
      } else {
        return path;
      }
    },
    enabled: true,
    disable: function(callback) {
      var e;
      if (this.enabled) {
        this.enabled = false;
        try {
          return callback();
        } catch (_error) {
          e = _error;
          throw e;
        } finally {
          this.enabled = true;
        }
      } else {
        return callback();
      }
    },
    queue: function(request) {
      if (request) {
        return Queue.queue(request);
      } else {
        return Queue.queue();
      }
    },
    clearQueue: function() {
      return this.queue([]);
    }
  };

  Base = (function() {
    function Base() {}

    Base.prototype.defaults = {
      dataType: 'json',
      processData: false,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    Base.prototype.queue = Ajax.queue;

    Base.prototype.ajax = function(params, defaults) {
      return $.ajax(this.ajaxSettings(params, defaults));
    };

    Base.prototype.ajaxQueue = function(params, defaults, record) {
      var deferred, jqXHR, promise, request, settings;
      jqXHR = null;
      deferred = $.Deferred();
      promise = deferred.promise();
      if (!Ajax.enabled) {
        return promise;
      }
      settings = this.ajaxSettings(params, defaults);
      request = function(next) {
        var _ref2;
        if ((record != null ? record.id : void 0) != null) {
          if (settings.url == null) {
            settings.url = Ajax.getURL(record);
          }
          if ((_ref2 = settings.data) != null) {
            _ref2.id = record.id;
          }
        }
        settings.data = JSON.stringify(settings.data);
        return jqXHR = $.ajax(settings).done(deferred.resolve).fail(deferred.reject).then(next, next);
      };
      promise.abort = function(statusText) {
        var index;
        if (jqXHR) {
          return jqXHR.abort(statusText);
        }
        index = $.inArray(request, this.queue());
        if (index > -1) {
          this.queue().splice(index, 1);
        }
        deferred.rejectWith(settings.context || settings, [promise, statusText, '']);
        return promise;
      };
      this.queue(request);
      return promise;
    };

    Base.prototype.ajaxSettings = function(params, defaults) {
      return $.extend({}, this.defaults, defaults, params);
    };

    return Base;

  })();

  Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection(model) {
      this.model = model;
      this.failResponse = __bind(this.failResponse, this);
      this.recordsResponse = __bind(this.recordsResponse, this);
    }

    Collection.prototype.find = function(id, params, options) {
      var record;
      if (options == null) {
        options = {};
      }
      record = new this.model({
        id: id
      });
      return this.ajaxQueue(params, {
        type: 'GET',
        url: options.url || Ajax.getURL(record)
      }).done(this.recordsResponse).fail(this.failResponse);
    };

    Collection.prototype.all = function(params, options) {
      if (options == null) {
        options = {};
      }
      return this.ajaxQueue(params, {
        type: 'GET',
        url: options.url || Ajax.getURL(this.model)
      }).done(this.recordsResponse).fail(this.failResponse);
    };

    Collection.prototype.fetch = function(params, options) {
      var id,
        _this = this;
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      if (id = params.id) {
        delete params.id;
        return this.find(id, params, options).done(function(record) {
          return _this.model.refresh(record, options);
        });
      } else {
        return this.all(params, options).done(function(records) {
          return _this.model.refresh(records, options);
        });
      }
    };

    Collection.prototype.recordsResponse = function(data, status, xhr) {
      return this.model.trigger('ajaxSuccess', null, status, xhr);
    };

    Collection.prototype.failResponse = function(xhr, statusText, error) {
      return this.model.trigger('ajaxError', null, xhr, statusText, error);
    };

    return Collection;

  })(Base);

  Singleton = (function(_super) {
    __extends(Singleton, _super);

    function Singleton(record) {
      this.record = record;
      this.failResponse = __bind(this.failResponse, this);
      this.recordResponse = __bind(this.recordResponse, this);
      this.model = this.record.constructor;
    }

    Singleton.prototype.reload = function(params, options) {
      if (options == null) {
        options = {};
      }
      return this.ajaxQueue(params, {
        type: 'GET',
        url: options.url
      }, this.record).done(this.recordResponse(options)).fail(this.failResponse(options));
    };

    Singleton.prototype.create = function(params, options) {
      if (options == null) {
        options = {};
      }
      return this.ajaxQueue(params, {
        type: 'POST',
        contentType: 'application/json',
        data: this.record.toJSON(),
        url: options.url || Ajax.getCollectionURL(this.record)
      }).done(this.recordResponse(options)).fail(this.failResponse(options));
    };

    Singleton.prototype.update = function(params, options) {
      if (options == null) {
        options = {};
      }
      return this.ajaxQueue(params, {
        type: 'PUT',
        contentType: 'application/json',
        data: this.record.toJSON(),
        url: options.url
      }, this.record).done(this.recordResponse(options)).fail(this.failResponse(options));
    };

    Singleton.prototype.destroy = function(params, options) {
      if (options == null) {
        options = {};
      }
      return this.ajaxQueue(params, {
        type: 'DELETE',
        url: options.url
      }, this.record).done(this.recordResponse(options)).fail(this.failResponse(options));
    };

    Singleton.prototype.recordResponse = function(options) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      return function(data, status, xhr) {
        var _ref2, _ref3;
        Ajax.disable(function() {
          if (!(isBlank(data) || _this.record.destroyed)) {
            if (data.id && _this.record.id !== data.id) {
              _this.record.changeID(data.id);
            }
            return _this.record.refresh(data);
          }
        });
        _this.record.trigger('ajaxSuccess', data, status, xhr);
        if ((_ref2 = options.success) != null) {
          _ref2.apply(_this.record);
        }
        return (_ref3 = options.done) != null ? _ref3.apply(_this.record) : void 0;
      };
    };

    Singleton.prototype.failResponse = function(options) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      return function(xhr, statusText, error) {
        var _ref2, _ref3;
        _this.record.trigger('ajaxError', xhr, statusText, error);
        if ((_ref2 = options.error) != null) {
          _ref2.apply(_this.record);
        }
        return (_ref3 = options.fail) != null ? _ref3.apply(_this.record) : void 0;
      };
    };

    return Singleton;

  })(Base);

  Model.host = '';

  Include = {
    ajax: function() {
      return new Singleton(this);
    },
    url: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      args.unshift(encodeURIComponent(this.id));
      return Ajax.generateURL.apply(Ajax, [this].concat(__slice.call(args)));
    }
  };

  Extend = {
    ajax: function() {
      return new Collection(this);
    },
    url: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return Ajax.generateURL.apply(Ajax, [this].concat(__slice.call(args)));
    }
  };

  Model.Ajax = {
    extended: function() {
      this.fetch(this.ajaxFetch);
      this.change(this.ajaxChange);
      this.extend(Extend);
      return this.include(Include);
    },
    ajaxFetch: function() {
      var _ref2;
      return (_ref2 = this.ajax()).fetch.apply(_ref2, arguments);
    },
    ajaxChange: function(record, type, options) {
      if (options == null) {
        options = {};
      }
      if (options.ajax === false) {
        return;
      }
      return record.ajax()[type](options.ajax, options);
    }
  };

  Model.Ajax.Methods = {
    extended: function() {
      this.extend(Extend);
      return this.include(Include);
    }
  };

  Ajax.defaults = Base.prototype.defaults;

  Ajax.Base = Base;

  Ajax.Singleton = Singleton;

  Ajax.Collection = Collection;

  Ryggrad.Ajax = Ajax;

}).call(this);

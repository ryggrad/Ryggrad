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

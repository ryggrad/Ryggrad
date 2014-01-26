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

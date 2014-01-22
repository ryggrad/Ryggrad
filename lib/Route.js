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

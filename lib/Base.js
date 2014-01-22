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

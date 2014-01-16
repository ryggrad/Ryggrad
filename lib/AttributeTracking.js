var AttributeTracking, ClassMethods, _;

_ = require('underscore');

ClassMethods = {
  setAttributesSnapshot: function(model) {
    var attrCopy, k, v, _ref;
    attrCopy = {};
    _ref = model.attributes();
    for (k in _ref) {
      v = _ref[k];
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
      var model, _i, _len, _results;
      models || (models = _this.all());
      if (models.length != null) {
        _results = [];
        for (_i = 0, _len = models.length; _i < _len; _i++) {
          model = models[_i];
          _results.push(_this.setAttributesSnapshot(model));
        }
        return _results;
      } else {
        return _this.setAttributesSnapshot(models);
      }
    });
    this.bind('update', function(model) {
      var k, v, _ref;
      _ref = model.attributes();
      for (k in _ref) {
        v = _ref[k];
        if (!_.isEqual(_this.getAttributesSnapshot(model)[k], v)) {
          model.trigger("update:" + k);
        }
      }
      return _this.setAttributesSnapshot(model);
    });
    return this.extend(ClassMethods);
  }
};

module.exports = AttributeTracking;

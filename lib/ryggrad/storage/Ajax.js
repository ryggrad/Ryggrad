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

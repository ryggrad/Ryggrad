var Ryggrad, jquery, root;

jquery = require('jquery');

require('./jqueryExtensions')(window);

require('./jqueryAjax')(window);

Ryggrad = {};

Ryggrad.Model = require('./Model');

Ryggrad.View = require('space-pen')(window);

Ryggrad.Controller = require('./Controller');

Ryggrad.Router = require('./Router');

Ryggrad.Util = require('./Util');

Ryggrad.version = "0.0.5";

root = typeof exports !== "undefined" && exports !== null ? exports : this;

root.Ryggrad = Ryggrad;

if (typeof window !== "undefined" && window !== null) {
  window.Ryggrad = Ryggrad;
}

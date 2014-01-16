jquery = require('jquery')
require('./jqueryExtensions')(window)
require('./jqueryAjax')(window)

Ryggrad = {}
Ryggrad.Model      = require('./Model')
Ryggrad.View       = require('space-pen').View
Ryggrad.Controller = require('./Controller') 
Ryggrad.Router     = require('./Router') 
Ryggrad.Util       = require('./Util') 

# Exports
Ryggrad.version = "0.0.5"
module.exports  = Ryggrad

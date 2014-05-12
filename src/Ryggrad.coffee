jquery = require('jquery')
require('./ryggrad/jquery/extensions')(window)
require('./ryggrad/jquery/ajax')(window)

Ryggrad = {}
Ryggrad.Base         = require('./ryggrad/Base')
Ryggrad.Events       = require('./ryggrad/Events')
Ryggrad.Module       = require('./ryggrad/Module')
Ryggrad.Collection   = require('./ryggrad/Collection')
Ryggrad.Model        = require('./ryggrad/Model')
Ryggrad.View         = require('space-pen').View
Ryggrad.Controller   = require('./ryggrad/Controller') 
Ryggrad.Route        = require('./ryggrad/Route') 
Ryggrad.Router       = require('./ryggrad/Router') 
Ryggrad.Util         = require('./ryggrad/Util') 

# Exports
Ryggrad.version = "0.0.5"
module.exports  = Ryggrad

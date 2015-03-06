jquery = require('jquery')
require('./ryggrad/jquery/extensions')(window)
require('./ryggrad/jquery/ajax')(window)

Ryggrad = {}
Ryggrad.Collection   = require('./ryggrad/Collection')
Ryggrad.Model        = require('./ryggrad/Model')
Ryggrad.Controller   = require('./ryggrad/Controller') 
Ryggrad.Route        = require('./ryggrad/Route') 
Ryggrad.Router       = require('./ryggrad/Router') 

# Exports
Ryggrad.version = "0.0.5"
module.exports  = Ryggrad

Events = require('./Events')
Module = require('./Module')

class Base extends Module
	@include Events
	@extend Events

module.exports = Base
 
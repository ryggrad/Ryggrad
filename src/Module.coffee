Events = require('./Events')
moduleKeywords = ['included', 'extended']

class Module extends Events
  @include: (obj) ->
    throw new Error('include(obj) requires obj') unless obj
    for key, value of obj when key not in moduleKeywords
      @::[key] = value

    included = obj.included
    included.apply(this) if included
    @

  @extend: (obj) ->
    throw new Error('extend(obj) requires obj') unless obj
    for key, value of obj when key not in moduleKeywords
      @[key] = value

    obj.extended?.apply(this)
    @

  @proxy: (method) ->
    => method.apply(@, arguments)

  proxy: (method) ->
    => method.apply(@, arguments)

  delay: (method, timeout) ->
    setTimeout(@proxy(method), timeout || 0)

  constructor: ->
    @init?(arguments)

Module.create = (base, mixins...) ->
  base = @ unless base 
  class Mixed extends base
    for mixin in mixins by -1 # earlier mixins override later ones
      for name, method of mixin::
        Mixed::[name] = method

  return Mixed

# Exports
module.exports = Module

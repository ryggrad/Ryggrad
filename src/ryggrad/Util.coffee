Util =
  # Get the current value of an input node.
  getInputValue: (el) ->
    if window.jQuery?
      switch el[0].type
        when 'checkbox' then el.is ':checked'
        else el.val()
    else
      switch el.type
        when 'checkbox' then el.checked
        when 'select-multiple' then o.value for o in el when o.selected
        else el.value

  isArray: (value) ->
    Object::toString.call(value) is '[object Array]'

  isBlank: (value) ->
    return true unless value
    return false for key of value
    true

  makeArray: (args) ->
    Array::slice.call(args, 0)

  singularize: (str) ->
    str.replace(/s$/, '')

  underscore: (str) ->
    str.replace(/::/g, '/')
       .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
       .replace(/([a-z\d])([A-Z])/g, '$1_$2')
       .replace(/-/g, '_')
       .toLowerCase()

# Utilities & Shims
unless typeof Object.create is 'function'
  Object.create = (o) ->
    Func = ->
    Func.prototype = o
    new Func()

module.exports = Util

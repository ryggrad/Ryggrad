class Ryggrad.Util
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

jQuery = window.jQuery or window.Zepto
$ = jQuery

$.fn.extend
  hasEvent: (A, F, E) ->
    L = 0
    T = typeof A
    V = false
    E = (if E then E else this)
    A = (if (T is "string") then $.trim(A) else A)
    if T is "function"
      F = A
      A = null
    F = null if F is E
    S = E.data("events")
    for e of S
      L++  if S.hasOwnProperty(e)
    return V = false  if L < 1
    if A and not F
      return V = S.hasOwnProperty(A)
    else if A and S.hasOwnProperty(A) and F
      $.each S[A], (i, r) ->
        V = true  if V is false and r.handler is F

      return V
    else if not A and F
      $.each S, (i, s) ->
        if V is false
          $.each s, (k, r) ->
            V = true  if V is false and r.handler is F

    V

$.extend $.fn.hasEvent

# Utilities & Shims
unless typeof Object.create is 'function'
  Object.create = (o) ->
    Func = ->
    Func.prototype = o
    new Func()

isArray = (value) ->
  Object::toString.call(value) is '[object Array]'

isBlank = (value) ->
  return true unless value
  return false for key of value
  true

makeArray = (args) ->
  Array::slice.call(args, 0)

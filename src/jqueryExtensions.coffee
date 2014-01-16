module.exports = (window) ->
  jQuery = require('jquery')(window)

  jQuery.event.special.removed =
    remove: (e) -> e.handler?()

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

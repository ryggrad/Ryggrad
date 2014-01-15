 Events =
  bind: (ev, callback) ->
    evs = ev.split(' ')

    calls = @hasOwnProperty('_callbacks') and @_callbacks or= {}

    for name in evs
      calls[name] or= []
      calls[name].push(callback)

    @

  trigger: (args...) ->
    ev = args.shift()

    list = @hasOwnProperty('_callbacks') and @_callbacks?[ev]
    return unless list

    for callback in list
      if callback.apply(@, args) is false
        break
    true
    
  listenTo: (obj, ev, callback) ->
    obj.bind(ev, callback)
    @listeningTo or= []
    @listeningTo.push {obj, ev, callback}
    this

  listenToOnce: (obj, ev, callback) ->
    listeningToOnce = @listeningToOnce or = []
    obj.bind ev, handler = ->
      idx = -1
      for lt, i in listeningToOnce when lt.obj is obj
        idx = i if lt.ev is ev and lt.callback is callback
      obj.unbind(ev, handler)
      listeningToOnce.splice(idx, 1) unless idx is -1
      callback.apply(this, arguments)
    listeningToOnce.push {obj, ev, callback, handler}
    this

  stopListening: (obj, events, callback) ->
    if arguments.length is 0
      for listeningTo in [@listeningTo, @listeningToOnce]
        continue unless listeningTo
        for lt in listeningTo
          lt.obj.unbind(lt.ev, lt.handler or lt.callback)
      @listeningTo = undefined
      @listeningToOnce = undefined

    else if obj
      for listeningTo in [@listeningTo, @listeningToOnce]
        continue unless listeningTo
        events = if events then events.split(' ') else [undefined]
        for ev in events
          for idx in [listeningTo.length-1..0]
            lt = listeningTo[idx]
            if (not ev) or (ev is lt.ev)
              lt.obj.unbind(lt.ev, lt.handler or lt.callback)
              listeningTo.splice(idx, 1) unless idx is -1
            else if ev
              evts = lt.ev.split(' ')
              if ~(i = evts.indexOf(ev))
                evts.splice(i, 1)
                lt.ev = $.trim(evts.join(' '))
                lt.obj.unbind(ev, lt.handler or lt.callback)

  unbind: (ev, callback) ->
    unless ev
      @_callbacks = {}
      return @

    list = @_callbacks?[ev]
    return @ unless list

    unless callback
      delete @_callbacks[ev]
      return @

    for cb, i in list when cb is callback
      list = list.slice()
      list.splice(i, 1)
      @_callbacks[ev] = list
      break

    @

# Exports
module.exports = Events

Base   = require('./Base')
Router = require("./Router")

class Controller extends Base 
  eventSplitter: /^(\S+)\s*(.*)$/
  tag: 'div'

  constructor: (options) ->
    @router = new Router()
    @options = options

    for key, value of @options
      @[key] = value
    
    unless @el
      @el  = document.createElement(@tag)
    
    @el  = $(@el)

    @$el = @el

    @el.addClass(@className) if @className
    @el.attr(@attributes)    if @attributes

    @events   = @constructor.events   unless @events
    @elements = @constructor.elements unless @elements

    do @delegateEvents  if @events
    do @refreshElements if @elements
    super

  route: (path, callback) -> 
    @router.add path, @proxy(callback)

  routes: (routes) ->
    @route(key, value) for key, value of routes

  url: -> 
    @router.navigate.apply(router, args)  

  delegateEvents: ->
    for key, method of @events
      method = @proxy(@[method]) unless typeof(method) is 'function'

      match      = key.match(@eventSplitter)
      eventName  = match[1]
      selector   = match[2]

      if selector is ''
        @el.bind(eventName, method)
      else
        @el.delegate(selector, eventName, method)

  refreshElements: ->
     @[value] = @el.find(key) for key, value of @elements

  destroy: =>
    @trigger 'release'
    @el.addClass('garry')
    @unbind()
    @el.remove()

  $: (selector) -> $(selector, @el)

  release: =>

# Exports
module.exports = Controller

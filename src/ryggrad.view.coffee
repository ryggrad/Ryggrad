if typeof require is 'function'
  $ = jQuery = require('jquery')
else
  $ = jQuery = window.jQuery

elements =
  'a abbr address article aside audio b bdi bdo blockquote body button
   canvas caption cite code colgroup datalist dd del details dfn div dl dt em
   fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup
   html i iframe ins kbd label legend li map mark menu meter nav noscript object
   ol optgroup option output p pre progress q rp rt ruby s samp script section
   select small span strong style sub summary sup table tbody td textarea tfoot
   th thead time title tr u ul video area base br col command embed hr img input
   keygen link meta param source track wbrk'.split /\s+/

voidElements =
  'area base br col command embed hr img input keygen link meta param
   source track wbr'.split /\s+/

events =
  'blur change click dblclick error focus input keydown
   keypress keyup load mousedown mousemove mouseout mouseover
   mouseup resize scroll select submit unload'.split /\s+/

idCounter = 0

class View extends jQuery
  model: null
  @builderStack: []

  elements.forEach (tagName) ->
    View[tagName] = (args...) -> @currentBuilder.tag(tagName, args...)

  @subview: (name, view) ->
    @currentBuilder.subview(name, view)

  @text: (string) -> @currentBuilder.text(string)

  @tag: (tagName, args...) -> @currentBuilder.tag(tagName, args...)

  @raw: (string) -> @currentBuilder.raw(string)

  @pushBuilder: ->
    builder = new Builder
    @builderStack.push(builder)
    @currentBuilder = builder

  @popBuilder: ->
    @currentBuilder = @builderStack[@builderStack.length - 2]
    @builderStack.pop()

  @buildHtml: (fn) ->
    @pushBuilder()
    fn.call(this)
    [html, postProcessingSteps] = @popBuilder().buildHtml()

  @render: (fn) ->
    [html, postProcessingSteps] = @buildHtml(fn)
    div = document.createElement('div')
    div.innerHTML = html
    fragment = $(div.childNodes)
    step(fragment) for step in postProcessingSteps
    fragment

  constructor: (args...) ->
    [html, postProcessingSteps] = @constructor.buildHtml -> @content(args...)
    jQuery.fn.init.call(this, html)
    throw new Error("View markup must have a single root element") if this.length != 1
    @wireOutlets(this)
    @bindEventHandlers(this)
    @find('*').andSelf().data('view', this)
    @attr('callAttachHooks', true)
    step(this) for step in postProcessingSteps
    @initialize?(args...)

  setModel: (model) ->
    @model = model
    @bindModelEvents() if @model

  buildHtml: (params) ->
    @constructor.builder = new Builder
    @constructor.content(params)
    [html, postProcessingSteps] = @constructor.builder.buildHtml()
    @constructor.builder = null
    postProcessingSteps

  wireOutlets: (view) ->
    @find('[outlet]').each ->
      element = $(this)
      outlet = element.attr('outlet')
      view[outlet] = element
      element.attr('outlet', null)

  bindEventHandlers: (view) ->
    for eventName in events
      selector = "[#{eventName}]"
      elements = view.find(selector).add(view.filter(selector))
      elements.each ->
        element = $(this)
        methodName = element.attr(eventName)
        element.on eventName, (event) -> view[methodName](event, element)

  bindModelEvents: () ->
    for event, handler of @constructor.model_events 
      @model.bind(event, @[handler])

  # `pushStack` and `end` are jQuery methods that construct new wrappers.
  # we override them here to construct plain wrappers with `jQuery` rather
  # than wrappers that are instances of our view class.
  pushStack: (elems) ->
    ret = jQuery.merge(jQuery(), elems)
    ret.prevObject = this
    ret.context = @context
    ret

  end: ->
    @prevObject ? jQuery(null)

class Builder
  constructor: ->
    @document = []
    @postProcessingSteps = []

  buildHtml: ->
    [@document.join(''), @postProcessingSteps]

  tag: (name, args...) ->
    options = @extractOptions(args)

    @openTag(name, options.attributes)

    if name in voidElements
      if (options.text? or options.content?)
        throw new Error("Self-closing tag #{name} cannot have text or content")
    else
      options.content?()
      @text(options.text) if options.text
      @closeTag(name)

  openTag: (name, attributes) ->
    attributePairs =
      for attributeName, value of attributes
        "#{attributeName}=\"#{value}\""

    attributesString =
      if attributePairs.length
        " " + attributePairs.join(" ")
      else
        ""

    @document.push "<#{name}#{attributesString}>"

  closeTag: (name) ->
    @document.push "</#{name}>"

  text: (string) ->
    escapedString = string
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    @document.push escapedString

  raw: (string) ->
    @document.push string

  subview: (outletName, subview) ->
    subviewId = "subview-#{++idCounter}"
    @tag 'div', id: subviewId
    @postProcessingSteps.push (view) ->
      view[outletName] = subview
      subview.parentView = view
      view.find("div##{subviewId}").replaceWith(subview)

  extractOptions: (args) ->
    options = {}
    for arg in args
      type = typeof(arg)
      if type is "function"
        options.content = arg
      else if type is "string" or type is "number"
        options.text = arg.toString()
      else
        options.attributes = arg
    options

jQuery.fn.view = -> @data('view')
jQuery.fn.views = -> @toArray().map (elt) -> $(elt).view()

# Trigger attach event when views are added to the DOM
callAttachHook = (element) ->
  return unless element
  onDom = element.parents?('html').length > 0

  elementsWithHooks = []
  elementsWithHooks.push(element[0]) if element.attr?('callAttachHooks')
  elementsWithHooks = elementsWithHooks.concat(element.find?('[callAttachHooks]').toArray() ? []) if onDom

  $(element).view()?.afterAttach?(onDom) for element in elementsWithHooks

for methodName in ['append', 'prepend', 'after', 'before']
  do (methodName) ->
    originalMethod = $.fn[methodName]
    jQuery.fn[methodName] = (args...) ->
      flatArgs = [].concat args...
      result = originalMethod.apply(this, flatArgs)
      callAttachHook arg for arg in flatArgs
      result

for methodName in ['prependTo', 'appendTo', 'insertAfter', 'insertBefore']
  do (methodName) ->
    originalMethod = jQuery.fn[methodName]
    jQuery.fn[methodName] = (args...) ->
      result = originalMethod.apply(this, args)
      callAttachHook(this)
      result

originalCleanData = jQuery.cleanData
jQuery.cleanData = (elements) ->
  for element in elements
    view = $(element).view()
    view.beforeRemove?() if view and view?[0] == element
  originalCleanData(elements)

(exports ? this).$$ = (fn) ->  View.render.call(View, fn)
(exports ? this).$$$ = (fn) -> View.buildHtml.call(View, fn)[0]
Ryggrad.View = View

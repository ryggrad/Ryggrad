$          = jQuery
Base       = require('./Base')
Collection = require('./Collection')
_ = require('underscore')
_.mixin(require('underscore.inflections'))

eql = _.isEqual

class Model extends Base
  @key: (name, options = {}) ->
    unless @hasOwnProperty('attributes')
      @attributes = {}
    @attributes[name] = options

  @key 'id', String

  @records: ->
    unless @hasOwnProperty('collection')
      @collection = new Collection(
        model: this,
        name: 'base',
        comparator: @comparator
      )
    @collection

  @count: ->
    @records().count()

  @all: (callback) ->
    @records().all(callback)

  @find: (id, options = {}) ->
    @records().find(id, options)

  @findBy: (callback, request) ->
    @records().findBy(callback, request)

  @filter: (callback) ->
    @records().filter(callback)

  @add: (values) ->
    @records().add(values)

  @exists: (id) ->
    @records().exists(id)

  @uri: (parts...) ->
    url = @url?() or @url
    [url, parts...].join('/')

  @url: (value) ->
    @url = (-> value) if value
    value or "/#{_.pluralize(@name.toLowerCase())}"

  @toString: -> @name

  @on: (event, callback) ->
    @records().on("record.#{event}", callback)

  # Private

  @uidCounter: 0

  @uid: (prefix = '') ->
    uid = prefix + @uidCounter++
    uid = @uid(prefix) if @exists(uid)
    uid

  @create: (atts = {}) ->
    obj = new @(atts)
    return obj.save()

  @refresh: ->
    @records().refresh(arguments...)

  @destroy: (record) ->
    @records().remove(record)

  @destroyAll: ->
    @records().reset()

  @fetch: (options = {}) ->
    @records().fetch(options)

  # Public
  constructor: (atts = {}) ->
    if atts instanceof @constructor
      return atts

    if Array.isArray(atts) or atts?.isArray
      return(new @constructor(rec) for rec in atts)

    @cid  = @constructor.uid('c-')
    @attributes = {}
    @promise    = $.Deferred().resolve(this)

    @set(atts) if atts
    @set('id', @cid) unless atts.id
    @init(arguments...)
    this

  init: ->

  resolve: (callback) =>
    @promise.done(callback)

  get: (key) =>
    if typeof @[key] is 'function'
      @[key]()
    else
      @attributes[key]

  set: (key, val) =>
    # Pass in promise
    if typeof key?.done is 'function'
      key.done @set
      return key

    if typeof key?.attributes is 'object'
      attrs = key.attributes
    else if typeof key is 'object'
      attrs = key
    else if key
      (attrs = {})[key] = val

    changes = []

    for attr, value of (attrs or {})
      if typeof value?.done is 'function'
        value.done (newValue) =>
          @set(attr, newValue)
        continue

      previous = @get(attr)
      continue if eql(previous, value)

      if typeof @[attr] is 'function'
        @[attr](value)
      else
        @attributes[attr] = value
        @[attr] = @attributes[attr]

      changes.push change =
        name: attr,
        type: 'updated',
        previous: previous
        object: this,
        value: value

      @trigger "observe:#{attr}", [change]
      @trigger "update:#{attr}" if change.type == 'updated' and previous

    if changes.length
      @trigger 'observe', changes

    attrs

  updateAttribute: (attr, val) ->
    @set(attr, val)

  getID:  -> @get('id')
  getCID: -> @cid

  increment: (attr, amount = 1) ->
    value = @get(attr) or 0
    @set(attr, value + amount)

  eql: (rec) ->
    return false unless rec
    return false unless rec.constructor is @constructor
    return true if rec.cid is @cid
    return true if rec.get?('id') and rec.get('id') is @get('id')
    false

  fromForm: (form) ->
    result = {}
    for key in $(form).serializeArray()
      result[key.name] = key.value
    @set(result)

  reload: ->
    @set(@setRequest $.getJSON(@uri()))

  exists: ->
    @constructor.exists(@getID())

  add: ->
    @constructor.add(this)

  save: (attrs) =>
    @set(attrs) if attrs
    
    isNew = @isNew()
    type = if isNew then 'POST' else 'PUT'

    @setRequest @set $.ajax
      type:  type
      url:   @uri()
      data:  @toJSON()
      queue: true
      warn:  true

    @add()

    @trigger 'save'
    @trigger if isNew then 'create' else 'update'

    this

  destroy: ->
    @constructor.destroy(@)

    @setRequest @set $.ajax
      type:  "DELETE"
      url:  @uri(@getID()) 
      queue: true
      warn:  true

    @trigger 'destroy'
    this

  bind: (key, callback) ->
    if typeof key is 'function'
      callback = key
      key      = null

    callee = =>
      if key
        callback.call(this, @get(key), this)
      else
        callback.call(this, this)

    if key
      @observeKey(key, callee)
    else
      @observe(callee)

    do callee

  change: (key, callback) ->
    if typeof key is 'function'
      callback = key
      key      = null

    if key
      @on "update:#{key}", =>
        callback.call(this, @get(key), this)
    else
      @observe =>
        callback.call(this, this)

  observeKey: (key, callback) ->
    @on("observe:#{key}", callback)

  unobserveKey: (key, callback) ->
    @off("observe:#{key}", callback)

  observe: (callback) ->
    @on('observe', callback)

  unobserve: (callback) ->
    @off('observe', callback)

  isNew: ->
    not @exists()

  uri: (parts...) =>
    id = @getID()
    if id and not @isNew() 
      @constructor.uri(id, parts...)
    else
      @constructor.uri(parts...)
  
  url: (parts...) =>
    @uri(parts...)

  asJSON: (options = {}) =>
    if options.all
      attributes = @attributes
    else
      attributes = @constructor.attributes

    result = {id: @getID()}
    for key of attributes or {}
      result[key] = @get(key)
    result

  toJSON: => @asJSON()

  toString: =>
    "<#{@constructor.name} (#{JSON.stringify(this)})>"

  # Private

  setRequest: (@request) =>
    @promise = $.Deferred()
    @request.done =>
      @promise.resolve(this)
    @request
   
  fetch: (options = {}) ->
    defaults =
      request:
        url: "#{@constructor.url()}/#{@get('id')}"
     
    options = $.extend(defaults, options)
    @constructor.fetch(options)

module.exports = Model

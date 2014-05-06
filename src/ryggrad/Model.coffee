$           = jQuery
Base        = require('./Base')
Collection  = require('./Collection')
AjaxStorage = require('./storage/Ajax')

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
        name: 'base'
      )
    @collection

  @count: ->
    @records().count()

  @all: (callback, options={}) ->
    @records().all(callback, options)

  @find: (id, options={}) ->
    @records().find(id, options)

  @findBy: (callback, request, options={}) ->
    @records().findBy(callback, request, options)

  @filter: (callback) ->
    @records().filter(callback)

  @add: (values, options={}) ->
    @records().add(values, options)

  @exists: (id) ->
    @records().exists(id)

  @uri: (parts...) ->
    url = @url?() or @url
    [url, parts...].join('/')

  @url: (value) ->
    @url = (-> value) if value
    value or "/#{_.pluralize(@name.toLowerCase())}"
    if @host
       @host + "/" + value
    else
      value

  @pluralName: ->
    "#{_.pluralize(@name.toLowerCase())}"

  @toString: -> @name

  @on_record: (event, callback) ->
    @records().on("record.#{event}", callback)

  @on_collection: (event, callback) ->
    @records().on(event, callback)

  # Private

  @uidCounter: 0

  @uid: (prefix = '') ->
    uid = prefix + @uidCounter++
    uid = @uid(prefix) if @exists(uid)
    uid

  @create: (atts = {}, options={}) ->
    obj = new @(atts)
    resp = obj.save(null, options)
    @trigger('create', resp)
    resp

  @refresh: ->
    @records().refresh(arguments...)

  @destroy: (records, options={}) ->
    resp = @records().remove(records, options)
    @trigger('destroy', resp)
    resp

  @destroyAll: (options = {})  ->
    @records().reset(options)

  @fetch: (options = {}) ->
    resp = @records().fetch(options)
    @trigger('fetch', resp)
    resp

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
      @trigger "update:#{attr}", change if change.type == 'updated' and previous

    if changes.length
      @trigger 'observe', changes

    attrs

  updateAttribute: (attr, val) ->
    @set(attr, val)

  changeID: (id) ->
    return if id is @getID()
    records = @constructor.records().ids
    records[id] = records[@getID()]
    delete records[@getID()] unless @getCID() is @getID()
    @set("id", id)
    @save()

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

  add: (options={}) ->
    @constructor.add(this, options)

  save: (attrs, options={}) =>
    @set(attrs) if attrs

    isNew = @isNew()
    options.isNew = isNew
    @add(options)

    @trigger 'save'
    @trigger if isNew then 'create' else 'update'

    this

  destroy: (options={}) ->
    @constructor.destroy(@, options)

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

  fetch: (options = {}) ->
    defaults =
      request:
        url: "#{@constructor.url()}/#{@get('id')}"

    options = $.extend(defaults, options)
    resp    = @constructor.fetch(options)

    @trigger 'fetch'
    resp

module.exports = Model

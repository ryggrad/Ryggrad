class Ryggrad.Model extends Ryggrad.Module
  @extend Ryggrad.Events
  @records    : []
  @irecords   : {}
  @attributes : []

  @configure: (name, attributes...) ->
    @className = name
    @deleteAll()
    @attributes = attributes if attributes.length
    @attributes and= makeArray(@attributes)
    @attributes or= []

    @unbind()
    @

  @toString: -> "#{@className}(#{@attributes.join(", ")})"

  # Class Methods
  @create: (atts, options) ->
    record = new @(atts)
    record.save(options)

  @exists: (id) ->
    @irecords[id]?.clone()

  @find: (id) ->
    record = @exists(id)
    throw new Error("\"#{@className}\" model could not find a record for the ID \"#{id}\"") unless record
    return record

  @update: (id, atts, options) ->
    @find(id).updateAttributes(atts, options)

  @destroy: (id, options) ->
    @find(id).destroy(options)

  @fetch: (callbackOrParams) ->
    if typeof callbackOrParams is 'function'
      @bind('fetch', callbackOrParams)
    else
      @trigger('fetch', arguments...)

  @change: (callbackOrParams) ->
    if typeof callbackOrParams is 'function'
      @bind('change', callbackOrParams)
    else
      @trigger('change', arguments...)

  @addRecord: (record) ->
    if record.id and @irecords[record.id]
      @irecords[record.id].remove()

    record.id or= record.uid
    @records.push(record)
    @irecords[record.id]  = record
    @irecords[record.uid] = record

  @deleteAll: ->
    @records  = []
    @irecords = {}

  @refresh: (values, options = {}) ->
    @deleteAll() if options.clear

    records = @fromJSON(values)
    records = [records] unless isArray(records)
    @addRecord(record) for record in records
    @sort()

    result = @cloneArray(records)
    @trigger('refresh', result, options)
    result

  @toJSON: ->
    @records

  @fromJSON: (objects) ->
    return unless objects
    if typeof objects is 'string'
      objects = JSON.parse(objects)
    if isArray(objects)
      (new @(value) for value in objects)
    else
      new @(objects)

  @sort: ->
    if @comparator
      @records.sort @comparator

    @

  @findBy: (name, value) ->
    for record in @records
      if record[name] is value
        return record.clone()
    null

  @findAllBy: (name, value) ->
    @select (item) ->
      item[name] is value

  @select: (callback) ->
    (record.clone() for record in @records when callback(record))

  @each: (callback) ->
    callback(record.clone()) for record in @records

  @all: ->
    @cloneArray(@records)

  @first: ->
    @records[0]?.clone()

  @last: ->
    @records[@records.length - 1]?.clone()

  @count: ->
    @records.length

  @recordsValues: ->
    result = []
    result.push(value) for key, value of @records
    result

  @destroyAll: (options) ->
    record.destroy(options) for record in @records

  # Private
  @cloneArray: (array) ->
    (value.clone() for value in array)

  @idCounter: 0

  @uid: (prefix = '') ->
    uid = prefix + @idCounter++
    uid = @uid(prefix) if @exists(uid)
    uid

  # Instance Methods
  constructor: (attributes) ->
    super
    @className = @constructor.name
    @load attributes if attributes
    @uid = atts?.uid or @constructor.uid("uid-")

  isNew: ->
    not @exists()

  isValid: ->
    not @validate()

  validate: ->

  load: (atts) ->
    if atts.id then @id = atts.id
    for key, value of atts
      if atts.hasOwnProperty(key) and typeof @[key] is 'function'
        @[key](value)
      else
        @[key] = value

    @

  attributes: ->
    result = {}
    for key in @constructor.attributes when key of this
      if typeof @[key] is 'function'
        result[key] = @[key]()
      else
        result[key] = @[key]
    result.id = @id if @id
    result

  eql: (rec) ->
    !!(rec and rec.constructor is @constructor and
        ((rec.uid is @uid) or (rec.id and rec.id is @id)))

  save: (options = {}) ->
    unless options.validate is false
      error = @validate()
      if error
        @trigger('error', error)
        return false

    @trigger('beforeSave', options)
    record = if @isNew() then @create(options) else @update(options)
    @stripCloneAttrs()
    @trigger('save', options)
    record

  stripCloneAttrs: ->
    return if @hasOwnProperty 'uid' # Make sure it's not the raw object
    for own key, value of @
      delete @[key] if @constructor.attributes.indexOf(key) > -1
    @

  updateAttribute: (name, value, options) ->
    atts = {}
    atts[name] = value
    @updateAttributes(atts, options)

  updateAttributes: (atts, options) ->
    @load(atts)
    @save(options)

  changeID: (id) ->
    return if id is @id
    records = @constructor.irecords
    records[id] = records[@id]
    delete records[@id]
    @id = id
    @save()

  changeUID: (uid) ->
    records = @constructor.irecords
    records[uid] = records[@uid]
    delete records[@uid]
    @uid = uid
    @save()

  remove: ->
    # Remove record from model
    records = @constructor.records.slice(0)
    for record, i in records when @eql(record)
      records.splice(i, 1)
      break
    @constructor.records = records

    # Remove the ID and UID
    delete @constructor.irecords[@id]
    delete @constructor.irecords[@uid]

  destroy: (options = {}) ->
    @trigger('beforeDestroy', options)
    @remove()
    @destroyed = true
    # handle events
    @trigger('destroy', options)
    @trigger('change', 'destroy', options)
    if @listeningTo
      @stopListening()
    @unbind()
    this

  dup: (newRecord = true) ->
    atts = @attributes()
    if newRecord
      delete atts.id
    else
      atts.uid = @uid
    new @constructor(atts)

  clone: ->
    Object.create(@)

  reload: ->
    return @ if @isNew()
    original = @constructor.find(@id)
    @load(original.attributes())
    original

  refresh: (data) ->
    # go to the source and load attributes
    root = @constructor.irecords[@id]
    root.load(data)
    @trigger('refresh')
    @

  exists: ->
    @constructor.exists(@id)

  # Private
  update: (options) ->
    @trigger('beforeUpdate', options)

    records = @constructor.irecords
    records[@id].load @attributes()

    @constructor.sort()

    clone = records[@id].clone()
    clone.trigger('update', options)
    clone.trigger('change', 'update', options)
    clone

  create: (options) ->
    @trigger('beforeCreate', options)
    @id or= @uid

    record = @dup(false)
    @constructor.addRecord(record)
    @constructor.sort()

    clone = record.clone()
    clone.trigger('create', options)
    clone.trigger('change', 'create', options)
    clone

  bind: (events, callback) ->
    @constructor.bind events, binder = (record) =>
      if record && @eql(record)
        callback.apply(this, arguments)

    # create a wrapper function to be called with 'unbind' for each event
    for singleEvent in events.split(' ')
      do (singleEvent) =>
        @constructor.bind "unbind", unbinder = (record, event, cb) =>
          if record && @eql(record)
            return if event and event isnt singleEvent
            return if cb and cb isnt callback
            @constructor.unbind(singleEvent, binder)
            @constructor.unbind("unbind", unbinder)
    this

  one: (events, callback) ->
    @bind events, handler = =>
      @unbind(events, handler)
      callback.apply(this, arguments)

  trigger: (args...) ->
    args.splice(1, 0, this)
    @constructor.trigger(args...)

  listenTo: -> 
    Ryggrad.Events.listenTo.apply @, arguments
  listenToOnce: -> 
    Ryggrad.Events.listenToOnce.apply @, arguments
  stopListening: -> 
    Ryggrad.Events.stopListening.apply @, arguments

  unbind: (events, callback) ->
    if arguments.length is 0
      @trigger('unbind')
    else if events
      for event in events.split(' ')
        @trigger('unbind', event, callback)

  toJSON: ->
    @attributes()

  toString: ->
    "<#{@constructor.className} (#{JSON.stringify(this)})>"

Ryggrad.Model.setup = (name, attributes = []) ->
  class Instance extends this
  Instance.configure(name, attributes...)
  Instance

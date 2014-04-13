$    = jQuery
Base = require('./Base')
Ajax = require('./storage/Ajax')

class Collection extends Base
  constructor: (options = {}) ->
    unless options.model
      throw new Error('Model required')

    @ids               = {}
    @cids              = {}
    @records           = options.records or []
    @name              = options.name or 'base'
    @model             = options.model
    @comparator        = options.comparator if options.comparator

    @promise           = $.Deferred().resolve(@records)
    @records.observe   = @observe
    @records.unobserve = @unobserve
    @records.promise   = @promise
    @options = options

    @model.storageOptions or= {}
    
    if options.storage
      @storage = new options.storage(this, @model.storageOptions)
    else if @model.storage
      @storage = new @model.storage(this, @model.storageOptions)
    else
      @storage = new Ajax(this, @model.storageOptions)

  count: =>
    @records.length

  filter: (callback) =>
    @records.filter(callback)

  find: (id, options = {}) =>
    unless id
      throw new Error('id required')

    if typeof id.getID is 'function'
      id = id.getID()

    if options.remote
      @storage.find(id, options.remote)
    else
      record   = @syncFind(id)
      record or= @baseSyncFind(id)

  findBy: (callback, request, options={}) =>
    if typeof callback is 'string'
      filter = (r) -> r.get(callback) is request

      if options.remote
        @storage.findBy(callback, request, options)
      else
        @syncFindBy(filter)
    else
      unless typeof callback is 'function'
        throw new Error('callback function required')

      if options.remote
        @storage.findBy(callback, options.remote)
      else
        @syncFindBy(callback)

  refresh: (options = {}) =>
    @reset()
    @fetch(options) if options.remote

  all: (callback, options = {}) =>
    if typeof callback is 'object'
      options  = callback
      callback = options if typeof options is 'function'

    if @shouldPreload() or options.remote
      result = @storage.all(options.remote)
    else
      result = @records

    # @promise.done(callback) if callback

    result

  syncFindBy: (callback) =>
    @records.filter(callback)[0]

  reset: (options={}) =>
    @remove(@records, options)

    @ids  = {}
    @cids = {}

    @trigger('reset', [])
    @trigger('observe', [])

  observe: (callback) =>
    @on('observe', callback)

  unobserve: (callback) =>
    @off('observe', callback)

  fetch: (options = {}) =>
    @storage.all(options.remote)

  each: (callback) =>
    @all().promise.done (records) =>
      callback(rec) for rec in records

  sort: (callback = @comparator) =>
    @records.sort(callback) if callback
    @trigger('sort')
    this

  resort: (callback) =>
    @sort(callback)
    @trigger('resort')
    this

  exists: (record) =>
    if typeof record is 'object'
      id  = record.getID()
      cid = record.getCID()
    else
      id = cid = record

    id of @ids or cid of @cids

  empty: =>
    @records.length is 0

  add: (records, options={}) =>
    return unless records

    # If we're passed a unforfilled promise, then
    # re-add when the promise is finished.
    if typeof records.done is 'function'
      records.done(@add)
      return records

    unless $.isArray(records)
      records = [records]

    # Instantiate the array into model
    # instances if they aren't already
    records = new @model(records)
    changes = []

    for record, i in records
      # If the record already exists, use the same object
      original = @model.collection?.syncFind(record.getID())

      if original
        original.set(record)
        @cids[record.getCID()] or= original
        record = records[i] = original

      continue if @exists(record)

      # Record record, and map IDs for faster lookups
      @records.push(record)
      @cids[record.getCID()] = record
      @ids[record.getID()]   = record if record.getID()

      # Make sure changes are propogated
      record.on('all', @recordEvent)

      # Trigger events
      @trigger('add', record)

      changes.push(
        name: record.getCID(), type: 'new',
        object: this, value: record
      )

    @sort()

    
    if options.remote
      if options.isNew
        @storage.add(records, options.remote)
      else
        @storage.save(records, options.remote)

    # Unless we're the model's base collection
    # also add the record to that
    @model.add(records) unless @isBase()

    @trigger('observe', changes)
    records

  syncFind: (id) =>
    @ids[id] or @cids[id]

  baseSyncFind: (id) =>
    unless @isBase()
      record = @model.collection?.syncFind(id)
      @add(record) if record and not @exists(record)
      record

  remove: (records, options={}) =>
    unless $.isArray(records)
      records = [records]

    for record in records[..]
      # Remove event listeners
      record.off('all', @recordEvent)

      # Remove IDs references
      delete @cids[record.getCID()]
      delete @ids[record.getID()] if record.getID()

      # Lastly remove record
      index = @records.indexOf(record)
      @records.splice(index, 1)
    
    @storage.destroy(records, options.remote) if options.remote

  comparator: (a, b) ->
    if a > b
      return 1
    else if a < b
      return -1
    else
      return 0

  shouldPreload: =>
    @empty() and !@request

  syncFindBy: (callback) =>
    @records.filter(callback)[0]

  recordEvent: (event, args, record) =>
    @trigger("record.#{event}", record, args)

  isBase: =>
    return true if @name is 'base'
    @model.collection is this

module.exports = Collection

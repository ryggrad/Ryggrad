Theorist = require("theorist")
Ajax     = require('./storage/Ajax')

class Collection extends Theorist.Sequence
  constructor: (options={}) ->
    @ids = {}
    
    if options.model
      @model = options.model
      @name  = options.model.pluralName()
      @model = options.model
      @model.storageOptions or= {}
      
      if options.storage
        @storage = new options.storage(this, @model.storageOptions)
      else if @model.storage
        @storage = new @model.storage(this, @model.storageOptions)
      else
        @storage = new Ajax(this, @model.storageOptions)

    super()
  
  count: ->
    @length

  realCount: ->
    index = 0
    index++ for record in @
    index

  url: ->
    @model.url()

  add: (records, options={}) ->
    if typeof records is "Array"
      for record in records
        @ids[record.id] = record
        record.index = @length
        @push(record)
    else
      @ids[records.id] = records
      records.index = @length
      @push(records)

  fromJSON: (records) ->   
    for record in records
      if @ids[record.id]
        @ids[record.id].set(record)
      else
        new @model(record)

  removeAll: ->
    @ids = {}
    @setLength(0)

  remove: (records, options={}) ->
    return @removeAll() if records.length is @length
    if typeof records is "Array"
      for record in records 
        delete @ids[record.id]
        @splice(record.index, 1)
    else
      delete @ids[records.id]
      @splice(records.index, 1)
  
  findById: (id) ->
    record = @ids[id]
    return record if record
    false

  fetch: (records, options={}) ->
    @storage.read(records, options)

  create: (records, options={}) ->
    @add(records, options)
    @storage.create(records, options)

  save: (records, options={}) ->
    @storage.update(records, options)

  destroyAll: (options={}) ->
    ret = @storage.delete(this, options)
    @removeAll()
    ret

  destroy: (records, options={}) ->
    ret = @storage.delete(records, options)
    @remove(records, options)
    ret

  toJSON: ->
    result = []
    for record in @
      result.push(record.toJSON())

    result

module.exports = Collection

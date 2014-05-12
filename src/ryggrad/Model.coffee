Theorist   = require("theorist")
Collection = require('./Collection')

_ = require('underscore')
_.mixin(require('underscore.inflections'))

class Model extends Theorist.Model
  @records: ->
    unless @hasOwnProperty('collection')
      @collection = new Collection(model: this)
    @collection

  @uri: (parts...) ->
    url = @url?() or @url
    [url, parts...].join('/')

  @url: (value) ->
    @url = (-> value) if value
    path = value or @pluralName()
    if @host
       @host + "/" + path
    else
      "/" + path

  @pluralName: ->
    "#{_.pluralize(@name.toLowerCase())}"

  @all: ->
    @records()

  @remove: ->
     @records().removeAll()

  @findById: (id) ->
    @records().findById(id)

  @findBy: (key, val) ->
    record = false
    for record in @records()
      return record if record.get(key) == val
    
    record

  @count: ->
    @records().realCount()

  @toJSON: ->
    @records().toJSON()
  
  ##
  # Async
  ##
  @create: (atts = {}) ->
    obj = new @(atts) 
    @records().create(obj)

  @fetch: ->
    @records().fetch(@records(), arguments)

  @save: ->
    @records().save(@records(), arguments)

  @destroy: ->
    @records().destroyAll(arguments)

  constructor: (atts = {}, skipAdd) ->
    super(atts)
    invalidMSG = @isValid()
    throw new Error(invalidMSG) if invalidMSG
    @constructor.records().add(this) unless skipAdd

  isValid: ->
    @validate() if @validate

  isModel: true

  ##
  # Async
  ##
  fetch: ->
    @constructor.records().fetch(this, arguments)

  save: ->
    @constructor.records().save(this, arguments)

  destroy: ->
    super(arguments)
    @constructor.records().destroy(this, arguments)

  changeID: (id) ->
    oldid = @id
    @constructor.records().remove(this)
    @set(id: id)
    @constructor.records().add(this)

  uri: (parts...) =>
    id = @get('id')
    if id
      @constructor.uri(id, parts...)
    else
      @constructor.uri(parts...)

  url: (parts...) =>
    @uri(parts...)

  toJSON: (options) ->
    result = {id: @get('id')}
    for key of @declaredPropertyValues or {}
      result[key] = @get(key)
    result

  fromJSON: (values) ->
    @changeID(values.id) if values.id and @id isnt values.id
    @set(values)

module.exports = Model

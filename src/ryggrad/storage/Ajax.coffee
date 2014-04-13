Storage = require('./Storage')

class Ajax extends Storage
  constructor: (args...) ->
    super(args...)

    if 'all' of @options
      @allRequest = @options.all

    if 'find' of @options
      @findRequest = @options.find

  ##
  # Create
  ##
  add: (records) ->
    unless $.isArray(records)
      records = [records]

    for record in records
      isNew = record.isNew()
      type = if isNew then 'POST' else 'PUT'

      @setRequest record.set $.ajax
        type:  type
        url:   record.uri()
        data:  record.toJSON()
        queue: true
        warn:  true

      @request.done (result) =>
        if result.id and record.id isnt result.id
          record.changeID(result.id)

        record.set(result)
        
  ##
  # Read
  ##
  all: (options = {}) =>
    return unless @allRequest and @model.uri()

    @request = @allRequest.call(@model, @model, options.request)
    @records.request = @request
    @records.promise = @promise = $.Deferred()
    @request.done (result) =>
      @collection.add(result)
      @promise.resolve(@records)

    @request

  find: (id, options = {}) =>
    record         = new @model(id: id)
    request        = @asyncFindRequest.call(@model, record, options.request)
    record.request = request
    record.promise = $.Deferred()

    request.done (response) =>
      record.set(response)
      record.promise.resolve(record)
      @collection.add(record)

    record

  findBy: (ajaxRequest) ->
    record         = new @model
    request        = ajaxRequest.call(@model, record)
    record.request = request
    record.promise = $.Deferred()

    request.done (response) =>
      record.set(response)
      record.promise.resolve(record)
      @collection.add(record)

    record

  ##
  # Update
  ##
  save: (records) ->
    unless $.isArray(records)
      records = [records]

    for record in records
      isNew = record.isNew()
      type = if isNew then 'POST' else 'PUT'

      @setRequest record.set $.ajax
        type:  type
        url:   record.uri()
        data:  record.toJSON()
        queue: true
        warn:  true
  ##
  # Delete
  ##
  destroy: (records) ->
    unless $.isArray(records)
      records = [records]

    for record in records
      @setRequest record.set $.ajax
        type:  "DELETE"
        url:  record.uri(record.getID())
        queue: true
        warn:  true

  allRequest: (model, options = {}) =>
    defaults =
      url: model.uri()
      dataType: 'json'
      type: 'GET'

    $.ajax($.extend(defaults, options))

  findRequest: (record, options = {}) =>
    defaults =
      url: record.uri()
      dataType: 'json'
      type: 'GET'

    $.ajax($.extend(defaults, options))

  setRequest: (@request) =>
    @promise = $.Deferred()
    @request.done =>
      @promise.resolve(this)
    @request

module.exports = Ajax

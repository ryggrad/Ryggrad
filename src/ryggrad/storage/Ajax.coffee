Storage = require('./Storage')
$       = jQuery

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
  add: (records, options={}) =>
    unless $.isArray(records)
      records = [records]

    for record in records
      isNew = options.isNew
      isNew or= true
      type  = if isNew then 'POST' else 'PUT'

      request = $.ajax
        type:  type
        url:   record.uri()
        data:  record.toJSON()
        queue: true
        warn:  true

      record.request = request

      request.done (result) =>
        if result.id and record.id isnt result.id
          record.changeID(result.id)

        record.set(result)
        record.promise.resolve(record)

  ##
  # Read
  ##
  all: (options = {}) =>
    return unless @allRequest and @model.uri()

    @request = @allRequest.call(@model, @model, options.request)
    @records.request = @request
    @request.done (result) =>
      @collection.add(result)
      @records.promise.resolve(@records)

    @records

  find: (id, options = {}) =>
    record         = new @model(id: id)
    request        = @findRequest.call(@model, record, options.request)
    record.request = request

    request.done (response) =>
      record.set(response)
      record.promise.resolve(record)
      @collection.add(record)

    record

  findBy: (ajaxRequest) =>
    record         = new @model
    request        = ajaxRequest.call(@model, record)
    record.request = request

    request.done (response) =>
      record.set(response)
      record.promise.resolve(record)
      @collection.add(record)

    record

  ##
  # Update
  ##
  save: (records, options={}) =>
    @add(records, options)

  ##
  # Delete
  ##
  destroy: (records) =>
    unless $.isArray(records)
      records = [records]

    for record in records
      request = $.ajax
        type:  "DELETE"
        url:  record.uri(record.getID())
        queue: true
        warn:  true

      record.request = request
      request.done (response) =>
        record.set(response)
        record.promise.resolve(record)

  allRequest: (model, options = {}) =>
    defaults =
      url: model.uri()
      dataType: 'json'
      type: 'GET'
      queue: true
      warn:  true

    $.ajax $.extend(defaults, options)

  findRequest: (record, options = {}) =>
    defaults =
      url: record.uri()
      dataType: 'json'
      type: 'GET'
      queue: true
      warn:  true

    $.ajax $.extend(defaults, options)

module.exports = Ajax

class Collection extends Ryggrad.Module
  constructor: (options = {}) ->
    for key, value of options
      @[key] = value

  all: ->
    @model.select (rec) => @associated(rec)

  first: ->
    @all()[0]

  last: ->
    values = @all()
    values[values.length - 1]

  count: ->
    @all().length

  find: (id) ->
    records = @select (rec) =>
      "#{rec.id}" is "#{id}"
    throw new Error("\"#{@model.className}\" model could not find a record for the ID \"#{id}\"") unless records[0]
    records[0]

  findAllBy: (name, value) ->
    @model.select (rec) =>
      @associated(rec) and rec[name] is value

  findBy: (name, value) ->
    @findAllBy(name, value)[0]

  select: (cb) ->
    @model.select (rec) =>
      @associated(rec) and cb(rec)

  refresh: (values) ->
    return this unless values?
    for record in @all()
      delete @model.irecords[record.id]
      for match, i in @model.records when match.id is record.id
        @model.records.splice(i, 1)
        break
    values = [values] unless isArray(values)
    for record in values
      record.newRecord = false
      record[@fkey] = @record.id
    @model.refresh values
    this

  create: (record, options) ->
    record[@fkey] = @record.id
    @model.create(record, options)

  add: (record, options) ->
    record.updateAttribute @fkey, @record.id, options

  remove: (record, options) ->
    record.updateAttribute @fkey, null, options

  # Private
  associated: (record) ->
    record[@fkey] is @record.id

module.exports = Collection

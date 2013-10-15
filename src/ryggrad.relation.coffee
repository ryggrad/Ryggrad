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

class Instance extends Ryggrad.Module
  constructor: (options = {}) ->
    for key, value of options
      @[key] = value

  exists: ->
    return if @record[@fkey] then @model.exists(@record[@fkey]) else false

  update: (value) ->
    return this unless value?
    unless value instanceof @model
      value = new @model(value)

    value.save() if value.isNew()
    @record[@fkey] = value and value.id
    this

class Singleton extends Ryggrad.Module
  constructor: (options = {}) ->
    for key, value of options
      @[key] = value

  find: ->
    @record.id and @model.findBy(@fkey, @record.id)

  update: (value) ->
    return this unless value?
    unless value instanceof @model
      value = @model.fromJSON(value)

    value[@fkey] = @record.id
    value.save()
    this

singularize = (str) ->
  str.replace(/s$/, '')

underscore = (str) ->
  str.replace(/::/g, '/')
     .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
     .replace(/([a-z\d])([A-Z])/g, '$1_$2')
     .replace(/-/g, '_')
     .toLowerCase()

association = (name, model, record, fkey, Ctor) ->
  model = require(model) if typeof model is 'string'
  new Ctor(name: name, model: model, record: record, fkey: fkey)

Ryggrad.Collection = Collection
Ryggrad.Singleton  = Singleton
Ryggrad.Instance   = Instance

Ryggrad.Model.extend
  hasMany: (name, model, fkey) ->
    fkey ?= "#{underscore(this.className)}_id"
    @::[name] = (value) ->
      association(name, model, @, fkey, Ryggrad.Collection).refresh(value)

  belongsTo: (name, model, fkey) ->
    fkey ?= "#{underscore(singularize(name))}_id"
    @::[name] = (value) ->
      association(name, model, @, fkey, Ryggrad.Instance).update(value).exists()

    @attributes.push(fkey)

  hasOne: (name, model, fkey) ->
    fkey ?= "#{underscore(@className)}_id"
    @::[name] = (value) ->
      association(name, model, @, fkey, Ryggrad.Singleton).update(value).find()

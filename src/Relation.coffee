association = (name, model, record, fkey, Ctor) ->
  model = require(model) if typeof model is 'string'
  new Ctor(name: name, model: model, record: record, fkey: fkey)

Model.extend
  hasMany: (name, model, fkey) ->
    fkey ?= "#{underscore(this.className)}_id"
    @::[name] = (value) ->
      association(name, model, @, fkey, Collection).refresh(value)

  belongsTo: (name, model, fkey) ->
    fkey ?= "#{underscore(singularize(name))}_id"
    @::[name] = (value) ->
      association(name, model, @, fkey, Instance).update(value).exists()

    @attributes.push(fkey)

  hasOne: (name, model, fkey) ->
    fkey ?= "#{underscore(@className)}_id"
    @::[name] = (value) ->
      association(name, model, @, fkey, Singleton).update(value).find()

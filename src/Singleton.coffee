class Singleton extends Module
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

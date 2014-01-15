class Instance extends Module
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

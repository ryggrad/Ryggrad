class Storage
  constructor: (@collection, storageOptions) ->
    @model    = @collection.model
    @options  = @collection.options
    @records  = @collection.records
    @key_name = @model.pluralName()
    
  ##
  # Create
  ##
  add: (records) ->

  ## 
  # Read
  ##
  all: (options = {}) =>
  find: ->
  findBy: ->

  ##
  # Update
  ##
  save: (records) ->
  
  ##
  # Delete
  ## 
  destroy: (records) ->

module.exports = Storage

class Storage
  constructor: (@collection) ->
    @model   = @collection.model
    @options = @collection.options
    @records = @collection.records
    
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

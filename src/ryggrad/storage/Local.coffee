Storage = require('./Storage')

class Local extends Storage
  ##
  # Create
  ##
  add: (records) ->
    unless $.isArray(records)
      records = [records]

    localStorage[@collection] = JSON.stringify(records.asJSON())

    for record in records
      localStorage[record.id]  = record.asJSON()
      localStorage[record.cid] = record.asJSON()
  ## 
  # Read
  ##
  all: ->
    JSON.parse(localStorage[@collection])

  find: (record) ->
    if localStorage[record.id]
      return new @model(JSON.parse(localStorage[record.id]))
    else if localStorage[record.cid]
      return new @model(JSON.parse(localStorage[record.cid]))
    else
      return new @model()

  findBy: (callback) ->
    records = JSON.parse(localStorage[@collection])
    new @model(records.filter(callback)[0])

  ##
  # Update
  ##
  save: (records) ->
    @add(records)
  
  ##
  # Delete
  ## 
  destroy: (records) ->
    unless $.isArray(records)
      records = [records]

    for record in records
      delete localStorage[record.id]  if localStorage[record.id] 
      delete localStorage[record.cid] if localStorage[record.cid]

module.exports = Local

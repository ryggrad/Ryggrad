Storage = require('./Storage')

class Local extends Storage
  ##
  # Create
  ##
  add: (records) ->
    unless $.isArray(records)
      records = [records]

    localStorage[@key_name] = JSON.stringify(@records)

    for record in records
      localStorage[record.id]  = record.asJSON()
      localStorage[record.cid] = record.asJSON()

  ##
  # Read
  ##
  all: ->
    if localStorage[@key_name]
      result = JSON.parse(localStorage[@key_name])
      @collection.add(result)

    @records

  find: (record) ->
    newRecord = null

    if localStorage[record.id]
      newRecord = new @model(JSON.parse(localStorage[record.id]))
    else if localStorage[record.cid]
      newRecord = new @model(JSON.parse(localStorage[record.cid]))
    else
      newRecord = new @model()

    @collection.add(newRecord)
    newRecord

  findBy: (callback) ->
    records = JSON.parse(localStorage[@key_name]) if localStorage[@key_name]
    newRecord = new @model(records.filter(callback)[0])

    @collection.add(newRecord)
    newRecord

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

    localStorage[@key_name] = JSON.stringify(@records)

module.exports = Local

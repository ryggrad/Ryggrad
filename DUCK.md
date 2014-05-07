## TODO;

- [ ] swappable storage engines

For swappable storage engines we just have something that implements
create, read, update, delete

Then inside each method at the end we pass off to the current storage engine. Which is set on the instance
of the model and defaults to Ajax

All the mehtods should take place on the Collection. The model is dumb and has no idea how to create, read, update, delete

It will look like this

```coffescript
Storage =
  ##
  # Create
  ##
  add: (records) ->

  ##
  # Read
  ##
  all: ->
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
```

Even asynchronous methods return records. They just are records with a promise object on them.
This means you can utilize the records immediately. And they just get update with their data later.
Keeps the API consistent across different implementations. If you ever end up with a slow storage machanism
then you can just return empty records with a promise object on them. The only place you will have
to change the code is in the storage mechanism. Simple!

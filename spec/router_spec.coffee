describe "Route", ->
  router = new Ryggrad.Router()

  navigate = ->
    args = (if 1 <= arguments.length then [].slice.call(arguments, 0) else [])
    changed = false
    $.Deferred((dfd) ->
      router.bind "change", -> changed = true

      router.navigate.apply router, args

      dfd.resolve()

    ).promise()

  it "should not have bound any hashchange|popstate event to window", ->
    events = $(window).data("events") 
    events or= {}
    expect("hashchange" of events or "popstate" of events).to.be.false

  it "can set its path", ->
    router.getPath().should.be.falsey
    router.change()
    router.getPath().should.be.truthy

  it "can add a single route", ->
    router2 = new Ryggrad.Router()
    router2.add "/foo"
    router2.routes.length.should.be 1

  it "can add a bunch of routes", ->
    router2 = new Ryggrad.Router()
    router2.add
      "/foo": ->
      "/bar": ->

    router2.routes.length.should.be 2

  it "can add regex route", ->
    router2 = new Ryggrad.Router()
    router2.add /\/users\/(\d+)/
    router2.routes.length.should.be 1

  it "should trigger 'change' when a route matches", ->
    changed = 0
    router.on "change", -> changed += 1
    
    router.add "/foo", ->
    router.navigate "/foo"
    
    changed.should.be 0

  it "can navigate to path", ->
    router.add "/users", ->

    navigate("/users").done ->
      router.path.should.be "/users"

  it "can navigate to a path splitted into several arguments", ->
    router.add "/users/1/2", ->

    navigate("/users", 1, 2).done ->
      router.getPath().should.be "/users/1/2"
  
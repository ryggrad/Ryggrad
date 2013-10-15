describe "Route", ->
  Route = Ryggrad.Route
  RouteOptions = Route.options

  navigate = ->
    args = (if 1 <= arguments.length then [].slice.call(arguments, 0) else [])
    changed = false
    $.Deferred((dfd) ->
      Route.bind "change", -> changed = true

      Route.navigate.apply Route, args

      dfd.resolve()

    ).promise()

  beforeEach ->
    Route.options = RouteOptions

  afterEach ->
    Route.unbind()
    Route.routes = []
    delete Route.path

  it "should not have bound any hashchange|popstate event to window", ->
    events = $(window).data("events") 
    events or= {}
    expect("hashchange" of events or "popstate" of events).to.be.false

  it "can set its path", ->
    Route.getPath().should.be.falsey
    Route.change()
    Route.getPath().should.be.truthy
 
  it "can add a single route", ->
    Route.add "/foo"
    Route.routes.length.should.be 1

  it "can add a bunch of routes", ->
    Route.add
      "/foo": ->
      "/bar": ->

    Route.routes.length.should.be 2

  it "can add regex route", ->
    Route.add /\/users\/(\d+)/
    Route.routes.length.should.be 1

  it "should trigger 'change' when a route matches", ->
    changed = 0
    Route.bind "change", -> changed += 1

    Route.add "/foo", ->
    Route.navigate "/foo"

    changed.should.be 1

  it "can navigate to path", ->
    Route.add "/users", ->

     navigate("/users").done ->
      Route.path.should.be "/users"

  it "can navigate to a path splitted into several arguments", ->
    Route.add "/users/1/2", ->
 
    navigate("/users", 1, 2).done ->
      Route.getPath().should.be "/users/1/2"

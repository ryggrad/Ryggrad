##
# TODO
# This spec has to be run in a browser. Unfortunately phantomjs does not like it and I have yet to figure out why exactly.
# You might also need to run this in a browse without protections against local files doing ajax requests.
# Webkit should be good.
describe "Ryggrad.Ajax", ->
  User = undefined
  spy  = undefined

  beforeEach ->
    class User extends Ryggrad.Model
      @key "first", String
      @key "last",  String

    spy = sinon.spy(jQuery, "ajax")

  afterEach ->
    spy.restore()

  it "can GET a collection on fetch", ->
    ajaxArgs = 
      dataType: "json"
      type: "GET"
      url: "/users"

    spy.withArgs ajaxArgs
    User.fetch()
    spy.withArgs(ajaxArgs).should.have.been.called

  it "can GET a record on fetch", ->
    User.add [
      first: "John"
      last: "Williams"
      id: "IDD"
    ]
 
    user = User.all()[0]
    ajaxArgs =
      dataType: "json"
      type: "GET"
      url: "/users/IDD"
 
    spy.withArgs(ajaxArgs)
    user.fetch()
    spy.withArgs(ajaxArgs).should.have.been.called

  it "allows undeclared attributes from server", ->
    User.add [
      id: "12345"
      first: "Hans"
      last: "Zimmer"
      created_by: "spine_user"
      created_at: "2013-07-14T14:00:00-04:00"
      updated_at: "2013-07-14T14:00:00-04:00"
    ]

    User.all()[0].created_by.should.equal "spine_user"
   
  it "should send POST on save", ->
    ajaxArgs = 
      data: 
        first: "Hans"
        id: "IDD"
        last: "Zimmer"
      queue: true
      type: "POST"
      url: "/users"
      warn: true

    spy.withArgs(ajaxArgs)

    user = User.create
      first: "Hans"
      last: "Zimmer"
      id: "IDD"
    
    spy.withArgs(ajaxArgs).should.have.been.called

  it "should send PUT on update", ->
    user = User.create
      first: "John"
      last: "Williams"
      id: "IDD"

    ajaxArgs = 
      data: 
        first: "John2"
        id: "IDD"
        last: "Williams2"
      queue: true
      type: "PUT"
      url: "/users/IDD"
      warn: true

    spy.withArgs(ajaxArgs)

    user.save
      first: "John2"
      last: "Williams2"

    spy.withArgs(ajaxArgs).should.have.been.called

  it "should send DELETE on destroy", ->
    user = User.create
      first: "John"
      last: "Williams"
      id: "IDD"

    ajaxArgs = 
      queue: true
      type: "DELETE"
      url: "/users/IDD"
      warn: true

    spy.withArgs(ajaxArgs)

    user.destroy()

    spy.withArgs(ajaxArgs).should.have.been.called

  it "should have a url function", ->
    User.url().should.be "/users"
    User.url("search").should.be "/users/search"
    user = new User(id: 1)
    user.url().should.be "/users/1"
    user.url("custom").should.be "/users/1/custom"
  
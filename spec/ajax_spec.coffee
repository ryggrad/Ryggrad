describe "Ryggrad.Ajax", ->
  User = undefined
  spy = sinon.spy(jQuery, "ajax")

  beforeEach ->
    class User extends Ryggrad.Model
      @key "first", String
      @key "last",  String

  afterEach ->
    spy.reset()
    User.destroyAll()

  it "can GET a collection on fetch", ->
    ajaxArgs = 
      url: "/users", 
      dataType: "json", 
      type: "GET", 
      queue: true, 
      warn: true
  
    User.fetch()
    spy.should.have.been.calledWith(ajaxArgs)

  it "can GET a record on fetch", ->
    User.add [
      first: "John"
      last: "Williams"
      id: "IDD"
    ]
  
    user = User.all()[0]
    ajaxArgs =
      url: "/users/IDD"
      dataType: "json"
      type: "GET"
      queue: true, 
      warn: true
  
    user.fetch()

    spy.should.have.been.calledWith(ajaxArgs)
 
  it "should send POST on save", ->
    ajaxArgs = 
      type: "POST", 
      url: "/users/IDD"
      data:
        id: "IDD"
        first: "Hans"
        last: "Zimmer"
      queue: true
      warn: true

    user = User.create
      first: "Hans"
      last: "Zimmer"
      id: "IDD"
    , remote: true
    

    spy.should.have.been.calledWith(ajaxArgs)

  it "should send PUT on update", ->
    user = User.create
      first: "John"
      last: "Williams"
      id: "IDD"
    , remote: true

    spy.reset()
 
    ajaxArgs = 
      type: "POST"
      url: "/users/IDD"
      data: 
        id: "IDD"
        first: "John2" 
        last: "Williams2"
      queue: true
      warn: true

    user.save
      first: "John2"
      last: "Williams2"
    , remote: true

    spy.should.have.been.calledWith(ajaxArgs)

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

    user.destroy remote: true

    spy.should.have.been.calledWith(ajaxArgs)
  
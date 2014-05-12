describe "Ryggrad.Ajax", ->
  User = undefined
  spy = sinon.spy(jQuery, "ajax")

  beforeEach ->
    class User extends Ryggrad.Model
      @properties "first", "last"

  afterEach ->
    spy.reset()
    User.remove()

  it "can GET a collection on fetch", ->
    ajaxArgs =
      url: "/users",
      dataType: "json",
      type: "GET",
      queue: true,
      warn: true

    User.fetch()
    spy.should.have.been.called
    spy.should.have.been.calledWith(ajaxArgs)

  it "can GET a record on fetch", ->
    user = new User
      first: "John"
      last: "Williams"
      id: "IDD"
 
    ajaxArgs =
      url: "/users/IDD"
      dataType: "json"
      type: "GET"
      queue: true,
      warn: true
 
    user.fetch()
 
    spy.should.have.been.calledWith(ajaxArgs)
 
  it "should send POST on create", ->
    ajaxArgs =
      type: "POST",
      url: "/users"
      dataType: "json"
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
    
    spy.should.have.been.calledWith(ajaxArgs)

  it "should send PUT on update", ->
    user = new User
      first: "John"
      last: "Williams"
      id: "IDD"

    ajaxArgs =
      type: "PUT"
      url: "/users/IDD"
      dataType: "json"
      data:
        id: "IDD"
        first: "John"
        last: "Williams"
      queue: true
      warn: true

    user.save
      first: "John2"
      last: "Williams2"

    spy.should.have.been.calledWith(ajaxArgs)

  it "should send DELETE on destroy", ->
    user = new User
      first: "John"
      last: "Williams"
      id: "IDD"

    ajaxArgs =
      dataType: "json"
      queue: true
      type: "DELETE"
      url: "/users/IDD"
      warn: true

    user.destroy()

    spy.should.have.been.calledWith(ajaxArgs)

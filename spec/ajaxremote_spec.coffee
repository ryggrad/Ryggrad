users = [
  {first: "Bob", last: "Frank"},
  {first: "Bob2", last: "Frank2"}
]

$.mockjax
  responseTime: 1
  url: "/users"
  type: "GET"
  responseText: users

$.mockjax
  responseTime: 1
  type: "POST"
  url: "/users"
  responseText: {cats: "dogs", id: "bob"}

$.mockjax
  responseTime: 1
  url: "/users/getty"
  type: "GET"
  responseText: {id: "bob"}

$.mockjax
  responseTime: 1
  url: "/users/getty"
  type: "PUT"
  responseText: {id: "bob"}

$.mockjax
  responseTime: 1
  url: "/users/getty"
  type: "DELETE"
  responseText: {id: "bob"}

$.mockjax
  responseTime: 1
  url: "/users"
  type: "DELETE"
  responseText: users

describe "Ryggrad.Ajax Remote", ->
  User = undefined
  # usersC = undefined

  beforeEach ->
    class User extends Ryggrad.Model
      @properties "first", "last"
    
  afterEach: ->
    User.remove()

  it "should create", (done) ->
    User.create().done ->
      User.all()[0].cats.should.equal "dogs"
      done()

  it "should create and then change the id", (done) ->
    User.create().done ->
      user = User.all()[0]
      user.id.should.equal "bob"
      User.records().ids[user.id].should.be.an.instanceOf User
      done()

  it "should fetch all items", (done) ->
    User.count().should.equal 0

    User.fetch().done (resp) ->
      User.count().should.equal 2
      done()

  it "should fetch a single item", (done) ->
    user = new User(id: "getty")
    user.fetch().done ->
      user.id.should.equal "bob"
      done()

  it "should update", (done) ->
    user = new User(id: "getty")
    user.save().done ->
      user.id.should.equal "bob"
      done()

  it "should delete", (done) ->
    user = new User(id: "getty")
    user.destroy().done ->
      (1 + 1).should.equal 2
      done()
  
  it "should delete all", (done) ->
    User.destroy().done ->
      (1 + 1).should.equal 2
      done()

describe "Module", ->
  User = undefined

  beforeEach ->
    class User extends Ryggrad.Module

  it "can create subclasses", ->
    User.extend classProperty: true
    Friend = User.create()
    Friend.should.not.be.null
    Friend.classProperty.should.not.be.null

  it "can create instance", ->
    User.include instanceProperty: true
    Bob = new User()
    Bob.should.not.be.null
    Bob.instanceProperty.should.not.be.null

  it "can be extendable", ->
    User.extend classProperty: true
    User.classProperty.should.be.true
  
  it "can be includable", ->
    User.include instanceProperty: true
    User::instanceProperty.should.be.true
    (new User()).instanceProperty.should.be.true
  
  it "should trigger module callbacks", ->
    class module
      @included: ->
  
      @extended: ->
  
    spy = sinon.spy module, "included"
    User.include module
    spy.should.have.been.called
   
    spy = sinon.spy module, "extended"
    User.extend module
    spy.should.have.been.called
  
  it "include/extend should raise without arguments", ->
    expect(->
      User.include()
    ).to.throw(Error)
  
    expect(->
      User.extend()
    ).to.throw(Error)
  
  it "can proxy functions in class/instance context", ->
    func = ->
      this
  
    User.proxy(func)().should.be User
    user = new User()
    user.proxy(func)().should.be user
  
describe "Events", ->
  EventTest = undefined
  spy       = undefined

  beforeEach ->
    EventTest = Ryggrad.Module.create()
    EventTest.extend Ryggrad.Events
    spy = sinon.spy()

  it "can bind/trigger events", ->
    EventTest.bind "hello", spy
    EventTest.trigger "hello"
    spy.should.have.been.called

  it "should trigger correct events", ->
    EventTest.bind "hello", spy
    EventTest.trigger "bye"
    spy.should.not.have.been.called

  it "can bind/trigger multiple events", ->
    EventTest.bind "house car windows", spy
    EventTest.trigger "car"
    spy.should.have.been.called

  it "can pass data to triggered events", ->
    EventTest.bind "yoyo", spy
    EventTest.trigger "yoyo", 5, 10
    spy.should.have.been.called

  it "can unbind events", ->
    EventTest.bind "hello", spy
    EventTest.unbind "hello"
    EventTest.trigger "hello"
    spy.should.not.have.been.called

  # TODO
  it "should allow a callback to unbind itself", ->
    a = sinon.spy()
    b = sinon.spy(b)
    c = sinon.spy()
    
    #b = ->
    #   EventTest.unbind "once", b

    EventTest.bind "once", a
    EventTest.bind "once", b
    EventTest.bind "once", c
    EventTest.trigger "once"

    a.should.have.been.called
    b.should.have.been.called
    c.should.have.been.called

    EventTest.trigger "once"
    a.callCount.should.equal 2
    # b.callCount.should.equal 1
    c.callCount.should.equal 2

  it "can cancel propogation", ->
    EventTest.bind "bye", ->
      false

    EventTest.bind "bye", spy
    EventTest.trigger "bye"
    spy.should.not.have.been.called

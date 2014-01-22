describe "Model Attribute Tracking", ->
  Puppy = undefined
  Cat   = undefined
  spy   = undefined

  beforeEach ->
    class Puppy extends Ryggrad.Model
      @key "name", String

    class Cat extends Ryggrad.Model
      @key "name", Object 

    spy = sinon.spy()

  it 'fires an update:name event when name is updated', ->
    gus = Puppy.create(name: 'gus')
    gus.change 'name', spy
    gus.updateAttribute('name', 'henry')
    spy.should.have.been.called
  
  it "doesn't fire an update:name event if the new name isn't different", ->
    gus = new Puppy(name: 'gus')
    gus.change 'name', spy
    gus.updateAttribute('name', 'gus')
    spy.called.should.be.false

  it "doesn't fire an event when an attribute is updated with an equivalent object", ->
    henry = Cat.create(name: {first: 'Henry', last: 'Lloyd'})
    henry.change 'name', spy
    henry.updateAttribute('name', {first: 'Henry', last: "Lloyd"})
    spy.called.should.be.false
  
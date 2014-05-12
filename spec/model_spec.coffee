describe "Model", ->
  Asset = undefined
  
  beforeEach ->
    class Asset extends Ryggrad.Model
      @properties 'name'

      validate: ->
        "Name required" unless @name

  afterEach ->
    Asset.remove()

  it "can create records", ->
    Asset.count().should.equal 0
    asset = new Asset name: "test.pdf"

    # Compare this way because JS is annoying
    Asset.all()[0].id.should.equal asset.id
    Asset.all()[0].name.should.equal asset.name

    Asset.count().should.equal 1

  it "can update records", ->
    asset = new Asset name: "test.pdf"
    Asset.all()[0].name.should.equal "test.pdf"

    asset.name = "wem.pdf"
    Asset.all()[0].name.should.equal "wem.pdf"

  it "can destroy records", ->
    asset = new Asset name: "test.pdf"
    Asset.all()[0].id.should.equal asset.id
    asset.destroy()
    expect(Asset.all()[0]).to.be.undefined

  it "can find records", ->
    asset = new Asset name: "test.pdf", id: "asset2"
    Asset.findById(asset.id).should.be.instanceof Asset
    
    asset_id = asset.id
    asset.destroy()
    Asset.findById(asset_id).should.be.falsey

  it "can find records by attribute", ->
    asset = new Asset name: "cats.pdf"
    asset_found = Asset.findBy("name", "cats.pdf")
    asset_found.name.should.equal asset.name

  it "can return all records", ->
    asset1 = new Asset(name: "test.pdf")
    asset2 = new Asset(name: "foo.pdf")
    Asset.all()[0].name.should.equal asset1.name
    Asset.all()[1].name.should.equal asset2.name

  it "can destroy all records", ->
    new Asset name: "foo1.pdf"
    new Asset name: "foo2.pdf"
    Asset.count().should.equal 2
    Asset.destroy()
    Asset.count().should.equal 0

  it "can be serialized into JSON", ->
    asset = new Asset id: "cats", name: "Johnson me!"
    Asset.toJSON().should.deep.equal [{id: "cats", name: "Johnson me!"}]
    asset.toJSON().should.deep.equal {id: "cats", name: "Johnson me!"}

  it "can validate", ->
    badConstruct = ->
      new Asset()
    
    badConstruct.should.throw(/Name required/)

  it "clones are dynamic", ->
    asset = new Asset name: "hotel california"
    clone = Asset.findById(asset.id)
    asset.name = "checkout anytime"
    clone.name.should.equal "checkout anytime"

   it "should be able to change ID", ->
     asset = new Asset name: "hotel california"
     asset.id.should.not.be null
     asset.changeID "foo"
     asset.id.should.equal "foo"
     Asset.findById("foo").should.be.truthy

     asset.changeID "cat"
     asset.id.should.equal "cat"
     Asset.findById("cat").should.be.truthy

  it "should generate unique IDs", ->
    new Asset
      name: "Bob"
      id: 3

    new Asset
      name: "Bob"
      id: 2

    Asset.all()[0].id.should.not.equal Asset.all()[1].id

   it "should create multiple assets", ->
     i = 0
     while i < 12
       new Asset name: "Bob"
       i++

     Asset.count().should.equal 12
 
  it "should handle more than 10 IDs correctly", ->
    i = 0
 
    while i < 12
      new Asset name: "Bob", id: i
      i++
 
    Asset.count().should.equal 12

  it "should have a url function", ->
    Asset.url().should.be "/users"
    Asset.url("search").should.be "/assets/search"
    asset = new Asset(name: "Bob", id: 1)
    asset.url().should.be "/assets/1"
    asset.url("custom").should.be "/assets/1/custom"

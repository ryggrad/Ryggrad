describe "Model", ->
  Asset = undefined

  beforeEach ->
    class Asset extends Ryggrad.Model
      @key "name", String

  it "can create records", ->
    asset = Asset.create name: "test.pdf"

    # Compare this way because JS is annoying
    Asset.all()[0].id.should.equal asset.id
    Asset.all()[0].cid.should.equal asset.cid
    Asset.all()[0].name.should.equal asset.name

  it "can update records", ->
    asset = Asset.create(name: "test.pdf")
    Asset.all()[0].name.should.equal "test.pdf"
    asset.name = "wem.pdf"
    asset.save()
    Asset.all()[0].name.should.equal "wem.pdf"

  it "can destroy records", ->
    asset = Asset.create(name: "test.pdf")
    Asset.all()[0].id.should.equal asset.id
    asset.destroy()
    expect(Asset.all()[0]).to.be.undefined

  it "can find records", ->
    asset = Asset.create(name: "test.pdf", id: "asset2")
    Asset.find(asset.id).should.be.instanceof Asset
    Asset.exists(asset.id).should.be.true

    asset.destroy()
    Asset.exists(asset.id).should.be.false

  it "can find records by attribute", ->
    asset = Asset.create name: "cats.pdf"
    asset_found = Asset.findBy("name", "cats.pdf")
    asset_found.name.should.equal asset.name
    asset.destroy()

  it "can check existence", ->
    asset = Asset.create name: "test.pdf"
    asset.exists().should.be.truthy
    Asset.exists(asset.id).should.be.truthy

    asset.destroy()
    expect(Asset.exists(asset.id)).to.be.falsey
 
  it "can select records", ->
    asset = Asset.create(name: "foo.pdf")
    selected = Asset.filter((rec) ->
      rec.name is "foo.pdf"
    )
    selected[0].name.should.equal asset.name
 
  it "can return all records", ->
    asset1 = Asset.create(name: "test.pdf")
    asset2 = Asset.create(name: "foo.pdf")
    Asset.all()[0].name.should.equal asset1.name 
    Asset.all()[1].name.should.equal asset2.name
 
  it "can destroy all records", ->
    Asset.create name: "foo.pdf"
    Asset.create name: "foo.pdf"
    Asset.count().should.equal 2
    Asset.destroyAll()
    Asset.count().should.equal 0

  ### 
  # TODO
  ###

  # TODO fix this test
  # it "can be serialized into JSON", ->
  #   asset = new Asset(name: "Johnson me!")
  #   asset.toJSON().should.equal { id: 'c-0', name: 'Johnson me!' }

  ### 
  # TODO
  ###

  # it "can be deserialized from JSON", ->
  #   asset = Asset.fromJSON("{\"name\":\"Un-Johnson me!\"}")
  #   asset.name.should.equal "Un-Johnson me!"
  #   assets = Asset.fromJSON("[{\"name\":\"Un-Johnson me!\"}]")
  #   assets[0] and assets[0].name.should.equal "Un-Johnson me!"

  ###
  # TODO
  ###

  # it "can validate", ->
  #   Asset.include validate: ->
  #     "Name required"  unless @name
  # 
  #   Asset.create(name: "").should.be.false
  #   Asset.create(name: "Yo big dog").should.be.truthy

  it "has attribute hash", ->
    asset = new Asset(name: "wazzzup!")
    asset.attributes.name.should.equal "wazzzup!"
 
  it "clones are dynamic", ->
    asset = Asset.create name: "hotel california"
    clone = Asset.find(asset.id)
    asset.name = "checkout anytime"
    asset.save()
    clone.name.should.equal "checkout anytime"
 
  it "should be able to change ID", ->
    asset = Asset.create name: "hotel california"
    asset.id.should.not.be null
    asset.id = "foo"
    asset.id.should.equal "foo"
    Asset.exists("foo").should.be.truthy
 
    asset.id = "cat"
    asset.id.should.equal "cat"
    Asset.exists("cat").should.be.truthy
 
  it "should generate unique cIDs", ->
    Asset.create
      name: "Bob"
      id: 3
 
    Asset.create
      name: "Bob"
      id: 2  
 
    Asset.all()[0].id.should.not.equal Asset.all()[1].id
 
  it "should create multiple assets", ->
    i = 0
    while i < 12
      Asset.create name: "Bob"
      i++
   
    Asset.count().should.equal 12
  
  it "should handle more than 10 cIDs correctly", ->
    i = 0
   
    while i < 12
      Asset.create name: "Bob", id: i
      i++
   
    Asset.count().should.equal 12
 
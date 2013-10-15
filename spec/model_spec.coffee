describe "Model", ->
  Asset = undefined

  beforeEach ->
    class Asset extends Ryggrad.Model
      @configure("Asset", "name")

  it "can create records", ->
    asset = Asset.create name: "test.pdf"

    # Compare this way because JS is annoying
    Asset.all()[0].id.should.equal asset.id
    Asset.all()[0].uid.should.equal asset.uid
    Asset.all()[0].name.should.equal asset.name

  it "can update records", ->
    asset = Asset.create(name: "test.pdf")
    Asset.all()[0].name.should.equal "test.pdf"
    asset.name = "wem.pdf"
    asset.save()
    Asset.all()[0].name.should.equal "wem.pdf"

  it "can destroy records", ->
    asset = Asset.create(name: "test.pdf")
    Asset.all()[0].uid.should.equal asset.uid
    asset.destroy()
    expect(Asset.all()[0]).to.be.undefined

  it "can find records", ->
    asset = Asset.create(name: "test.pdf")
    Asset.find(asset.id).should.not.be.null
    Asset.find(asset.id).className.should.be("Asset")
    asset.destroy()
    expect( ->
      Asset.find(asset.uid)
    ).to.throw(Error)

  it "can find records by attribute", ->
    asset = Asset.create name: "test.pdf"
    asset_found = Asset.findBy("name", "test.pdf")
    asset_found.name.should.equal asset.name
    asset.destroy()

  it "can check existence", ->
    asset = Asset.create name: "test.pdf"
    asset.exists().should.be.truthy
    Asset.exists(asset.uid).should.be.truthy

    asset_uid = _.clone(asset.uid)
    asset.destroy()
    expect(Asset.exists(asset_uid)).to.be.falsey

  it "can select records", ->
    asset1 = Asset.create(name: "test.pdf")
    asset2 = Asset.create(name: "foo.pdf")
    selected = Asset.select((rec) ->
      rec.name is "foo.pdf"
    )
    selected[0].name.should.equal asset2.name

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

  it "can be serialized into JSON", ->
    asset = new Asset(name: "Johnson me!")
    JSON.stringify(asset.attributes()).should.equal "{\"name\":\"Johnson me!\"}"

  it "can be deserialized from JSON", ->
    asset = Asset.fromJSON("{\"name\":\"Un-Johnson me!\"}")
    asset.name.should.equal "Un-Johnson me!"
    assets = Asset.fromJSON("[{\"name\":\"Un-Johnson me!\"}]")
    assets[0] and assets[0].name.should.equal "Un-Johnson me!"

  it "can validate", ->
    Asset.include validate: ->
      "Name required"  unless @name

    Asset.create(name: "").should.be.false
    Asset.create(name: "Yo big dog").should.be.truthy

  it "has attribute hash", ->
    asset = new Asset(name: "wazzzup!")
    _.isEqual(asset.attributes(), name: "wazzzup!").should.be.true

  it "attributes() should not return undefined atts", ->
    asset = new Asset()
    _.isEqual(asset.attributes(), {}).should.be.true

  it "can load attributes()", ->
    asset = new Asset()
    result = asset.load(name: "In da' house")
    result.should.equal asset
    asset.name.should.equal "In da' house"

  it "can load() attributes respecting getters/setters", ->
    Asset.include name: (value) ->
      ref = value.split(" ", 2)
      @first_name = ref[0]
      @last_name = ref[1]

    asset = new Asset()
    asset.load name: "Javi Jimenez"
    asset.first_name.should.equal "Javi"
    asset.last_name.should.equal "Jimenez"

  it "attributes() respecting getters/setters", ->
    Asset.include name: ->
      "Bob"

    asset = new Asset()
    _.isEqual(asset.attributes(), name: "Bob").should.be.true

  it "can generate UID", ->
    asset = Asset.create name: "who's in the house?"
    asset.uid.should.not.be null

  it "can be cloned", ->
    asset = Asset.create name: "what's cooler than cool?"
    asset.clone().__proto__.should.not.be Asset::

  it "clones are dynamic", ->
    asset = Asset.create name: "hotel california"
    clone = Asset.find(asset.uid)
    asset.name = "checkout anytime"
    asset.save()
    clone.name.should.equal "checkout anytime"

  it "should return a clone from create or save", ->
    asset = Asset.create name: "what's cooler than cool?"
    asset.__proto__.should.not.be Asset::
    asset.__proto__.__proto__.should.be Asset::

  it "should be able to change ID", ->
    asset = Asset.create name: "hotel california"
    asset.uid.should.not.be null
    asset.changeUID "foo"
    asset.uid.should.equal "foo"
    Asset.exists("foo").should.be.truthy

    asset.changeID "cat"
    asset.id.should.equal "cat"
    Asset.exists("cat").should.be.truthy

  it "new records should not be eql", ->
    asset1 = new Asset
    asset2 = new Asset
    _.isEqual(asset1, asset2).should.be.false
    
  it "should generate unique cIDs", ->
    Asset.create
      name: "Bob"
      id: 3

    Asset.create
      name: "Bob"
      id: 2  

    Asset.all()[0].uid.should.not.equal Asset.all()[1].uid

  it "should create multiple assets", ->
    i = 0
    while i < 12
      Asset.create name: "Bob"
      i++
   
    Asset.count().should.equal 12

  it "should handle more than 10 cIDs correctly", ->
    i = 0
   
    while i < 12
      Asset.create name: "Bob", uid: i
      i++
   
    Asset.count().should.equal 12

  describe "with spy", ->
    it "can interate over records", ->
      asset1 = Asset.create name: "test.pdf"
      asset2 = Asset.create name: "foo.pdf"
      spy = sinon.spy()
      Asset.each spy
      spy.should.have.been.calledWith asset1
      spy.should.have.been.calledWith asset2

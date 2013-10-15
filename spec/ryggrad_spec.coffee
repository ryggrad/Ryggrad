describe "Ryggrad", ->
  it "is healthy", ->
    Ryggrad.should.not.be null
    Ryggrad.Ajax.should.not.be null
    Ryggrad.AttributeTracking.should.not.be null
    Ryggrad.Controller.should.not.be null
    Ryggrad.Events.should.not.be null
    Ryggrad.Model.should.not.be null
    Ryggrad.Module.should.not.be null
    Ryggrad.Route.should.not.be null
    Ryggrad.Util.should.not.be null
    Ryggrad.View.should.not.be null

  it "should return the version", ->
    Ryggrad.version.should.equal "0.0.1"

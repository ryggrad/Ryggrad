describe "Ryggrad.util", ->
  it "should get input value for dom element", ->
    el = $('<input value="cats"/>')
    Ryggrad.Util.getInputValue(el).should.equal "cats"

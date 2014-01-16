describe "Controller", ->
  Tasks = undefined
  element = undefined

  beforeEach ->
    class Tasks extends Ryggrad.Controller
      element = $("<div />")

  it "should be configurable", ->
    element.addClass "big"
    tasks = new Tasks el: element
    tasks.el.hasClass("big").should.equal true

    tasks = new Tasks item: "foo"
    tasks.item.should.equal "foo"

  it "should generate element", ->
    tasks = new Tasks()
    tasks.el.should.be.truthy

  it "can populate elements", ->
    Tasks.include 
      elements:
        ".footer": "footer"

    element.append $("<div />").addClass("footer")[0]
    tasks = new Tasks el: element
    tasks.footer.should.be.truthy
    tasks.footer.hasClass("footer").should.equal true

  it "get handler of a child element", ->
    input = $("<input type='text' id='name' />")
    element.html input[0]
    elements = "input#name": "name"
    tasks = new Tasks el: element, elements: elements

    input[0].should.equal tasks.name[0]

  it "can remove element upon release event", ->
    parent = $ "<div />"
    parent.append element[0]
    tasks = new Tasks(el: element)
  
    parent.children().length.should.equal 1
    tasks.destroy()
    parent.children().length.should.equal 0

  describe "with spy", ->
    spy = undefined

    beforeEach ->
      spy = sinon.spy()

    it "can add events", ->
      Tasks.include
        events:
          click: "wasClicked"

        wasClicked: $.proxy spy, this

      tasks = new Tasks el: element
      element.click()
      spy.should.have.been.called

    it "can delegate events", ->
      Tasks.include
        events:
          "click .foo": "wasClicked"

        wasClicked: $.proxy(spy, this)

      child = $("<div />").addClass("foo")
      element.append child
      tasks = new Tasks el: element
      child.click()
      spy.should.have.been.called

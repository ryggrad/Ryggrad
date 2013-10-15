describe "Ryggrad.View", ->
  view = null
  view3 = null 
  view4 = null
  view2 = null 
  TestRyggradView = null
  BadRyggradView  = null
  content = null
  viewafterAttachStub = null       
  viewSubviewafterAttachStub = null
  view2afterAttachStub = null      
  viewa3fterAttachStub = null      

  describe "Ryggrad.View objects", ->
    beforeEach ->
      class Subview extends Ryggrad.View
        @content: (params={}, otherArg) ->
          @div =>
            @h2 { outlet: "header" }, params.title + " " + otherArg
            @div "I am a subview"
            @tag 'mytag', id: 'thetag', 'Non standard tag'

        initialize: (args...) ->
          @initializeCalledWith = args
         
        afterAttach: ->

      class TestRyggradView extends Ryggrad.View
        @content: (params={}, otherArg) ->
          @div keydown: 'viewClicked', class: 'rootDiv', =>
            @h1 { outlet: 'header' }, params.title + " " + otherArg
            @list()
            @subview 'subview', new Subview(title: "Subview", 43)

        @list: ->
          @ol =>
            @li outlet: 'li1', click: 'li1Clicked', class: 'foo', "one"
            @li outlet: 'li2', keypress:'li2Keypressed', class: 'bar', "two"

        initialize: (args...) ->
          @initializeCalledWith = args

        foo: "bar",
        li1Clicked: ->,
        li2Keypressed: ->
        viewClicked: ->
        afterAttach: ->
        beforeRemove: ->

      view = new TestRyggradView({title: "Zebra"}, 42)

    describe "constructor", ->
      it "calls the content class method with the given params to produce the view's html", ->
        view.should.match "div"
        view.find("h1:contains(Zebra 42)").should.exist
        view.find("mytag#thetag:contains(Non standard tag)").should.exist
        view.find("ol > li.foo:contains(one)").should.exist
        view.find("ol > li.bar:contains(two)").should.exist

      it "calls initialize on the view with the given params", ->
        _.isEqual(view.initializeCalledWith, [{title: "Zebra"}, 42]).should.be.true

      it "wires outlet referenecs to elements with 'outlet' attributes", ->
        view.li1.should.match "li.foo:contains(one)"
        view.li2.should.match "li.bar:contains(two)"

      it "removes the outlet attribute from markup", ->
        expect(view.li1.attr('outlet')).to.be.falsey
        expect(view.li2.attr('outlet')).to.be.falsey

      it "constructs and wires outlets for subviews", ->
        view.subview.should.exist
        view.subview.find('h2:contains(Subview 43)').should.exist
        view.subview.parentView.should.be view
        view.subview.constructor.currentBuilder.should.be.falsey
        _.isEqual(view.subview.initializeCalledWith, [{title: "Subview"}, 43]).should.be.true

      it "does not overwrite outlets on the superview with outlets from the subviews", ->
        view.header.should.match "h1"
        view.subview.header.should.match "h2"

      it "binds events for elements with event name attributes", ->
        viewClickedStub = sinon.stub view, "viewClicked",  (event, elt) ->
          event.type.should.be 'keydown'
          elt.should.match "div.rootDiv"

        li1ClickedStub = sinon.stub view, 'li1Clicked', (event, elt) ->
          event.type.should.be 'click'
          elt.should.match 'li.foo:contains(one)'
    
        li2KeypressedStub = sinon.stub view, 'li2Keypressed', (event, elt) ->
          event.type.should.be 'keypress'
          elt.should.match "li.bar:contains(two)"
    
        view.keydown()
        viewClickedStub.should.have.been.called
        viewClickedStub.restore()
      
        view.li1.click()
        li1ClickedStub.should.have.been.called
        li2KeypressedStub.should.not.have.been.called

        view.li1Clicked.reset()

        view.li2.keypress()
        li2KeypressedStub.should.have.been.called
        li1ClickedStub.should.not.have.been.called
        
        li2KeypressedStub.restore()
        li1ClickedStub.restore()

    it "makes the view object accessible via the calling 'view' method on any child element", ->
      view.view().should.be view
      view.header.view().should.be view
      view.subview.view().should.be view.subview
      view.subview.header.view().should.be view.subview

    it "throws an exception if the view has more than one root element", ->
      class BadRyggradView extends Ryggrad.View
        @content: ->
          @div id: 'one'
          @div id: 'two'

      expect(
        -> new BadRyggradView
      ).to.throw(Error)

    it "throws an exception if the view has no content", ->
      class BadRyggradView extends Ryggrad.View
        @content: -> left blank intentionally

      expect(-> 
        new BadRyggradView
      ).to.throw(Error)

    describe "when a view is attached to another element via jQuery", ->
      beforeEach ->
        view4 = new TestRyggradView()
        view3 = new TestRyggradView()
        view2 = new TestRyggradView()
      
      describe "when attached to an element that is on the DOM", ->
        beforeEach ->
          content = $('#mocha')

        afterEach ->
          content.empty()
 
        describe "when $.fn.append is called with a single argument", ->
          it "calls afterAttach (if it is present) on the appended view and its subviews, passing true to indicate they are on the DOM", ->
            viewafterAttachStub        = sinon.stub(view, 'afterAttach')
            viewSubviewafterAttachStub = sinon.stub(view.subview, 'afterAttach')
            view2afterAttachStub       = sinon.stub(view2, 'afterAttach')
            viewa3fterAttachStub       = sinon.stub(view3, 'afterAttach') 

            content.append view
            view.afterAttach.should.have.been.calledWith(true)
            view.subview.afterAttach.should.have.been.calledWith(true)

            viewafterAttachStub.restore()       
            viewSubviewafterAttachStub.restore()
            view2afterAttachStub.restore()      
            viewa3fterAttachStub.restore()    

        describe "when $.fn.append is called with multiple arguments", ->
          it "calls afterAttach (if it is present) on all appended views and their subviews, passing true to indicate they are on the DOM", ->
            viewafterAttachStub        = sinon.stub(view, 'afterAttach')
            viewSubviewafterAttachStub = sinon.stub(view.subview, 'afterAttach')
            view2afterAttachStub       = sinon.stub(view2, 'afterAttach')
            viewa3fterAttachStub       = sinon.stub(view3, 'afterAttach') 

            content.append view, view2, [view3, view4]
            view.afterAttach.should.have.been.calledWith(true)
            view.subview.afterAttach.should.have.been.calledWith(true)
            view2.afterAttach.should.have.been.calledWith(true)
            view3.afterAttach.should.have.been.calledWith(true)

            viewafterAttachStub.restore()       
            viewSubviewafterAttachStub.restore()
            view2afterAttachStub.restore()      
            viewa3fterAttachStub.restore()    

        describe "when $.fn.insertBefore is called on the view", ->
          it "calls afterAttach on the view and its subviews", ->
            viewafterAttachStub        = sinon.stub(view, 'afterAttach')
            viewSubviewafterAttachStub = sinon.stub(view.subview, 'afterAttach')

            otherElt = $('<div>')
            content.append(otherElt)
            view.insertBefore(otherElt)
            view.afterAttach.should.have.been.calledWith(true)
            view.subview.afterAttach.should.have.been.calledWith(true)

            viewafterAttachStub.restore()       
            viewSubviewafterAttachStub.restore()

      describe "when a view is attached as part of a larger dom fragment", ->
        it "calls afterAttach on the view and its subviews", ->
          viewafterAttachStub        = sinon.stub(view, 'afterAttach')
          viewSubviewafterAttachStub = sinon.stub(view.subview, 'afterAttach')

          otherElt = $('<div>')
          otherElt.append(view)
          content.append(otherElt)
          view.afterAttach.should.have.been.calledWith(true)
          view.subview.afterAttach.should.have.been.calledWith(true)

          viewafterAttachStub.restore()       
          viewSubviewafterAttachStub.restore()

      describe "when attached to an element that is not on the DOM", ->
        it "calls afterAttach (if it is present) on the appended view, passing false to indicate it isn't on the DOM", ->
          viewafterAttachStub = sinon.stub(view, 'afterAttach')

          fragment = $('<div>')
          fragment.append view
          view.afterAttach.should.have.been.calledWith(false)

          viewafterAttachStub.restore()       

        it "doesn't call afterAttach a second time until the view is attached to the DOM", ->
          viewafterAttachStub = sinon.stub(view, 'afterAttach')

          fragment = $('<div>')
          fragment.append view
          view.afterAttach.reset()

          otherFragment = $('<div>')
          otherFragment.append(fragment)
          view.afterAttach.should.not.have.been.called
          view.afterAttach.restore()

      it "allows $.fn.append to be called with undefined without raising an exception", ->
        expect(->
          view.append undefined
        ).to.not.throw(Error)

    describe "when a view is removed from the DOM", ->
      it "calls the `beforeRemove` hook once for each view", ->
        view = new TestRyggradView()
        content = $('#mocha')
        parent = $$ -> @div()
        parent.append(view)
        content.append(parent)
        subviewParentViewDuringRemove = null

        spy = sinon.stub view, 'beforeRemove', -> subviewParentViewDuringRemove = view.subview.parent().view()

        subviewParentViewDuringRemove = null

        parent.remove()
        expect(spy).to.have.been.called
        expect(spy.callCount).to.be 1
        expect(subviewParentViewDuringRemove).to.be view

      it "the view instance is no longer accessible by calling view()", ->
        content = $('#mocha')
        parent = $$ -> @div()
        parent.append(view)
        content.append(parent)

        expect($(view[0]).view()).to.be view
        parent.remove()
        expect($(view[0]).view()).to.be.falsy

  describe "when the view constructs a new jQuery wrapper", ->
    it "constructs instances of jQuery rather than the view class", ->
      expect(view.eq(0) instanceof jQuery).to.be.truthy
      expect(view.eq(0) instanceof TestRyggradView).to.be.falsy
      expect(view.end() instanceof jQuery).to.be.truthy
      expect(view.end() instanceof TestRyggradView).to.be.falsy

  describe "Ryggrad.View.render (bound to $$)", ->
    it "renders a document fragment based on tag methods called by the given function", ->
      fragment = $$ ->
        @div class: "foo", =>
          @ol =>
            @li id: 'one'
            @li id: 'two'

      fragment.should.match('div.foo')
      fragment.find('ol').should.exist
      fragment.find('ol li#one').should.exist
      fragment.find('ol li#two').should.exist

    it "renders subviews", ->
      fragment = $$ ->
        @div =>
          @subview 'foo', $$ ->
            @div id: "subview"

      fragment.find('div#subview').should.exist
      fragment.foo.should.match('#subview')

  describe "View bindings", ->
    it "should bind model events to view methods", ->
      class Puppy extends Ryggrad.Model
        @configure("Puppy", "name")
        @extend Ryggrad.AttributeTracking

      class BindedView extends Ryggrad.View
        @content: (params={}, otherArg) ->
          @div =>
            @h2 { outlet: "header" }, params.title + " " + otherArg
            @div "I am a subview"
            @tag 'mytag', id: 'thetag', 'Non standard tag'

        @model_events:
          "update:name": "updateName"

        updateName: ->

      model = Puppy.create(name: 'gus')     

      view = new BindedView()
      spy = sinon.spy(view, "updateName")
      view.setModel(model)
      model.updateAttribute('name', 'jake')
      spy.should.have.been.called
 
  describe "$$$", ->
    it "returns the raw HTML constructed by tag methods called by the given function (not a jQuery wrapper)", ->
      html = $$$ ->
        @div class: "foo", =>
          @ol =>
            @li id: 'one'
            @li id: 'two'
 
      typeof html.should.be 'string'
      fragment = $(html)
      fragment.should.match('div.foo')
      fragment.find('ol').should.exist
      fragment.find('ol li#one').should.exist
      fragment.find('ol li#two').should.exist
 
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Model Attribute Tracking", function() {
    var Cat, Puppy, spy;
    Puppy = void 0;
    Cat = void 0;
    spy = void 0;
    beforeEach(function() {
      var _ref, _ref1;
      Puppy = (function(_super) {
        __extends(Puppy, _super);

        function Puppy() {
          _ref = Puppy.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        Puppy.key("name", String);

        return Puppy;

      })(Ryggrad.Model);
      Cat = (function(_super) {
        __extends(Cat, _super);

        function Cat() {
          _ref1 = Cat.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        Cat.key("name", Object);

        return Cat;

      })(Ryggrad.Model);
      return spy = sinon.spy();
    });
    it('fires an update:name event when name is updated', function() {
      var gus;
      gus = Puppy.create({
        name: 'gus'
      });
      gus.change('name', spy);
      gus.updateAttribute('name', 'henry');
      return spy.should.have.been.called;
    });
    it("doesn't fire an update:name event if the new name isn't different", function() {
      var gus;
      gus = new Puppy({
        name: 'gus'
      });
      gus.change('name', spy);
      gus.updateAttribute('name', 'gus');
      return spy.called.should.be["false"];
    });
    return it("doesn't fire an event when an attribute is updated with an equivalent object", function() {
      var henry;
      henry = Cat.create({
        name: {
          first: 'Henry',
          last: 'Lloyd'
        }
      });
      henry.change('name', spy);
      henry.updateAttribute('name', {
        first: 'Henry',
        last: "Lloyd"
      });
      return spy.called.should.be["false"];
    });
  });

  describe("Controller", function() {
    var Tasks, element;
    Tasks = void 0;
    element = void 0;
    beforeEach(function() {
      var _ref;
      return Tasks = (function(_super) {
        __extends(Tasks, _super);

        function Tasks() {
          _ref = Tasks.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        element = $("<div />");

        return Tasks;

      })(Ryggrad.Controller);
    });
    it("should be configurable", function() {
      var tasks;
      element.addClass("big");
      tasks = new Tasks({
        el: element
      });
      tasks.el.hasClass("big").should.equal(true);
      tasks = new Tasks({
        item: "foo"
      });
      return tasks.item.should.equal("foo");
    });
    it("should generate element", function() {
      var tasks;
      tasks = new Tasks();
      return tasks.el.should.be.truthy;
    });
    it("can populate elements", function() {
      var tasks;
      Tasks.include({
        elements: {
          ".footer": "footer"
        }
      });
      element.append($("<div />").addClass("footer")[0]);
      tasks = new Tasks({
        el: element
      });
      tasks.footer.should.be.truthy;
      return tasks.footer.hasClass("footer").should.equal(true);
    });
    it("get handler of a child element", function() {
      var elements, input, tasks;
      input = $("<input type='text' id='name' />");
      element.html(input[0]);
      elements = {
        "input#name": "name"
      };
      tasks = new Tasks({
        el: element,
        elements: elements
      });
      return input[0].should.equal(tasks.name[0]);
    });
    it("can remove element upon release event", function() {
      var parent, tasks;
      parent = $("<div />");
      parent.append(element[0]);
      tasks = new Tasks({
        el: element
      });
      parent.children().length.should.equal(1);
      tasks.destroy();
      return parent.children().length.should.equal(0);
    });
    return describe("with spy", function() {
      var spy;
      spy = void 0;
      beforeEach(function() {
        return spy = sinon.spy();
      });
      it("can add events", function() {
        var tasks;
        Tasks.include({
          events: {
            click: "wasClicked"
          },
          wasClicked: $.proxy(spy, this)
        });
        tasks = new Tasks({
          el: element
        });
        element.click();
        return spy.should.have.been.called;
      });
      return it("can delegate events", function() {
        var child, tasks;
        Tasks.include({
          events: {
            "click .foo": "wasClicked"
          },
          wasClicked: $.proxy(spy, this)
        });
        child = $("<div />").addClass("foo");
        element.append(child);
        tasks = new Tasks({
          el: element
        });
        child.click();
        return spy.should.have.been.called;
      });
    });
  });

  describe("Events", function() {
    var EventTest, spy;
    EventTest = void 0;
    spy = void 0;
    beforeEach(function() {
      EventTest = Ryggrad.Module.create();
      EventTest.extend(Ryggrad.Events);
      return spy = sinon.spy();
    });
    it("can bind/trigger events", function() {
      EventTest.bind("hello", spy);
      EventTest.trigger("hello");
      return spy.should.have.been.called;
    });
    it("should trigger correct events", function() {
      EventTest.bind("hello", spy);
      EventTest.trigger("bye");
      return spy.should.not.have.been.called;
    });
    it("can bind/trigger multiple events", function() {
      EventTest.bind("house car windows", spy);
      EventTest.trigger("car");
      return spy.should.have.been.called;
    });
    it("can pass data to triggered events", function() {
      EventTest.bind("yoyo", spy);
      EventTest.trigger("yoyo", 5, 10);
      return spy.should.have.been.called;
    });
    it("can unbind events", function() {
      EventTest.bind("hello", spy);
      EventTest.unbind("hello");
      EventTest.trigger("hello");
      return spy.should.not.have.been.called;
    });
    it("should allow a callback to unbind itself", function() {
      var a, b, c;
      a = sinon.spy();
      b = sinon.spy(b);
      c = sinon.spy();
      EventTest.bind("once", a);
      EventTest.bind("once", b);
      EventTest.bind("once", c);
      EventTest.trigger("once");
      a.should.have.been.called;
      b.should.have.been.called;
      c.should.have.been.called;
      EventTest.trigger("once");
      a.callCount.should.equal(2);
      return c.callCount.should.equal(2);
    });
    return it("can cancel propogation", function() {
      EventTest.bind("bye", function() {
        return false;
      });
      EventTest.bind("bye", spy);
      EventTest.trigger("bye");
      return spy.should.not.have.been.called;
    });
  });

  describe("Model", function() {
    var Asset;
    Asset = void 0;
    beforeEach(function() {
      var _ref;
      return Asset = (function(_super) {
        __extends(Asset, _super);

        function Asset() {
          _ref = Asset.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        Asset.key("name", String);

        return Asset;

      })(Ryggrad.Model);
    });
    it("can create records", function() {
      var asset;
      asset = Asset.create({
        name: "test.pdf"
      });
      Asset.all()[0].id.should.equal(asset.id);
      Asset.all()[0].cid.should.equal(asset.cid);
      return Asset.all()[0].name.should.equal(asset.name);
    });
    it("can update records", function() {
      var asset;
      asset = Asset.create({
        name: "test.pdf"
      });
      Asset.all()[0].name.should.equal("test.pdf");
      asset.name = "wem.pdf";
      asset.save();
      return Asset.all()[0].name.should.equal("wem.pdf");
    });
    it("can destroy records", function() {
      var asset;
      asset = Asset.create({
        name: "test.pdf"
      });
      Asset.all()[0].id.should.equal(asset.id);
      asset.destroy();
      return expect(Asset.all()[0]).to.be.undefined;
    });
    it("can find records", function() {
      var asset;
      asset = Asset.create({
        name: "test.pdf",
        id: "asset2"
      });
      Asset.find(asset.id).should.be["instanceof"](Asset);
      Asset.exists(asset.id).should.be["true"];
      asset.destroy();
      return Asset.exists(asset.id).should.be["false"];
    });
    it("can find records by attribute", function() {
      var asset, asset_found;
      asset = Asset.create({
        name: "cats.pdf"
      });
      asset_found = Asset.findBy("name", "cats.pdf");
      asset_found.name.should.equal(asset.name);
      return asset.destroy();
    });
    it("can check existence", function() {
      var asset;
      asset = Asset.create({
        name: "test.pdf"
      });
      asset.exists().should.be.truthy;
      Asset.exists(asset.id).should.be.truthy;
      asset.destroy();
      return expect(Asset.exists(asset.id)).to.be.falsey;
    });
    it("can select records", function() {
      var asset, selected;
      asset = Asset.create({
        name: "foo.pdf"
      });
      selected = Asset.filter(function(rec) {
        return rec.name === "foo.pdf";
      });
      return selected[0].name.should.equal(asset.name);
    });
    it("can return all records", function() {
      var asset1, asset2;
      asset1 = Asset.create({
        name: "test.pdf"
      });
      asset2 = Asset.create({
        name: "foo.pdf"
      });
      Asset.all()[0].name.should.equal(asset1.name);
      return Asset.all()[1].name.should.equal(asset2.name);
    });
    it("can destroy all records", function() {
      Asset.create({
        name: "foo.pdf"
      });
      Asset.create({
        name: "foo.pdf"
      });
      Asset.count().should.equal(2);
      Asset.destroyAll();
      return Asset.count().should.equal(0);
    });
    /* 
    # TODO
    */

    /* 
    # TODO
    */

    /*
    # TODO
    */

    it("has attribute hash", function() {
      var asset;
      asset = new Asset({
        name: "wazzzup!"
      });
      return asset.attributes.name.should.equal("wazzzup!");
    });
    it("clones are dynamic", function() {
      var asset, clone;
      asset = Asset.create({
        name: "hotel california"
      });
      clone = Asset.find(asset.id);
      asset.name = "checkout anytime";
      asset.save();
      return clone.name.should.equal("checkout anytime");
    });
    it("should be able to change ID", function() {
      var asset;
      asset = Asset.create({
        name: "hotel california"
      });
      asset.id.should.not.be(null);
      asset.id = "foo";
      asset.id.should.equal("foo");
      Asset.exists("foo").should.be.truthy;
      asset.id = "cat";
      asset.id.should.equal("cat");
      return Asset.exists("cat").should.be.truthy;
    });
    it("should generate unique cIDs", function() {
      Asset.create({
        name: "Bob",
        id: 3
      });
      Asset.create({
        name: "Bob",
        id: 2
      });
      return Asset.all()[0].id.should.not.equal(Asset.all()[1].id);
    });
    it("should create multiple assets", function() {
      var i;
      i = 0;
      while (i < 12) {
        Asset.create({
          name: "Bob"
        });
        i++;
      }
      return Asset.count().should.equal(12);
    });
    return it("should handle more than 10 cIDs correctly", function() {
      var i;
      i = 0;
      while (i < 12) {
        Asset.create({
          name: "Bob",
          id: i
        });
        i++;
      }
      return Asset.count().should.equal(12);
    });
  });

  describe("Module", function() {
    var User;
    User = void 0;
    beforeEach(function() {
      var _ref;
      return User = (function(_super) {
        __extends(User, _super);

        function User() {
          _ref = User.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        return User;

      })(Ryggrad.Module);
    });
    it("can create subclasses", function() {
      var Friend;
      User.extend({
        classProperty: true
      });
      Friend = User.create();
      Friend.should.not.be["null"];
      return Friend.classProperty.should.not.be["null"];
    });
    it("can create instance", function() {
      var Bob;
      User.include({
        instanceProperty: true
      });
      Bob = new User();
      Bob.should.not.be["null"];
      return Bob.instanceProperty.should.not.be["null"];
    });
    it("can be extendable", function() {
      User.extend({
        classProperty: true
      });
      return User.classProperty.should.be["true"];
    });
    it("can be includable", function() {
      User.include({
        instanceProperty: true
      });
      User.prototype.instanceProperty.should.be["true"];
      return (new User()).instanceProperty.should.be["true"];
    });
    it("should trigger module callbacks", function() {
      var module, spy;
      module = (function() {
        function module() {}

        module.included = function() {};

        module.extended = function() {};

        return module;

      })();
      spy = sinon.spy(module, "included");
      User.include(module);
      spy.should.have.been.called;
      spy = sinon.spy(module, "extended");
      User.extend(module);
      return spy.should.have.been.called;
    });
    it("include/extend should raise without arguments", function() {
      expect(function() {
        return User.include();
      }).to["throw"](Error);
      return expect(function() {
        return User.extend();
      }).to["throw"](Error);
    });
    return it("can proxy functions in class/instance context", function() {
      var func, user;
      func = function() {
        return this;
      };
      User.proxy(func)().should.be(User);
      user = new User();
      return user.proxy(func)().should.be(user);
    });
  });

  describe("Route", function() {
    var navigate, router;
    router = new Ryggrad.Router();
    navigate = function() {
      var args, changed;
      args = (1 <= arguments.length ? [].slice.call(arguments, 0) : []);
      changed = false;
      return $.Deferred(function(dfd) {
        router.bind("change", function() {
          return changed = true;
        });
        router.navigate.apply(router, args);
        return dfd.resolve();
      }).promise();
    };
    it("should not have bound any hashchange|popstate event to window", function() {
      var events;
      events = $(window).data("events");
      events || (events = {});
      return expect("hashchange" in events || "popstate" in events).to.be["false"];
    });
    it("can set its path", function() {
      router.getPath().should.be.falsey;
      router.change();
      return router.getPath().should.be.truthy;
    });
    it("can add a single route", function() {
      var router2;
      router2 = new Ryggrad.Router();
      router2.add("/foo");
      return router2.routes.length.should.be(1);
    });
    it("can add a bunch of routes", function() {
      var router2;
      router2 = new Ryggrad.Router();
      router2.add({
        "/foo": function() {},
        "/bar": function() {}
      });
      return router2.routes.length.should.be(2);
    });
    it("can add regex route", function() {
      var router2;
      router2 = new Ryggrad.Router();
      router2.add(/\/users\/(\d+)/);
      return router2.routes.length.should.be(1);
    });
    it("should trigger 'change' when a route matches", function() {
      var changed;
      changed = 0;
      router.on("change", function() {
        return changed += 1;
      });
      router.add("/foo", function() {});
      router.navigate("/foo");
      return changed.should.be(0);
    });
    it("can navigate to path", function() {
      router.add("/users", function() {});
      return navigate("/users").done(function() {
        return router.path.should.be("/users");
      });
    });
    return it("can navigate to a path splitted into several arguments", function() {
      router.add("/users/1/2", function() {});
      return navigate("/users", 1, 2).done(function() {
        return router.getPath().should.be("/users/1/2");
      });
    });
  });

  describe("Ryggrad", function() {
    it("is healthy", function() {
      Ryggrad.should.not.be(null);
      Ryggrad.Controller.should.not.be(null);
      Ryggrad.Model.should.not.be(null);
      Ryggrad.Module.should.not.be(null);
      Ryggrad.Route.should.not.be(null);
      Ryggrad.Router.should.not.be(null);
      Ryggrad.Util.should.not.be(null);
      return Ryggrad.View.should.not.be(null);
    });
    return it("should return the version", function() {
      return Ryggrad.version.should.equal("0.0.5");
    });
  });

  describe("Ryggrad.util", function() {
    return it("should get input value for dom element", function() {
      var el;
      el = $('<input value="cats"/>');
      return Ryggrad.Util.getInputValue(el).should.equal("cats");
    });
  });

}).call(this);

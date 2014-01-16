(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  describe("Model Attribute Tracking", function() {
    var Puppy, spy;
    Puppy = void 0;
    spy = void 0;
    beforeEach(function() {
      var _ref;
      Puppy = (function(_super) {
        __extends(Puppy, _super);

        function Puppy() {
          _ref = Puppy.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        Puppy.key("name", String);

        return Puppy;

      })(Ryggrad.Model);
      return spy = sinon.spy();
    });
    it('fires an update:name event when name is updated', function() {
      var gus;
      gus = Puppy.create({
        name: 'gus'
      });
      gus.bind('update:name', spy);
      gus.updateAttribute('name', 'henry');
      return spy.should.have.been.called;
    });
    it("doesn't fire an update:name event if the new name isn't different", function() {
      var gus;
      gus = Puppy.create({
        name: 'gus'
      });
      gus.bind('update:name', spy);
      gus.updateAttribute('name', 'gus');
      return spy.called.should.be["false"];
    });
    it("works with refreshed models", function() {
      var gus;
      Puppy.refresh({
        name: 'gus',
        id: 1
      });
      gus = Puppy.find(1);
      gus.bind('update:name', spy);
      gus.updateAttribute('name', 'jake');
      return spy.called.should.be["true"];
    });
    return it("doesn't fire an event when an attribute is updated with an equivalent object", function() {
      var henry;
      Puppy.refresh({
        name: {
          first: 'Henry',
          last: 'Lloyd'
        },
        id: 1
      });
      henry = Puppy.find(1);
      henry.bind('update:name', spy);
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

        Asset.configure("Asset", "name");

        return Asset;

      })(Ryggrad.Model);
    });
    it("can create records", function() {
      var asset;
      asset = Asset.create({
        name: "test.pdf"
      });
      Asset.all()[0].id.should.equal(asset.id);
      Asset.all()[0].uid.should.equal(asset.uid);
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
      Asset.all()[0].uid.should.equal(asset.uid);
      asset.destroy();
      return expect(Asset.all()[0]).to.be.undefined;
    });
    it("can find records", function() {
      var asset;
      asset = Asset.create({
        name: "test.pdf"
      });
      Asset.find(asset.id).should.not.be["null"];
      Asset.find(asset.id).className.should.be("Asset");
      asset.destroy();
      return expect(function() {
        return Asset.find(asset.uid);
      }).to["throw"](Error);
    });
    it("can find records by attribute", function() {
      var asset, asset_found;
      asset = Asset.create({
        name: "test.pdf"
      });
      asset_found = Asset.findBy("name", "test.pdf");
      asset_found.name.should.equal(asset.name);
      return asset.destroy();
    });
    it("can check existence", function() {
      var asset, asset_uid;
      asset = Asset.create({
        name: "test.pdf"
      });
      asset.exists().should.be.truthy;
      Asset.exists(asset.uid).should.be.truthy;
      asset_uid = _.clone(asset.uid);
      asset.destroy();
      return expect(Asset.exists(asset_uid)).to.be.falsey;
    });
    it("can select records", function() {
      var asset1, asset2, selected;
      asset1 = Asset.create({
        name: "test.pdf"
      });
      asset2 = Asset.create({
        name: "foo.pdf"
      });
      selected = Asset.select(function(rec) {
        return rec.name === "foo.pdf";
      });
      return selected[0].name.should.equal(asset2.name);
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
    it("can be serialized into JSON", function() {
      var asset;
      asset = new Asset({
        name: "Johnson me!"
      });
      return JSON.stringify(asset.attributes()).should.equal("{\"name\":\"Johnson me!\"}");
    });
    it("can be deserialized from JSON", function() {
      var asset, assets;
      asset = Asset.fromJSON("{\"name\":\"Un-Johnson me!\"}");
      asset.name.should.equal("Un-Johnson me!");
      assets = Asset.fromJSON("[{\"name\":\"Un-Johnson me!\"}]");
      return assets[0] && assets[0].name.should.equal("Un-Johnson me!");
    });
    it("can validate", function() {
      Asset.include({
        validate: function() {
          if (!this.name) {
            return "Name required";
          }
        }
      });
      Asset.create({
        name: ""
      }).should.be["false"];
      return Asset.create({
        name: "Yo big dog"
      }).should.be.truthy;
    });
    it("has attribute hash", function() {
      var asset;
      asset = new Asset({
        name: "wazzzup!"
      });
      return _.isEqual(asset.attributes(), {
        name: "wazzzup!"
      }).should.be["true"];
    });
    it("attributes() should not return undefined atts", function() {
      var asset;
      asset = new Asset();
      return _.isEqual(asset.attributes(), {}).should.be["true"];
    });
    it("can load attributes()", function() {
      var asset, result;
      asset = new Asset();
      result = asset.load({
        name: "In da' house"
      });
      result.should.equal(asset);
      return asset.name.should.equal("In da' house");
    });
    it("can load() attributes respecting getters/setters", function() {
      var asset;
      Asset.include({
        name: function(value) {
          var ref;
          ref = value.split(" ", 2);
          this.first_name = ref[0];
          return this.last_name = ref[1];
        }
      });
      asset = new Asset();
      asset.load({
        name: "Javi Jimenez"
      });
      asset.first_name.should.equal("Javi");
      return asset.last_name.should.equal("Jimenez");
    });
    it("attributes() respecting getters/setters", function() {
      var asset;
      Asset.include({
        name: function() {
          return "Bob";
        }
      });
      asset = new Asset();
      return _.isEqual(asset.attributes(), {
        name: "Bob"
      }).should.be["true"];
    });
    it("can generate UID", function() {
      var asset;
      asset = Asset.create({
        name: "who's in the house?"
      });
      return asset.uid.should.not.be(null);
    });
    it("can be cloned", function() {
      var asset;
      asset = Asset.create({
        name: "what's cooler than cool?"
      });
      return asset.clone().__proto__.should.not.be(Asset.prototype);
    });
    it("clones are dynamic", function() {
      var asset, clone;
      asset = Asset.create({
        name: "hotel california"
      });
      clone = Asset.find(asset.uid);
      asset.name = "checkout anytime";
      asset.save();
      return clone.name.should.equal("checkout anytime");
    });
    it("should return a clone from create or save", function() {
      var asset;
      asset = Asset.create({
        name: "what's cooler than cool?"
      });
      asset.__proto__.should.not.be(Asset.prototype);
      return asset.__proto__.__proto__.should.be(Asset.prototype);
    });
    it("should be able to change ID", function() {
      var asset;
      asset = Asset.create({
        name: "hotel california"
      });
      asset.uid.should.not.be(null);
      asset.changeUID("foo");
      asset.uid.should.equal("foo");
      Asset.exists("foo").should.be.truthy;
      asset.changeID("cat");
      asset.id.should.equal("cat");
      return Asset.exists("cat").should.be.truthy;
    });
    it("new records should not be eql", function() {
      var asset1, asset2;
      asset1 = new Asset;
      asset2 = new Asset;
      return _.isEqual(asset1, asset2).should.be["false"];
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
      return Asset.all()[0].uid.should.not.equal(Asset.all()[1].uid);
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
    it("should handle more than 10 cIDs correctly", function() {
      var i;
      i = 0;
      while (i < 12) {
        Asset.create({
          name: "Bob",
          uid: i
        });
        i++;
      }
      return Asset.count().should.equal(12);
    });
    return describe("with spy", function() {
      return it("can interate over records", function() {
        var asset1, asset2, spy;
        asset1 = Asset.create({
          name: "test.pdf"
        });
        asset2 = Asset.create({
          name: "foo.pdf"
        });
        spy = sinon.spy();
        Asset.each(spy);
        spy.should.have.been.calledWith(asset1);
        return spy.should.have.been.calledWith(asset2);
      });
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

  describe("Model Relations", function() {
    var Album, Photo;
    Album = void 0;
    Photo = void 0;
    beforeEach(function() {
      var _ref, _ref1;
      Album = (function(_super) {
        __extends(Album, _super);

        function Album() {
          _ref = Album.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        Album.configure("Album", "name");

        return Album;

      })(Ryggrad.Model);
      return Photo = (function(_super) {
        __extends(Photo, _super);

        function Photo() {
          _ref1 = Photo.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        Photo.configure("Photo", "name");

        return Photo;

      })(Ryggrad.Model);
    });
    it("should honour hasMany associations", function() {
      var album;
      Album.hasMany("photos", Photo);
      Photo.belongsTo("album", Album);
      album = Album.create();
      album.photos().should.be.truthy;
      album.photos().create({
        name: "First Photo"
      });
      album.photos().all()[0].name.should.equal("First Photo");
      Photo.first().should.be.truthy;
      Photo.first().name.should.be("First Photo");
      return Photo.first().album_id.should.be(album.id);
    });
    it("should honour belongsTo associations", function() {
      var album, photo, photo2;
      Album.hasMany("photos", Photo);
      Photo.belongsTo("album", Album);
      Photo.attributes.should.be(["name", "album_id"]);
      album = Album.create({
        name: "First Album"
      });
      photo = Photo.create({
        album: album
      });
      photo2 = Photo.create({});
      photo.album().should.be.truthy;
      photo2.album().should.be["false"];
      return photo.album().name.should.be("First Album");
    });
    it("can count Collection records", function() {
      var album;
      Album.hasMany("photos", Photo);
      Photo.belongsTo("album", Album);
      album = Album.create({
        name: "Beautiful album",
        photos: [
          {
            id: "1",
            name: "Beautiful photo 1"
          }, {
            id: "2",
            name: "Beautiful photo 2"
          }
        ],
        id: "1"
      });
      return album.photos().count().should.equal(2);
    });
    it("should associate an existing Singleton record", function() {
      var album, photo;
      Album.hasOne("photo", Photo);
      Photo.belongsTo("album", Album);
      album = Album.create({
        id: "1",
        name: "Beautiful album"
      });
      photo = Photo.create({
        id: "2",
        name: "Beautiful photo"
      });
      album.photo(photo);
      album.photo().should.be.truthy;
      album.photo().album_id.should.be("1");
      return album.photo().name.should.be("Beautiful photo");
    });
    it("should create a new related Singleton record", function() {
      var album;
      Album.hasOne("photo", Photo);
      Photo.belongsTo("album", Album);
      album = Album.create({
        name: "Beautiful album",
        photo: {
          name: "Beautiful photo"
        },
        id: "1"
      });
      album.photo().should.be.truthy;
      album.photo().album_id.should.be("1");
      return album.photo().name.should.be("Beautiful photo");
    });
    it("should associate existing records into a Collection", function() {
      var album, photo1, photo2;
      Album.hasMany("photos", Photo);
      Photo.belongsTo("album", Album);
      album = Album.create({
        name: "Beautiful album",
        id: "1"
      });
      photo1 = Photo.create({
        id: "1",
        name: "Beautiful photo 1"
      });
      photo2 = Photo.create({
        id: "2",
        name: "Beautiful photo 2"
      });
      album.photos([photo1, photo2]);
      Photo.count().should.be(2);
      album.photos().count().should.be(2);
      album.photos().first().album_id.should.be("1");
      album.photos().last().album_id.should.be("1");
      album.photos().first().name.should.be("Beautiful photo 1");
      return album.photos().last().name.should.be("Beautiful photo 2");
    });
    it("can refresh Collection records without effecting unrelated model records", function() {
      var album, photo1, photo2;
      Album.hasMany("photos", Photo);
      Photo.belongsTo("album", Album);
      album = Album.create({
        name: "Beautiful album",
        photos: [
          {
            id: "1",
            name: "This record should be removed"
          }
        ],
        id: "2"
      });
      Photo.create({
        id: "3",
        name: "This record should NOT be removed"
      });
      Photo.count().should.be(2);
      album.photos().count().should.be(1);
      album.photos().first().id.should.be("1");
      photo1 = {
        id: "4",
        name: "Beautiful photo 1"
      };
      photo2 = {
        id: "5",
        name: "Beautiful photo 2"
      };
      album.photos([photo1, photo2]);
      Photo.count().should.be(3);
      Photo.first().id.should.be("3");
      Photo.first().name.should.be("This record should NOT be removed");
      album.photos().count().should.be(2);
      album.photos().first().album_id.should.be("2");
      album.photos().last().album_id.should.be("2");
      album.photos().first().name.should.be("Beautiful photo 1");
      return album.photos().last().name.should.be("Beautiful photo 2");
    });
    it("can add unassociated records to an existing Collection", function() {
      var album, photo2;
      Album.hasMany("photos", Photo);
      Photo.belongsTo("album", Album);
      album = Album.create({
        photos: [
          {
            id: "1",
            name: "Beautiful photo 1"
          }
        ],
        name: "Beautiful album",
        id: "1"
      });
      photo2 = Photo.create({
        id: "2",
        name: "Beautiful photo 2"
      });
      album.photos().all().length.should.be(1);
      album.photos().add(photo2);
      album.photos().all().length.should.be(2);
      album.photos().first().album_id.should.be("1");
      album.photos().last().album_id.should.be("1");
      album.photos().first().name.should.be("Beautiful photo 1");
      return album.photos().last().name.should.be("Beautiful photo 2");
    });
    it("can remove records from a Collection", function() {
      var album, photo2;
      Album.hasMany("photos", Photo);
      Photo.belongsTo("album", Album);
      album = Album.create({
        photos: [
          {
            id: "1",
            name: "Beautiful photo 1"
          }
        ],
        name: "Beautiful album",
        id: "1"
      });
      photo2 = Photo.create({
        id: "2",
        name: "Beautiful photo 2"
      });
      album.photos().add(photo2);
      album.photos().should.be.truth;
      album.photos().all().length.should.be(2);
      album.photos().last().name.should.be("Beautiful photo 2");
      album.photos().remove(photo2);
      album.photos().all().length.should.be(1);
      return album.photos().last().name.should.be("Beautiful photo 1");
    });
    return it("can create new related Collection records", function() {
      var album;
      Album.hasMany("photos", Photo);
      Photo.belongsTo("album", Album);
      album = Album.create({
        name: "Beautiful album",
        photos: [
          {
            id: "1",
            name: "Beautiful photo 1"
          }, {
            id: "2",
            name: "Beautiful photo 2"
          }
        ],
        id: "1"
      });
      album.photos().should.be.truthy;
      album.photos().all().length.should.be(2);
      album.photos().first().album_id.should.be("1");
      album.photos().last().album_id.should.be("1");
      album.photos().first().name.should.be("Beautiful photo 1");
      return album.photos().last().name.should.be("Beautiful photo 2");
    });
  });

  describe("Route", function() {
    var Route, RouteOptions, navigate;
    Route = Ryggrad.Route;
    RouteOptions = Route.options;
    navigate = function() {
      var args, changed;
      args = (1 <= arguments.length ? [].slice.call(arguments, 0) : []);
      changed = false;
      return $.Deferred(function(dfd) {
        Route.bind("change", function() {
          return changed = true;
        });
        Route.navigate.apply(Route, args);
        return dfd.resolve();
      }).promise();
    };
    beforeEach(function() {
      return Route.options = RouteOptions;
    });
    afterEach(function() {
      Route.unbind();
      Route.routes = [];
      return delete Route.path;
    });
    it("should not have bound any hashchange|popstate event to window", function() {
      var events;
      events = $(window).data("events");
      events || (events = {});
      return expect("hashchange" in events || "popstate" in events).to.be["false"];
    });
    it("can set its path", function() {
      Route.getPath().should.be.falsey;
      Route.change();
      return Route.getPath().should.be.truthy;
    });
    it("can add a single route", function() {
      Route.add("/foo");
      return Route.routes.length.should.be(1);
    });
    it("can add a bunch of routes", function() {
      Route.add({
        "/foo": function() {},
        "/bar": function() {}
      });
      return Route.routes.length.should.be(2);
    });
    it("can add regex route", function() {
      Route.add(/\/users\/(\d+)/);
      return Route.routes.length.should.be(1);
    });
    it("should trigger 'change' when a route matches", function() {
      var changed;
      changed = 0;
      Route.bind("change", function() {
        return changed += 1;
      });
      Route.add("/foo", function() {});
      Route.navigate("/foo");
      return changed.should.be(1);
    });
    it("can navigate to path", function() {
      return Route.add("/users", function() {
        return navigate("/users").done(function() {
          return Route.path.should.be("/users");
        });
      });
    });
    return it("can navigate to a path splitted into several arguments", function() {
      Route.add("/users/1/2", function() {});
      return navigate("/users", 1, 2).done(function() {
        return Route.getPath().should.be("/users/1/2");
      });
    });
  });

  describe("Ryggrad", function() {
    it("is healthy", function() {
      Ryggrad.should.not.be(null);
      Ryggrad.Ajax.should.not.be(null);
      Ryggrad.AttributeTracking.should.not.be(null);
      Ryggrad.Controller.should.not.be(null);
      Ryggrad.Events.should.not.be(null);
      Ryggrad.Model.should.not.be(null);
      Ryggrad.Module.should.not.be(null);
      Ryggrad.Route.should.not.be(null);
      Ryggrad.Util.should.not.be(null);
      return Ryggrad.View.should.not.be(null);
    });
    return it("should return the version", function() {
      return Ryggrad.version.should.equal("0.0.1");
    });
  });

  describe("Ryggrad.util", function() {
    return it("should get input value for dom element", function() {
      var el;
      el = $('<input value="cats"/>');
      return Ryggrad.Util.prototype.getInputValue(el).should.equal("cats");
    });
  });

  describe("Ryggrad.View", function() {
    var BadRyggradView, TestRyggradView, content, view, view2, view2afterAttachStub, view3, view4, viewSubviewafterAttachStub, viewa3fterAttachStub, viewafterAttachStub;
    view = null;
    view3 = null;
    view4 = null;
    view2 = null;
    TestRyggradView = null;
    BadRyggradView = null;
    content = null;
    viewafterAttachStub = null;
    viewSubviewafterAttachStub = null;
    view2afterAttachStub = null;
    viewa3fterAttachStub = null;
    describe("Ryggrad.View objects", function() {
      beforeEach(function() {
        var Subview, _ref, _ref1;
        Subview = (function(_super) {
          __extends(Subview, _super);

          function Subview() {
            _ref = Subview.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          Subview.content = function(params, otherArg) {
            var _this = this;
            if (params == null) {
              params = {};
            }
            return this.div(function() {
              _this.h2({
                outlet: "header"
              }, params.title + " " + otherArg);
              _this.div("I am a subview");
              return _this.tag('mytag', {
                id: 'thetag'
              }, 'Non standard tag');
            });
          };

          Subview.prototype.initialize = function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.initializeCalledWith = args;
          };

          Subview.prototype.afterAttach = function() {};

          return Subview;

        })(Ryggrad.View);
        TestRyggradView = (function(_super) {
          __extends(TestRyggradView, _super);

          function TestRyggradView() {
            _ref1 = TestRyggradView.__super__.constructor.apply(this, arguments);
            return _ref1;
          }

          TestRyggradView.content = function(params, otherArg) {
            var _this = this;
            if (params == null) {
              params = {};
            }
            return this.div({
              keydown: 'viewClicked',
              "class": 'rootDiv'
            }, function() {
              _this.h1({
                outlet: 'header'
              }, params.title + " " + otherArg);
              _this.list();
              return _this.subview('subview', new Subview({
                title: "Subview"
              }, 43));
            });
          };

          TestRyggradView.list = function() {
            var _this = this;
            return this.ol(function() {
              _this.li({
                outlet: 'li1',
                click: 'li1Clicked',
                "class": 'foo'
              }, "one");
              return _this.li({
                outlet: 'li2',
                keypress: 'li2Keypressed',
                "class": 'bar'
              }, "two");
            });
          };

          TestRyggradView.prototype.initialize = function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.initializeCalledWith = args;
          };

          TestRyggradView.prototype.foo = "bar";

          TestRyggradView.prototype.li1Clicked = function() {};

          TestRyggradView.prototype.li2Keypressed = function() {};

          TestRyggradView.prototype.viewClicked = function() {};

          TestRyggradView.prototype.afterAttach = function() {};

          TestRyggradView.prototype.beforeRemove = function() {};

          return TestRyggradView;

        })(Ryggrad.View);
        return view = new TestRyggradView({
          title: "Zebra"
        }, 42);
      });
      describe("constructor", function() {
        it("calls the content class method with the given params to produce the view's html", function() {
          view.should.match("div");
          view.find("h1:contains(Zebra 42)").should.exist;
          view.find("mytag#thetag:contains(Non standard tag)").should.exist;
          view.find("ol > li.foo:contains(one)").should.exist;
          return view.find("ol > li.bar:contains(two)").should.exist;
        });
        it("calls initialize on the view with the given params", function() {
          return _.isEqual(view.initializeCalledWith, [
            {
              title: "Zebra"
            }, 42
          ]).should.be["true"];
        });
        it("wires outlet referenecs to elements with 'outlet' attributes", function() {
          view.li1.should.match("li.foo:contains(one)");
          return view.li2.should.match("li.bar:contains(two)");
        });
        it("removes the outlet attribute from markup", function() {
          expect(view.li1.attr('outlet')).to.be.falsey;
          return expect(view.li2.attr('outlet')).to.be.falsey;
        });
        it("constructs and wires outlets for subviews", function() {
          view.subview.should.exist;
          view.subview.find('h2:contains(Subview 43)').should.exist;
          view.subview.parentView.should.be(view);
          view.subview.constructor.currentBuilder.should.be.falsey;
          return _.isEqual(view.subview.initializeCalledWith, [
            {
              title: "Subview"
            }, 43
          ]).should.be["true"];
        });
        it("does not overwrite outlets on the superview with outlets from the subviews", function() {
          view.header.should.match("h1");
          return view.subview.header.should.match("h2");
        });
        return it("binds events for elements with event name attributes", function() {
          var li1ClickedStub, li2KeypressedStub, viewClickedStub;
          viewClickedStub = sinon.stub(view, "viewClicked", function(event, elt) {
            event.type.should.be('keydown');
            return elt.should.match("div.rootDiv");
          });
          li1ClickedStub = sinon.stub(view, 'li1Clicked', function(event, elt) {
            event.type.should.be('click');
            return elt.should.match('li.foo:contains(one)');
          });
          li2KeypressedStub = sinon.stub(view, 'li2Keypressed', function(event, elt) {
            event.type.should.be('keypress');
            return elt.should.match("li.bar:contains(two)");
          });
          view.keydown();
          viewClickedStub.should.have.been.called;
          viewClickedStub.restore();
          view.li1.click();
          li1ClickedStub.should.have.been.called;
          li2KeypressedStub.should.not.have.been.called;
          view.li1Clicked.reset();
          view.li2.keypress();
          li2KeypressedStub.should.have.been.called;
          li1ClickedStub.should.not.have.been.called;
          li2KeypressedStub.restore();
          return li1ClickedStub.restore();
        });
      });
      it("makes the view object accessible via the calling 'view' method on any child element", function() {
        view.view().should.be(view);
        view.header.view().should.be(view);
        view.subview.view().should.be(view.subview);
        return view.subview.header.view().should.be(view.subview);
      });
      it("throws an exception if the view has more than one root element", function() {
        var _ref;
        BadRyggradView = (function(_super) {
          __extends(BadRyggradView, _super);

          function BadRyggradView() {
            _ref = BadRyggradView.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          BadRyggradView.content = function() {
            this.div({
              id: 'one'
            });
            return this.div({
              id: 'two'
            });
          };

          return BadRyggradView;

        })(Ryggrad.View);
        return expect(function() {
          return new BadRyggradView;
        }).to["throw"](Error);
      });
      it("throws an exception if the view has no content", function() {
        var _ref;
        BadRyggradView = (function(_super) {
          __extends(BadRyggradView, _super);

          function BadRyggradView() {
            _ref = BadRyggradView.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          BadRyggradView.content = function() {
            return left(blank(intentionally));
          };

          return BadRyggradView;

        })(Ryggrad.View);
        return expect(function() {
          return new BadRyggradView;
        }).to["throw"](Error);
      });
      describe("when a view is attached to another element via jQuery", function() {
        beforeEach(function() {
          view4 = new TestRyggradView();
          view3 = new TestRyggradView();
          return view2 = new TestRyggradView();
        });
        describe("when attached to an element that is on the DOM", function() {
          beforeEach(function() {
            return content = $('#mocha');
          });
          afterEach(function() {
            return content.empty();
          });
          describe("when $.fn.append is called with a single argument", function() {
            return it("calls afterAttach (if it is present) on the appended view and its subviews, passing true to indicate they are on the DOM", function() {
              viewafterAttachStub = sinon.stub(view, 'afterAttach');
              viewSubviewafterAttachStub = sinon.stub(view.subview, 'afterAttach');
              view2afterAttachStub = sinon.stub(view2, 'afterAttach');
              viewa3fterAttachStub = sinon.stub(view3, 'afterAttach');
              content.append(view);
              view.afterAttach.should.have.been.calledWith(true);
              view.subview.afterAttach.should.have.been.calledWith(true);
              viewafterAttachStub.restore();
              viewSubviewafterAttachStub.restore();
              view2afterAttachStub.restore();
              return viewa3fterAttachStub.restore();
            });
          });
          describe("when $.fn.append is called with multiple arguments", function() {
            return it("calls afterAttach (if it is present) on all appended views and their subviews, passing true to indicate they are on the DOM", function() {
              viewafterAttachStub = sinon.stub(view, 'afterAttach');
              viewSubviewafterAttachStub = sinon.stub(view.subview, 'afterAttach');
              view2afterAttachStub = sinon.stub(view2, 'afterAttach');
              viewa3fterAttachStub = sinon.stub(view3, 'afterAttach');
              content.append(view, view2, [view3, view4]);
              view.afterAttach.should.have.been.calledWith(true);
              view.subview.afterAttach.should.have.been.calledWith(true);
              view2.afterAttach.should.have.been.calledWith(true);
              view3.afterAttach.should.have.been.calledWith(true);
              viewafterAttachStub.restore();
              viewSubviewafterAttachStub.restore();
              view2afterAttachStub.restore();
              return viewa3fterAttachStub.restore();
            });
          });
          return describe("when $.fn.insertBefore is called on the view", function() {
            return it("calls afterAttach on the view and its subviews", function() {
              var otherElt;
              viewafterAttachStub = sinon.stub(view, 'afterAttach');
              viewSubviewafterAttachStub = sinon.stub(view.subview, 'afterAttach');
              otherElt = $('<div>');
              content.append(otherElt);
              view.insertBefore(otherElt);
              view.afterAttach.should.have.been.calledWith(true);
              view.subview.afterAttach.should.have.been.calledWith(true);
              viewafterAttachStub.restore();
              return viewSubviewafterAttachStub.restore();
            });
          });
        });
        describe("when a view is attached as part of a larger dom fragment", function() {
          return it("calls afterAttach on the view and its subviews", function() {
            var otherElt;
            viewafterAttachStub = sinon.stub(view, 'afterAttach');
            viewSubviewafterAttachStub = sinon.stub(view.subview, 'afterAttach');
            otherElt = $('<div>');
            otherElt.append(view);
            content.append(otherElt);
            view.afterAttach.should.have.been.calledWith(true);
            view.subview.afterAttach.should.have.been.calledWith(true);
            viewafterAttachStub.restore();
            return viewSubviewafterAttachStub.restore();
          });
        });
        describe("when attached to an element that is not on the DOM", function() {
          it("calls afterAttach (if it is present) on the appended view, passing false to indicate it isn't on the DOM", function() {
            var fragment;
            viewafterAttachStub = sinon.stub(view, 'afterAttach');
            fragment = $('<div>');
            fragment.append(view);
            view.afterAttach.should.have.been.calledWith(false);
            return viewafterAttachStub.restore();
          });
          return it("doesn't call afterAttach a second time until the view is attached to the DOM", function() {
            var fragment, otherFragment;
            viewafterAttachStub = sinon.stub(view, 'afterAttach');
            fragment = $('<div>');
            fragment.append(view);
            view.afterAttach.reset();
            otherFragment = $('<div>');
            otherFragment.append(fragment);
            view.afterAttach.should.not.have.been.called;
            return view.afterAttach.restore();
          });
        });
        return it("allows $.fn.append to be called with undefined without raising an exception", function() {
          return expect(function() {
            return view.append(void 0);
          }).to.not["throw"](Error);
        });
      });
      return describe("when a view is removed from the DOM", function() {
        it("calls the `beforeRemove` hook once for each view", function() {
          var parent, spy, subviewParentViewDuringRemove;
          view = new TestRyggradView();
          content = $('#mocha');
          parent = $$(function() {
            return this.div();
          });
          parent.append(view);
          content.append(parent);
          subviewParentViewDuringRemove = null;
          spy = sinon.stub(view, 'beforeRemove', function() {
            return subviewParentViewDuringRemove = view.subview.parent().view();
          });
          subviewParentViewDuringRemove = null;
          parent.remove();
          expect(spy).to.have.been.called;
          expect(spy.callCount).to.be(1);
          return expect(subviewParentViewDuringRemove).to.be(view);
        });
        return it("the view instance is no longer accessible by calling view()", function() {
          var parent;
          content = $('#mocha');
          parent = $$(function() {
            return this.div();
          });
          parent.append(view);
          content.append(parent);
          expect($(view[0]).view()).to.be(view);
          parent.remove();
          return expect($(view[0]).view()).to.be.falsy;
        });
      });
    });
    describe("when the view constructs a new jQuery wrapper", function() {
      return it("constructs instances of jQuery rather than the view class", function() {
        expect(view.eq(0) instanceof jQuery).to.be.truthy;
        expect(view.eq(0) instanceof TestRyggradView).to.be.falsy;
        expect(view.end() instanceof jQuery).to.be.truthy;
        return expect(view.end() instanceof TestRyggradView).to.be.falsy;
      });
    });
    describe("Ryggrad.View.render (bound to $$)", function() {
      it("renders a document fragment based on tag methods called by the given function", function() {
        var fragment;
        fragment = $$(function() {
          var _this = this;
          return this.div({
            "class": "foo"
          }, function() {
            return _this.ol(function() {
              _this.li({
                id: 'one'
              });
              return _this.li({
                id: 'two'
              });
            });
          });
        });
        fragment.should.match('div.foo');
        fragment.find('ol').should.exist;
        fragment.find('ol li#one').should.exist;
        return fragment.find('ol li#two').should.exist;
      });
      return it("renders subviews", function() {
        var fragment;
        fragment = $$(function() {
          var _this = this;
          return this.div(function() {
            return _this.subview('foo', $$(function() {
              return this.div({
                id: "subview"
              });
            }));
          });
        });
        fragment.find('div#subview').should.exist;
        return fragment.foo.should.match('#subview');
      });
    });
    describe("View bindings", function() {
      return it("should bind model events to view methods", function() {
        var BindedView, Puppy, model, spy, _ref, _ref1;
        Puppy = (function(_super) {
          __extends(Puppy, _super);

          function Puppy() {
            _ref = Puppy.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          Puppy.configure("Puppy", "name");

          Puppy.extend(Ryggrad.AttributeTracking);

          return Puppy;

        })(Ryggrad.Model);
        BindedView = (function(_super) {
          __extends(BindedView, _super);

          function BindedView() {
            _ref1 = BindedView.__super__.constructor.apply(this, arguments);
            return _ref1;
          }

          BindedView.content = function(params, otherArg) {
            var _this = this;
            if (params == null) {
              params = {};
            }
            return this.div(function() {
              _this.h2({
                outlet: "header"
              }, params.title + " " + otherArg);
              _this.div("I am a subview");
              return _this.tag('mytag', {
                id: 'thetag'
              }, 'Non standard tag');
            });
          };

          BindedView.model_events = {
            "update:name": "updateName"
          };

          BindedView.prototype.updateName = function() {};

          return BindedView;

        })(Ryggrad.View);
        model = Puppy.create({
          name: 'gus'
        });
        view = new BindedView();
        spy = sinon.spy(view, "updateName");
        view.setModel(model);
        model.updateAttribute('name', 'jake');
        return spy.should.have.been.called;
      });
    });
    return describe("$$$", function() {
      return it("returns the raw HTML constructed by tag methods called by the given function (not a jQuery wrapper)", function() {
        var fragment, html;
        html = $$$(function() {
          var _this = this;
          return this.div({
            "class": "foo"
          }, function() {
            return _this.ol(function() {
              _this.li({
                id: 'one'
              });
              return _this.li({
                id: 'two'
              });
            });
          });
        });
        typeof html.should.be('string');
        fragment = $(html);
        fragment.should.match('div.foo');
        fragment.find('ol').should.exist;
        fragment.find('ol li#one').should.exist;
        return fragment.find('ol li#two').should.exist;
      });
    });
  });

}).call(this);

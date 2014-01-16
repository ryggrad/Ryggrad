(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Ryggrad.Ajax", function() {
    var User, jqXHR, spy, stubbedAjax;
    User = void 0;
    jqXHR = void 0;
    spy = void 0;
    stubbedAjax = void 0;
    beforeEach(function() {
      var _ref;
      Ryggrad.Ajax.clearQueue();
      User = (function(_super) {
        __extends(User, _super);

        function User() {
          _ref = User.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        User.configure("User", "first", "last");

        return User;

      })(Ryggrad.Model);
      jqXHR = $.Deferred();
      $.extend(jqXHR, {
        readyState: 0,
        setRequestHeader: function() {
          return this;
        },
        getAllResponseHeaders: function() {},
        getResponseHeader: function() {},
        overrideMimeType: function() {
          return this;
        },
        abort: function() {
          this.reject(arguments);
          return this;
        },
        success: jqXHR.done,
        error: jqXHR.fail,
        complete: jqXHR.done
      });
      stubbedAjax = sinon.stub(jQuery, 'ajax');
      return stubbedAjax.returns(jqXHR);
    });
    afterEach(function() {
      return stubbedAjax.restore();
    });
    it("can GET a collection on fetch", function() {
      User.fetch();
      return stubbedAjax.should.have.been.calledWith({
        data: void 0,
        dataType: "json",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        processData: false,
        type: "GET",
        url: "/users"
      });
    });
    it("can GET a record on fetch", function() {
      User.refresh([
        {
          first: "John",
          last: "Williams",
          id: "IDD"
        }
      ]);
      User.fetch({
        id: "IDD"
      });
      return stubbedAjax.should.have.been.calledWith({
        data: void 0,
        dataType: "json",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        processData: false,
        type: "GET",
        url: "/users/IDD"
      });
    });
    it("allows undeclared attributes from server", function() {
      User.refresh([
        {
          id: "12345",
          first: "Hans",
          last: "Zimmer",
          created_by: "spine_user",
          created_at: "2013-07-14T14:00:00-04:00",
          updated_at: "2013-07-14T14:00:00-04:00"
        }
      ]);
      return User.first().created_by.should.equal("spine_user");
    });
    it("should send POST on create", function() {
      User.create({
        first: "Hans",
        last: "Zimmer",
        id: "IDD"
      });
      return stubbedAjax.should.have.been.calledWith({
        type: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        contentType: "application/json",
        dataType: "json",
        data: "{\"first\":\"Hans\",\"last\":\"Zimmer\",\"id\":\"IDD\"}",
        url: "/users",
        processData: false
      });
    });
    it("should send PUT on update", function() {
      User.refresh([
        {
          first: "John",
          last: "Williams",
          id: "IDD"
        }
      ]);
      User.first().updateAttributes({
        first: "John2",
        last: "Williams2"
      });
      return stubbedAjax.should.have.been.calledWith({
        type: "PUT",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        contentType: "application/json",
        dataType: "json",
        data: "{\"first\":\"John2\",\"last\":\"Williams2\",\"id\":\"IDD\"}",
        url: "/users/IDD",
        processData: false
      });
    });
    it("should send DELETE on destroy", function() {
      User.refresh([
        {
          first: "John",
          last: "Williams",
          id: "IDD"
        }
      ]);
      User.first().destroy();
      return stubbedAjax.should.have.been.calledWith({
        data: void 0,
        dataType: "json",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        processData: false,
        type: "DELETE",
        url: "/users/IDD"
      });
    });
    it("should update record after PUT/POST", function() {
      var newAtts;
      User.create({
        first: "Hans",
        last: "Zimmer",
        id: "IDD"
      });
      newAtts = {
        first: "Hans2",
        last: "Zimmer2",
        id: "IDD"
      };
      jqXHR.resolve(newAtts);
      return User.first().attributes().first.should.equal(newAtts.first);
    });
    it("should update record with undeclared attributes from server", function() {
      var serverAttrs;
      User.create({
        first: "Hans",
        last: "Zimmer"
      });
      serverAttrs = {
        id: "12345",
        first: "Hans",
        last: "Zimmer",
        created_by: "spine_user",
        created_at: "2013-07-14T14:00:00-04:00",
        updated_at: "2013-07-14T14:00:00-04:00"
      };
      jqXHR.resolve(serverAttrs);
      return User.first().created_by.should.equal("spine_user");
    });
    it("should change record ID after PUT/POST", function() {
      var newAtts;
      User.create({
        id: "IDD"
      });
      newAtts = {
        id: "IDD2"
      };
      jqXHR.resolve(newAtts);
      User.first().id.should.equal("IDD2");
      return User.irecords["IDD2"].id.should.equal(User.first().id);
    });
    it("can update record IDs for already queued requests", function() {
      var newAtts, u;
      u = User.create();
      u.first = "Todd";
      u.last = "Shaw";
      u.save();
      newAtts = {
        id: "IDD"
      };
      jqXHR.resolve(newAtts);
      return stubbedAjax.should.have.been.calledWith({
        contentType: "application/json",
        data: "{\"first\":\"Todd\",\"last\":\"Shaw\",\"id\":\"IDD\"}",
        dataType: "json",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        processData: false,
        type: "PUT",
        url: "/users/IDD"
      });
    });
    it("should not recreate records after DELETE", function() {
      User.refresh([
        {
          first: "Phillip",
          last: "Fry",
          id: "MYID"
        }
      ]);
      User.first().destroy();
      User.count().should.equal(0);
      jqXHR.resolve({
        id: "MYID",
        name: "Phillip",
        last: "Fry"
      });
      return User.count().should.equal(0);
    });
    it("should send requests synchronously", function() {
      User.create({
        first: "First"
      });
      stubbedAjax.should.have.been.called;
      stubbedAjax.reset();
      User.create({
        first: "Second"
      });
      stubbedAjax.should.not.have.been.called;
      jqXHR.resolve();
      return stubbedAjax.should.have.been.called;
    });
    it("should return promise objects", function() {
      var user;
      User.refresh([
        {
          first: "John",
          last: "Williams",
          id: "IDD"
        }
      ]);
      user = User.find("IDD");
      user.ajax().update().done(spy);
      jqXHR.resolve();
      return stubbedAjax.should.have.been.called;
    });
    it("should allow promise objects to abort the request and dequeue", function() {
      var user;
      User.refresh([
        {
          first: "John",
          last: "Williams",
          id: "IDD"
        }
      ]);
      user = User.find("IDD");
      spy = sinon.spy();
      user.ajax().update().fail(spy);
      Ryggrad.Ajax.queue().length.should.equal(1);
      jqXHR.abort();
      Ryggrad.Ajax.queue().length.should.equal(0);
      return stubbedAjax.should.have.been.called;
    });
    it("should not replace AJAX results when dequeue", function() {
      User.refresh([], {
        clear: true
      });
      jqXHR.resolve([
        {
          id: "IDD"
        }
      ]);
      User.fetch();
      return User.exists("IDD").should.be.truthy;
    });
    it("should have success callbacks", function() {
      User.create({
        first: "Second",
        success: spy
      });
      jqXHR.resolve();
      return stubbedAjax.should.have.been.called;
    });
    it("should have error callbacks", function() {
      User.create({
        first: "Second"
      }, {
        error: spy
      });
      jqXHR.reject();
      return stubbedAjax.should.have.been.called;
    });
    it("should cancel ajax on change", function() {
      User.create({
        first: "Second"
      }, {
        ajax: false
      });
      jqXHR.resolve();
      return stubbedAjax.should.not.have.been.called;
    });
    it("should expose the defaults object", function() {
      return Ryggrad.Ajax.defaults.should.be.defined;
    });
    it("can get a url property with optional host from a model and model instances", function() {
      var user;
      User.url = "/people";
      Ryggrad.Ajax.getURL(User).should.be("/people");
      user = new User({
        id: 1
      });
      user.url().should.be("/people/1");
      user.url("custom").should.be("/people/1/custom");
      Ryggrad.Model.host = "http://example.com";
      return user.url().should.be("http://example.com/people/1");
    });
    it("can override POST url with options on create", function() {
      User.create({
        first: "Adam",
        id: "123"
      }, {
        url: "/people"
      });
      return stubbedAjax.should.have.been.calledWith({
        type: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        dataType: "json",
        data: "{\"first\":\"Adam\",\"id\":\"123\"}",
        contentType: "application/json",
        url: "/people",
        processData: false
      });
    });
    it("can override GET url with options on fetch", function() {
      User.fetch({
        url: "/people"
      });
      return stubbedAjax.should.have.been.calledWith({
        type: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        dataType: "json",
        url: "/people",
        processData: false,
        data: void 0
      });
    });
    it("can override PUT url with options on update", function() {
      var user;
      user = User.create({
        first: "Adam",
        id: "123"
      }, {
        ajax: false
      });
      user.updateAttributes({
        first: "Odam"
      }, {
        url: "/people"
      });
      return stubbedAjax.should.have.been.calledWith({
        type: "PUT",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        dataType: "json",
        data: "{\"first\":\"Odam\",\"id\":\"123\"}",
        contentType: "application/json",
        url: "/people",
        processData: false
      });
    });
    it("can override DELETE url with options on destroy", function() {
      var user;
      user = User.create({
        first: "Adam",
        id: "123"
      }, {
        ajax: false
      });
      user.destroy({
        url: "/people"
      });
      return stubbedAjax.should.have.been.calledWith({
        type: "DELETE",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        dataType: "json",
        url: "/people",
        processData: false,
        data: void 0
      });
    });
    it("should have a url function", function() {
      var user;
      Ryggrad.Model.host = "";
      User.url().should.be("/users");
      User.url("search").should.be("/users/search");
      user = new User({
        id: 1
      });
      user.url().should.be("/users/1");
      user.url("custom").should.be("/users/1/custom");
      Ryggrad.Model.host = "http://example.com";
      User.url().should.be("http://example.com/users");
      return user.url().should.be("http://example.com/users/1");
    });
    it("can gather scope for the url from the model", function() {
      var user;
      Ryggrad.Model.host = "";
      User.scope = "admin";
      User.url().should.be("/admin/users");
      User.url("custom").should.be("/admin/users/custom");
      user = new User({
        id: 1
      });
      user.url().should.be("/admin/users/1");
      User.scope = function() {
        return "/roots/1";
      };
      User.url().should.be("/roots/1/users");
      user.url().should.be("/roots/1/users/1");
      user.url("custom").should.be("/roots/1/users/1/custom");
      Ryggrad.Model.host = "http://example.com";
      User.url().should.be("http://example.com/roots/1/users");
      return user.url().should.be("http://example.com/roots/1/users/1");
    });
    it("can gather scope for the url from a model instance", function() {
      var user;
      Ryggrad.Model.host = "";
      User.url().should.be("/users");
      user = new User({
        id: 1
      });
      user.scope = "admin";
      user.url().should.be("/admin/users/1");
      user.scope = function() {
        return "/roots/1";
      };
      User.url().should.be("/users");
      user.url().should.be("/roots/1/users/1");
      user.url("custom").should.be("/roots/1/users/1/custom");
      Ryggrad.Model.host = "http://example.com";
      User.url().should.be("http://example.com/users");
      return user.url().should.be("http://example.com/roots/1/users/1");
    });
    it("should allow the scope for url on model to be superseeded by an instance", function() {
      var user;
      Ryggrad.Model.host = "";
      User.scope = "admin";
      User.url().should.be("/admin/users");
      user = new User({
        id: 1
      });
      user.url().should.be("/admin/users/1");
      user.scope = function() {
        return "/roots/1";
      };
      User.url().should.be("/admin/users");
      user.url().should.be("/roots/1/users/1");
      Ryggrad.Model.host = "http://example.com";
      User.url().should.be("http://example.com/admin/users");
      return user.url().should.be("http://example.com/roots/1/users/1");
    });
    it("should work with relative urls", function() {
      var user;
      User.url = "../api/user";
      Ryggrad.Ajax.getURL(User).should.be("../api/user");
      user = new User({
        id: 1
      });
      return Ryggrad.Ajax.getURL(user).should.be("../api/user/1");
    });
    return it("should get the collection url from the model instance", function() {
      var user;
      Ryggrad.Model.host = "";
      User.scope = "admin";
      user = new User({
        id: 1
      });
      Ryggrad.Ajax.getCollectionURL(user).should.be("/admin/users");
      user.scope = "/root";
      Ryggrad.Ajax.getCollectionURL(user).should.be("/root/users");
      user.scope = function() {
        return "/roots/" + this.id;
      };
      return Ryggrad.Ajax.getCollectionURL(user).should.be("/roots/1/users");
    });
  });

}).call(this);

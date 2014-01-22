(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Ryggrad.Ajax", function() {
    var User, spy;
    User = void 0;
    spy = void 0;
    beforeEach(function() {
      var _ref;
      User = (function(_super) {
        __extends(User, _super);

        function User() {
          _ref = User.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        User.key("first", String);

        User.key("last", String);

        return User;

      })(Ryggrad.Model);
      return spy = sinon.spy(jQuery, "ajax");
    });
    afterEach(function() {
      return spy.restore();
    });
    it("can GET a collection on fetch", function() {
      var ajaxArgs;
      ajaxArgs = {
        dataType: "json",
        type: "GET",
        url: "/users"
      };
      spy.withArgs(ajaxArgs);
      User.fetch();
      return spy.withArgs(ajaxArgs).should.have.been.called;
    });
    it("can GET a record on fetch", function() {
      var ajaxArgs, user;
      User.add([
        {
          first: "John",
          last: "Williams",
          id: "IDD"
        }
      ]);
      user = User.all()[0];
      ajaxArgs = {
        dataType: "json",
        type: "GET",
        url: "/users/IDD"
      };
      spy.withArgs(ajaxArgs);
      user.fetch();
      return spy.withArgs(ajaxArgs).should.have.been.called;
    });
    it("allows undeclared attributes from server", function() {
      User.add([
        {
          id: "12345",
          first: "Hans",
          last: "Zimmer",
          created_by: "spine_user",
          created_at: "2013-07-14T14:00:00-04:00",
          updated_at: "2013-07-14T14:00:00-04:00"
        }
      ]);
      return User.all()[0].created_by.should.equal("spine_user");
    });
    it("should send POST on save", function() {
      var ajaxArgs, user;
      ajaxArgs = {
        data: {
          first: "Hans",
          id: "IDD",
          last: "Zimmer"
        },
        queue: true,
        type: "POST",
        url: "/users",
        warn: true
      };
      spy.withArgs(ajaxArgs);
      user = User.create({
        first: "Hans",
        last: "Zimmer",
        id: "IDD"
      });
      return spy.withArgs(ajaxArgs).should.have.been.called;
    });
    it("should send PUT on update", function() {
      var ajaxArgs, user;
      user = User.create({
        first: "John",
        last: "Williams",
        id: "IDD"
      });
      ajaxArgs = {
        data: {
          first: "John2",
          id: "IDD",
          last: "Williams2"
        },
        queue: true,
        type: "PUT",
        url: "/users/IDD",
        warn: true
      };
      spy.withArgs(ajaxArgs);
      user.save({
        first: "John2",
        last: "Williams2"
      });
      return spy.withArgs(ajaxArgs).should.have.been.called;
    });
    it("should send DELETE on destroy", function() {
      var ajaxArgs, user;
      user = User.create({
        first: "John",
        last: "Williams",
        id: "IDD"
      });
      ajaxArgs = {
        queue: true,
        type: "DELETE",
        url: "/users/IDD",
        warn: true
      };
      spy.withArgs(ajaxArgs);
      user.destroy();
      return spy.withArgs(ajaxArgs).should.have.been.called;
    });
    return it("should have a url function", function() {
      var user;
      User.url().should.be("/users");
      User.url("search").should.be("/users/search");
      user = new User({
        id: 1
      });
      user.url().should.be("/users/1");
      return user.url("custom").should.be("/users/1/custom");
    });
  });

}).call(this);

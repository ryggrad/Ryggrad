module.exports = function(window) {
  var jQuery;
  jQuery = require('jquery')(window);
  jQuery.event.special.removed = {
    remove: function(e) {
      return typeof e.handler === "function" ? e.handler() : void 0;
    }
  };
  $.fn.extend({
    hasEvent: function(A, F, E) {
      var L, S, T, V, e;
      L = 0;
      T = typeof A;
      V = false;
      E = (E ? E : this);
      A = (T === "string" ? $.trim(A) : A);
      if (T === "function") {
        F = A;
        A = null;
      }
      if (F === E) {
        F = null;
      }
      S = E.data("events");
      for (e in S) {
        if (S.hasOwnProperty(e)) {
          L++;
        }
      }
      if (L < 1) {
        return V = false;
      }
      if (A && !F) {
        return V = S.hasOwnProperty(A);
      } else if (A && S.hasOwnProperty(A) && F) {
        $.each(S[A], function(i, r) {
          if (V === false && r.handler === F) {
            return V = true;
          }
        });
        return V;
      } else if (!A && F) {
        $.each(S, function(i, s) {
          if (V === false) {
            return $.each(s, function(k, r) {
              if (V === false && r.handler === F) {
                return V = true;
              }
            });
          }
        });
      }
      return V;
    }
  });
  return $.extend($.fn.hasEvent);
};

var Storage,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Storage = (function() {
  function Storage(collection, storageOptions) {
    this.collection = collection;
    this.all = __bind(this.all, this);
    this.model = this.collection.model;
    this.options = this.collection.options;
    this.records = this.collection.records;
    this.key_name = this.model.pluralName();
  }

  Storage.prototype.add = function(records) {};

  Storage.prototype.all = function(options) {
    if (options == null) {
      options = {};
    }
  };

  Storage.prototype.find = function() {};

  Storage.prototype.findBy = function() {};

  Storage.prototype.save = function(records) {};

  Storage.prototype.destroy = function(records) {};

  return Storage;

})();

module.exports = Storage;

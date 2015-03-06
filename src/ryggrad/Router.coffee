Controller = require('./Controller')
Route      = require('./Route')

class Router
  constructor: ->
    @path   = ''
    @routes = []
    $(window).on('popstate', @change)

  add: (path, callback) ->
    if (typeof path is 'object' and path not instanceof RegExp)
      return @add(key, value) for key, value of path

    @routes.push(new Route(path, callback))

  navigate: (@path) =>
    return if @locationPath() is @path

    history?.pushState?(
      {},
      document.title,
      @path
    )

  getPath: =>
    return @path

  locationPath: =>
    path = window.location.pathname
    if path.substr(0,1) isnt '/'
      path = '/' + path
    path

  change: =>
    path  = @locationPath()
    return if path is @path
    @path = path
    @matchRoute(@path)

  matchRoute: (path, options) =>
    for route in @routes
      if route.match(path, options)
        return route

module.exports = Router

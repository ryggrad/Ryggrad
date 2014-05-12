class Ajax
  create: (modelOrModels, options={}) ->
    url = modelOrModels.constructor.url() if modelOrModels.isModel
    url or= modelOrModels.url()

    @request("POST", url, modelOrModels, options.ajax).done (resp) =>
      modelOrModels.fromJSON(resp)

  read: (modelOrModels, options={}) ->
    @request("GET", modelOrModels.url(), modelOrModels, options.ajax).done (resp) =>      
      modelOrModels.fromJSON(resp)

  update: (modelOrModels, options={}) ->
    @request("PUT", modelOrModels.url(), modelOrModels, options.ajax).done (resp) =>
      modelOrModels.fromJSON(resp)

  delete: (modelOrModels, options={}) ->
    @request("DELETE", modelOrModels.url(), modelOrModels, options.ajax)

  request: (method, url, data, options={}) ->
    defaults =
      type:  method
      url:   url
      queue: true
      warn:  true
      dataType: "json"
      
    defaults['data'] = data.toJSON() if $.inArray(method, ["POST", "PUT"]) > -1
    
    $.ajax $.extend(defaults, options)

module.exports = Ajax

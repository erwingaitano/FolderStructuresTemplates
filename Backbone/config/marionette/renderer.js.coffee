Backbone.Marionette.Renderer.render = (template, data) ->
  # We are using the handlebars_assets gem so we can use files to store our templates
  # and attach them to the HandlebarsTemplates object, also we can use partials easily
  path = HandlebarsTemplates["backbone/apps/" + template]
  unless path
    throw "Template #{template} not found!"
  path(data)
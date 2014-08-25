@BackboneMarionetteApp.module "HeaderApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Header extends App.Views.ItemView
    template: "header/show/templates/header"
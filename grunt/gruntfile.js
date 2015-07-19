module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    
    pkg: grunt.file.readJSON("package.json"),
    svgstore: {
      options: {
        prefix : "svg-icon-", // This will prefix each svg icon ID
        svg: {
          style : "display: none;"
        }
      },

      default : {
        files: {
          "app/views/shared/app/_svg_icon.html": ["grunt_tasks/app/svg_icons/*.svg"]
        },
      }
    }
    
  });

  grunt.loadNpmTasks("grunt-svgstore");

};
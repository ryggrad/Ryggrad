module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    meta:
      file: 'ryggrad'
      endpoint: 'package',
      banner: '/* <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy/m/d") %>\n' +
              '   <%= pkg.homepage %>\n' +
              '   Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
              ' - Licensed under <%= pkg.license %> */\n'

    resources:
      src: [
        'src/ryggrad.coffee',
        'src/ryggrad.util.coffee',
        'src/ryggrad.module.coffee',
        'src/ryggrad.events.coffee',
        'src/ryggrad.model.coffee',
        'src/ryggrad.view.coffee',
        'src/ryggrad.controller.coffee',
        'src/ryggrad.relation.coffee',
        'src/ryggrad.attributeTracking.coffee',
        'src/ryggrad.bindings.coffee',
        'src/ryggrad.binders.coffee',
        'src/ryggrad.binder.adapter.coffee',
        'src/ryggrad.route.coffee',
        'src/ryggrad.ajax.coffee'
      ]
      spec: [
        'spec/*_spec.coffee'
      ]

      # Specs That Can Only Be Ran via browser
      browser_spec: [
        'spec/*_browserspec.coffee'
      ]

    coffee:
      options:
        join: true
      src:
        files:
          '<%= meta.endpoint %>/<%= meta.file %>.debug.js': '<%= resources.src %>'
      test:
        files:
          'test/js/ryggrad.js': '<%= resources.src %>'
          'test/spec/spec.js':   ['<%= resources.spec %>']
          'test/spec/browser_spec.js':   ['<%= resources.browser_spec %>']

    uglify:
      options:
        compress: false
        banner: '<%= meta.banner %>'
      endpoint:
        files: '<%=meta.endpoint%>/<%=meta.file%>.js':  '<%= meta.endpoint %>/<%= meta.file %>.debug.js'

    watch:
      src:
        files: '<%= resources.src %>'
        tasks: ['coffee:src', 'uglify']
    
    mocha:
      test:
        src: [ 'test/test.html' ],
        options:
          # Select a Mocha reporter
          # http://visionmedia.github.com/mocha/#reporters
          reporter: 'Spec',

          # Indicates whether 'mocha.run()' should be executed in
          # 'bridge.js'. If you include `mocha.run()` in your html spec,
          # check if environment is PhantomJS. See example/test/test2.html
          run: true,

          # Override the timeout of the test (default is 5000)
          timeout: 10000

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-mocha'

  grunt.registerTask 'default', ['coffee:src', 'uglify']
  grunt.registerTask 'spec', ['coffee:test', 'mocha:test']

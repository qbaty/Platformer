var LIVERELOAD_PORT = 36729,
    lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT }),
    mountFolder = function( connect, dir ) {
        return connect.static(require('path').resolve(dir));
    };

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    transport: {
        options: {
            path: ['.'],
            alias: {
                'jquery': 'jquery',
                'platformer': 'platformer'
            },
            idleading: 'dist/script/'
        },
        index: {
            files: [{
                expand: true,
                cwd: 'app/src/script/',
                src: '*.js',
                dest: 'app/dist/script/build/'
            }]
        }
    },

    concat: {
        options: {
            include: 'relative'
        },
        index: {
            files: [{
                expand: true,
                cwd: 'app/dist/script/build/',
                src: '**/*.js',
                dest: 'app/dist/script/',
                ext: '.js'
            }]
        },
        platformer: {
            options: {
                noncmd: true
            },
            files: {
            'app/dist/script/platformer-debug.js': [
                'app/src/script/platformer/intro.js',
                'app/src/script/platformer/system/RequestAnimationFrame.js',
                'app/src/script/platformer/system/Resize.js',
                'app/src/script/platformer/utils/type.js',
                'app/src/script/platformer/config.js',
                'app/src/script/platformer/core/Canvas.js',
                'app/src/script/platformer/core/Sprite.js',
                'app/src/script/platformer/core/Stopwatch.js',
                'app/src/script/platformer/core/NotificationCenter.js',
                'app/src/script/platformer/artist/Artist.js',
                'app/src/script/platformer/behavior/Behavior.js',
                'app/src/script/platformer/utils/extend.js',
                'app/src/script/platformer/artist/RecArtist.js',
                'app/src/script/platformer/artist/SpriteSheetArtist.js',
                'app/src/script/platformer/behavior/CycleBehavior.js',
                'app/src/script/platformer/behavior/TimeBehavior.js',
                'app/src/script/platformer/behavior/MoveBehavior.js',
                'app/src/script/platformer/behavior/JumpBehavior.js',
                'app/src/script/platformer/behavior/CollideBehavior.js',
                'app/src/script/platformer/core/AnimationTimer.js',
                'app/src/script/platformer/core/Platform.js',
                'app/src/script/platformer/outro.js'
            ]}
        }
    },

    jshint: {
        beforeconcat: ['app/src/script/**/*.js', 
                       '!app/src/script/platformer/intro.js',
                       '!app/src/script/platformer/outro.js' ]
    },

    uglify: {
        index: {
            files: [{
                expand: true,
                cwd: 'app/dist/script/',
                src: ['**/*.js', '!**/*-debug.js'],
                dest: 'app/dist/script/',
                ext: '.js'
            }]
        },
        platformer: {
            files: {
                'app/dist/script/platformer.js': ['app/dist/script/platformer-debug.js']
            }
        }
    },

    imagemin: {
        dynamic: {
            files: [{
                expand: true,
                cwd: 'app/src/img/',
                src: ['**/*.{png,jpg,gif}'],
                dest: 'app/dist/img/'
            }]
        }
    },

    less: {
      development: {
        files: {
          "app/dist/style/app-debug.css": "app/src/style/app.less"
        }
      },
      production: {
        options: {
          cleancss: true,
        },
        files: {
          "app/dist/style/app.css": "app/src/style/app.less"
        }
      }
    },

    clean: {
        index: ['app/dist/script/build/']
    },

    watch: {
        livereload: {
            files: ["app/*.html", "app/src/style/**/*.less",
                "app/src/script/**/*.js"],
            tasks: ["less", "transport", "concat", "jshint", "uglify", "clean"],
            options: {
                livereload: LIVERELOAD_PORT
            }
        },
    },

    connect: {
        options: {
            port: 9000,
            hostname: '0.0.0.0'
        },
        livereload: {
            options: {
                middleware: function(connect) {
                    return [
                        lrSnippet,
                        mountFolder(connect, 'app/')
                    ];
                }
            }
        }
    },

    open: {
        server: {
            url: 'http://localhost:<%= connect.options.port %>'
        }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-cmd-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('server', function() {
      grunt.task.run([
          'connect:livereload',
          'open',
          'watch'
      ]);
  });
  grunt.registerTask('build-pro', ['less:production']);
};


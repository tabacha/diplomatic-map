
module.exports = function(grunt) {
 
    grunt.initConfig({
        clean: ['fonts', 'css/generated.css', 'js/generated.js', 'bower_components', 'dist'],
        bower: {
            install: {
                options: {
                    copy: true,
                    verbose: true,
                },
  //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
            },
        },
        jshint: {
            all: ['Gruntfile.js', 'js/**.js', 'js/**/**.js', 'config.js'  ]
        },
        eslint: {
            target: ['Gruntfile.js', 'js/**.js', 'js/**/**.js', 'config.js', '!js/diplomatic/model/version.js' ]
        },
        copy: {
            fonts: {
                files: [
      {expand: true, flatten: true, src: ['bower_components/*/fonts/*'], dest: 'fonts/', filter: 'isFile'},
                ]
            },
            dist: {
                files: [
      {expand: true, flatten: false, src: ['index.html',
        'comment_freigabe.php',
        'api/**',
        'css/generated.css*',
        'bower_components/requirejs/require.js',
        'fonts/*',
        'data/*',
        'bower_components/leaflet/dist/images/*'
       ], dest: 'dist/', filter: 'isFile'},
                ]
            },

        },
        cssmin: {
            css: {
                options: {
                    sourceMap: true,
                },
                files: {
                    'css/generated.css': [
                        'lib/leaflet/leaflet.css',
                        'lib/leaflet.markercluster/dist/MarkerCluster.css',
                        'lib/leaflet.markercluster/dist/MarkerCluster.Default.css',
                        'lib/bootstrap3-dialog/bootstrap-dialog.min.css',
                        'bower_components/font-awesome/css/font-awesome.css',
                        'bower_components/bootstrap/dist/css/bootstrap.css',
                        'css/screen.css'
                    ]
                }
            }
        },
        requirejs: {
            common: {
                options: {
                    baseUrl: 'js',
                    mainConfigFile: 'js/common.js',
                    out: 'dist/js/common.js',
                    include: ['jquery', 'bootstrap'],
                }
            },
            map: {
                options: {
                    baseUrl: 'js',
                    mainConfigFile: 'js/common.js',
                    out: 'dist/diplomatic/app/map.js',
                    name: 'diplomatic/app/map',
                    exclude: ['jquery', 'bootstrap'],
                }
            }
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'js/**.js', 'js/*/**.js', 'config.js', '!js/leaflet.geocsv-src.js', '!js/leaflet.geocsv.js' ],
                tasks: ['eslint', 'jshint', 'copy', 'requirejs'],
            }
        },
        'git-describe': {
            options: {
                prop: 'meta.revision'
            },
            me: {}
        },
    });


    grunt.event.once('git-describe', function (rev) {
        grunt.log.writeln('Git Revision: ' + rev);
        var out = 'define(\'diplomatic/model/version\', function () { return '+
            JSON.stringify({
                revision: rev[0],
                date: grunt.template.today()
            })+';});';
        grunt.file.write('js/diplomatic/model/version.js', out.replace(/\"/g, '\'').replace(/,/g, ', '));
    });
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-git-describe');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.task.registerTask('default', ['bower', 'git-describe', 'eslint', 'jshint', 'requirejs', 'cssmin', 'copy']);
};


module.exports = function(grunt) {
 
    grunt.initConfig({
        clean: ['fonts', 
                'css/generated.css', 
                'js/generated.js', 
                'bower_components', 
                'js/common-generated.js',
                'js/common-generated-test.js',
                'js/i18n/**',
                'dist'],
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
            all: ['Gruntfile.js', 
                  'js/**.js', 
                  'js/**/**.js', 
                  'config.js', 
                  '!js/common-generated.js',
                  '!js/common-generated-test.js',
                 ]
        },
        eslint: {
            target: ['Gruntfile.js', 
                     'js/**.js',
                     'js/**/**.js', 
                     'config.js', 
                     '!js/common-generated.js',
                     '!js/common-generated-test.js',
                     '!js/diplomatic/model/version.js' ]
        },
        copy: {
/*            i18n_en: {
                files: [
                    {src: 'i18n/diplomatic.pot',
                    dest: 'i18n/en_US.po'
                    }
                ]
            },*/
            i18n: {
                files: [
                    {expand: true,
                     flatten: true,
                     src: 'js/i18n/*.js',
                     dest: 'dist/i18n/',
                     filter: 'isFile',
                    }
                ]
            },
            fonts: {
                files: [
                    {expand: true, flatten: true, src: ['bower_components/*/fonts/*'], dest: 'fonts/', filter: 'isFile'},
                ]
            },
            dist: {
                files: [
                    {expand: true, 
                     flatten: false, 
                     src: ['index.html', 
                           'validator-test.html',
                           'lib/**',
                           'css/generated.css*',
                           'bower_components/requirejs/require.js',
                           'fonts/*',
                           'data/*',
                           'bower_components/leaflet/dist/images/*'
                          ], 
                     dest: 'dist/', 
                     filter: 'isFile'},
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
                    mainConfigFile: 'js/common-generated.js',
                    out: 'dist/js/common-generated.js',
//                    generateSourceMaps: true,
                    include: ['jquery', 'bootstrap'],
                    exclude: ['normalize'],
                }
            },
            map: {
                options: {
                    baseUrl: 'js',
                    mainConfigFile: 'js/common-generated.js',
                    out: 'dist/diplomatic/app/map.js',
//                    generateSourceMaps: true,
                    name: 'diplomatic/app/map',
                    exclude: ['jquery', 'bootstrap', 'normalize'],
                }
            },
            'validator-test': {
                options: {
                    baseUrl: 'js',
                    mainConfigFile: 'js/common-generated.js',
                    out: 'dist/diplomatic/app/validator-test.js',
//                    generateSourceMaps: true,
                    name: 'diplomatic/app/validator-test',
                    exclude: ['jquery', 'bootstrap', 'normalize'],
                }
            }
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'js/**.js', 'js/**/**.js', 'config.js', '!js/leaflet.geocsv-src.js', '!js/leaflet.geocsv.js' ],
                tasks: ['eslint', 'jshint', 'copy', 'requirejs'],
            }
        },

        'karma': {

            options: {
                configFile: 'karma.conf.js',
                builddir: 'build/'
            },
            unit: {
                background: true,
                autoWatch: false
            },
            serve: {
                backgrount: false,
                autoWatch: false
            },
            html: {
                singleRun: true,
                browsers: ['PhantomJS'],
                reporters: ['coverage', 'html'],
                htmlReporter: {
                    outputDir: 'reports', // where to put the reports 
                    subdir: '.',
                    reportName: 'index.html',
                    templatePath: 'karma_html_template.html',
                },
                coverageReporter: {
                    check: {
                        global: {
                            excludes: [
                                'js/common-generated.js'
                            ],
                            statements: 6,
                            branches: 1,
                            functions: 3,
                            lines: 6,
                        },
                    },
                    type: 'html',
                    dir: 'reports/coverage',
                    subdir: '.',
                    includeAllSources: true
                }

            },
        //continuous integration mode: run tests once in PhantomJS browser.
            continuous: {
                singleRun: true,
                browsers: ['PhantomJS'],
//                reporters: ['junit']
                reporters: ['progress', 'coverage'],
                coverageReporter: {
                    check: {
                        global: {
                            excludes: [
                                'js/common-generated.js'
                            ],
                            statements: 6,
                            branches: 1,
                            functions: 3,
                            lines: 6,
                        },
                    },
                    type: 'text-summary',
                    subdir: '.',
                    includeAllSources: true
                }
            }

        },
        'git-describe': {
            options: {
                prop: 'meta.revision'
            },
            me: {}
        },
        create_pot: {
            simple: {
                options: {
                    headers: {
                        'Last-Translator': 'NAME <EMAIL>',
                        'Language-Team': 'NAME <EMAIL>',
                        'Content-Type': 'text/plain; charset=UTF-8',
                        'Content-Transfer-Encoding': '8bit',
                        'Plural-Forms': 'nplurals=2; plural=(n!=1);'
                    }
                },
                files: {
                    'i18n/diplomatic.pot': ['js/diplomatic/**/**.js']
                }
            }
        },
        compile_po: { 
            simple: {
                options: {
                    template: 'i18n/templates/po_template.js',
                },
                src: ['i18n/*.po'],
                dest: 'js/i18n/'
            }
        }
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
    grunt.loadNpmTasks('grunt-require-gettext');
    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('generate-common', 'generated common.js', function (arg1) {
        var done = this.async(),
            header = '',
            filename = 'js/common-generated.js',
            config={
                'baseUrl': 'js',
                'paths': {
                    'jquery': '../lib/jquery/jquery',
                    'jed': '../node_modules/jed/jed',
                    'css': '../lib/require-css/css',
                    'css-builder': '../lib/require-css/css-builder',
                    'normalize': '../lib/require-css/normalize',
                    'js.cookie': '../lib/js-cookie/js.cookie',
                    'bootstrap': '../lib/bootstrap/bootstrap',
                    'bootstraptypehead': '../lib/bootstrap3-typeahead/bootstrap3-typeahead',
                    'bootstrap-dialog': '../lib/bootstrap3-dialog/bootstrap-dialog.min',
                    'leaflet': '../lib/leaflet/leaflet',
                    'leafletmarker': '../lib/leaflet.markercluster/dist/leaflet.markercluster',
                    'leaflethash': '../lib/leaflet-hash/leaflet-hash',
                },
                'shim': {
                    jquerycookie: {
                        deps: ['jquery'],
                        exports: '$.cookie',
                    },
                    leafletmarker: {
                        deps: ['leaflet'],
                    },
                    leaflethash: {
                        deps: ['leaflet'],
                    },
                    bootstrap: {
                        deps: ['jquery'],
                    },
                    bootstraptypehead: {
                        deps: ['bootstrap'],
                    },
                    'bootstrap-dialog': {
                        deps: ['jquery', 'bootstrap'],
                    }
                    
                }
            };
        if (arg1 === 'test') {
            /* jshint ignore:start */
            config.callback= 'PLACEHOLDER1';
            config.baseUrl= '/base/js';
            config.paths.test= '../test';
            config.deps= 'PLACEHOLDER2';
            filename = 'js/common-generated-test.js',
            header= 'var TEST_REGEXP = /\\/base\\/test\\/.*\\.js$/i;\n'+
                'allTestFiles =[];\n'+
                // Get a list of all the test files to include
                'Object.keys(window.__karma__.files).forEach(function(file) {\n'+
                '\tif (TEST_REGEXP.test(file)) {\n'+
                '\t\tvar normalizedTestModule = file.replace(/^\\/base\\/|\\.js$/g, \'\');\n'+
                '\t\tallTestFiles.push(normalizedTestModule);\n'+
                '\t}\n});\n\n';
            /* jshint ignore:end */
        }   
        fs = require('fs');
        var out= '// generated by grunt, DO NOT CHANGE here!\n\n'+ header+'requirejs.config('+
            JSON.stringify(config, null, '\t')+
            ')';
        out=out.replace(/\"PLACEHOLDER1\"/, 'window.__karma__.start');
        out=out.replace(/\"PLACEHOLDER2\"/, 'allTestFiles');
        out=out.replace(/\"/g, '\'');
        fs.writeFile(filename, out, 
                     function(err) {
                         if(err) {
                             return console.log(err);
                         }
                             
                         console.log('The file '+filename+' was saved!');
                         done();
                     }); 

    });
    grunt.registerTask('update-wikidata', 'update-data from wikidata api', function(arg1) {
        var done = this.async(),
            testmode = false,
            requirejs = require('requirejs');

        requirejs.config({
            baseUrl: __dirname,
        });
        if ((arg1 !== undefined) && (arg1 === 'test')) {
            testmode = true;
        }
        requirejs(['js/common-generated'], function () {
            requirejs(['diplomatic/app/update-wikidata'], function(updateOverpass) {
                console.log('loaded');
                updateOverpass(testmode, done, done);
            }, function() {
                console.log('err');
                done();
            });
        }, function (a) {
            console.log('error', a);
            done();
        });
    });
    grunt.registerTask('update-overpass', 'update-data from overpass api', function(arg1) {
        var done = this.async(),
            testmode = false,
            requirejs = require('requirejs');

        requirejs.config({
            baseUrl: __dirname,
        });
        if ((arg1 !== undefined) && (arg1 === 'test')) {
            testmode = true;
        }
        requirejs(['js/common-generated'], function () {
            requirejs(['diplomatic/app/update-overpass'], function(updateOverpass) {
                console.log('loaded');
                updateOverpass(testmode, done, done);
            }, function() {
                console.log('err');
                done();
            });
        }, function (a) {
            console.log('error', a);
            done();
        });
    });
    //    grunt.loadTasks('grunt/tasks');
    grunt.task.registerTask('update-data', ['update-wikidata', 'update-overpass']);
    grunt.task.registerTask('default', ['bower',  'git-describe', 'generate-common', 'eslint', 'jshint', 'create_pot', 'compile_po', 'requirejs', 'cssmin', 'copy:fonts', 'copy:dist', 'copy:i18n']);
    grunt.task.registerTask('test', ['generate-common:test', 'karma:continuous']);
};

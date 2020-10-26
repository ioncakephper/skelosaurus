

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        shell: {
            captureHelp: {
                command: 'node index.js -h > index-js-help.txt'
            },
            generateAPI: {
                command: 'jsdoc2md index.js > index-js-jsdoc.md'
            }
        }
    })

    grunt.registerTask('default', ['shell'])

}
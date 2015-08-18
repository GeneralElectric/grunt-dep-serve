'use strict';

/*
 * Copyright (c) 2014 GE Global Research. All rights reserved.
 *
 * The copyright to the computer software herein is the property of
 * GE Global Research. The software may be used and/or copied only
 * with the written permission of GE Global Research or in accordance
 * with the terms and conditions stipulated in the agreement/contract
 * under which the software has been supplied.
 */

var httpServer = require('http-server'),
    portfinder = require('portfinder'),
    merge = require('merge'),
    opener = require('opener'),
    livereload = require('livereload');

module.exports = function(grunt) {

    portfinder.basePort = 8080;

    var _defaultOptions = {
        depDir: '/bower_components',
        open: '/'
    };

    function startLocalHttpServer(opts) {
        portfinder.getPort(function (err, foundPort) {
            if (err) {
                throw err;
            }

            var localHttpServer = httpServer.createServer({
                root : './',
                cache: -1,
                silent: false,
                proxy: 'http://0.0.0.0:' + foundPort + opts.depDir //this is the magic step...reroutes potential 404s to try the dependencies directory
            });

            localHttpServer.listen(foundPort, "0.0.0.0", function() {
                console.log("Local http server listening at http://localhost:" + foundPort + "/ with dependencies proxied from " + opts.depDir);
                if (opts.open) {
                    var openPath = "http://localhost:" +  foundPort + opts.open;
                    console.log("Opening " + openPath + " in browser...");
                    opener(openPath);
                }
                if (opts.livereload) {
                    var livereloadServer = livereload.createServer();
                    console.log('LiveReload is watching: ', opts.livereload)
                    livereloadServer.watch(opts.livereload);
                }
                console.log("ctrl+c to exit");
            });
        });
    }

    grunt.registerTask('depserve', 'Starts http-server in a way that serves dependencies correctly', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var opts = merge(/*clone*/true, this.options(_defaultOptions), this.data);
        var done = this.async(); //we make this task async but intentionally never call done(), so it stays running until ctrl+c is hit.
        startLocalHttpServer(opts);
    });
};

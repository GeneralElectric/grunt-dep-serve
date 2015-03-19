'use strict'

var exec = require('child_process').exec;

var _verifyGlobalPackage = function(pkgName, version, link) {
    var resolvedPkgName = version ? pkgName + "@" + version : pkgName;
    console.log("Verifying " + resolvedPkgName + "...");
    exec('npm list -g ' + resolvedPkgName + ' --depth=0', function(err, stdout, stderr) {
        console.log(stdout);
        if (stdout.indexOf("(empty)") !== -1) {
            console.log("Installing " + resolvedPkgName + "...");
            exec('npm install -g ' + resolvedPkgName, function(err, stdout, stderr) {
                console.log(stdout);
                if (link) {
                    exec('npm link ' + pkgName, function(err, stdout, stderr) {
                        console.log(stdout);
                    });
                }
            });
        }
        else {
            if (link) {
                exec('npm link ' + pkgName, function(err, stdout, stderr) {
                    console.log(stdout);
                });
            }
        }
    });
};


console.log("Verifying global node packages and installing missing ones...");
_verifyGlobalPackage('http-server', '0.8.x', /*link*/true);

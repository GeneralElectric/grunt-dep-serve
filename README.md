Grunt task 'depserve'
===============

### Introduction

This grunt task starts an instance of [http-server](https://github.com/nodeapps/http-server) properly configured to serve
local dependencies.

See also an alternate solution: https://github.com/PolymerLabs/polyserve


### Why do we need this?

Paths to a project's Bower dependencies differ depending on whether you are in the project itself vs. using the project
'downstream'. From the project repo, dependencies are in a Bower managed directory in the project, e.g. /bower_components.
When the project is consumed downstream, its dependencies are siblings of itself inside the consuming project's Bower
managed directory. We need dependency paths to resolve no matter if the project runs from its own repo or downstream as
part of another project.

Paths to dependencies should _assume dependency projects are siblings_ (assume the 'downstream' case) and thus have relative paths starting with `../`
to pop up into the bower directory and find the sibling dependencies. When running from the repo itself these paths will
404 since dependencies in that case are not siblings.  `grunt depserve` starts an instance of [http-server](https://github.com/nodeapps/http-server)
with the `--proxy` option set to retry potential 404s using the dependencies directory (e.g. /bower_components) as a root
so the paths resolve correctly. You can do something similar with most http servers.

#### Other options

Instead of using grunt-dep-serve, you could instead...

* Let dependencies 404 when running the project locally, and 're-declare' them with their correct paths from the local-run
perspective within all examples, demos and test fixtures in the project.
    * PRO: grunt-dep-serve not needed.
    * CON: Will still see 404s in console, though they can be ignored because you will...
    * CON: Need to re-declare all those paths in your demos and test fixture files.
* Assume your project _always_ has its dependencies outside as siblings by adding a `.bowerrc` file that maps dependencies
to `../`.
    * PRO: grunt-dep-serve not needed.
    * CON: Splatters dependencies as siblings _'above'_ the project, making it difficult to clean up and/or distinguish bower dependencies from actual project directories.
    * CON: Bower install might overwrite existing work in the `../` directory if it has the same name as a bower dependency

No matter what, _always_ make sure your project's demos/examples/fixtures work from within the project itself and declare
dependency paths such that the project works without assuming the name of the Bower-managed directory in any deployable
code...its 'bower_components' by default, but that configuration is up to the consuming application.

###Usage

Options:

* `depDir`: Path from project root to the Bower dependencies directory. Server will look in here before 404-ing on a request. Defaults to '/bower_components'.
* `open`: Page to automatically open upon server start. Defaults to '/'. Set to null to not open anything by default.

Include in package.json:

```
"devDependencies": {
    "grunt-dep-serve": "git+https://github.com/GeneralElectric/grunt-dep-serve.git#master",
}
```

Add to Gruntfile.js

```
grunt.loadNpmTasks('grunt-dep-serve');
```

Configure in Gruntfile.js if needed (or leave it out if just using default options), and run by typing `grunt depserve` on the command line.
Hit ctrl+c to exit.

```
depserve: {
    options: {
        open: '/test/ui/fixtures/my-fixture.html'
    }
}
```

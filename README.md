Grunt task 'depserve'
===============

### Introduction

This grunt task starts an instance of [http-server](https://github.com/nodeapps/http-server) properly configured to serve
local dependencies.


### Why do we need this?

Paths to a project's Bower dependencies differ depending on whether you are in the project itself (dependencies in a
Bower managed directory in the project, e.g. /bower_components) vs. using the project 'downstream' (dependencies are
siblings of the project). Ideally we want to be able to 'run' our project both on its own and downstream as a dependency
without a lot of magic.

For the 'downstream' case where all dependencies are siblings, we need relative paths to start with `../`,
which is the correct relative path for the 'downstream' case and doesn't hard code the name of the Bower managed
directory. For the case of developing in a given repo, we also need to specify `includePaths: ['bower_components/*']` in the
'sass' task to pin the relative root directory to one-level deep inside 'bower_components' and thus enable the project's `../`
paths to resolve when building the project itself.

Bower manages dependencies in a flat structure, so when consumed downstream a component can assume all its dependencies are flat siblings of it.
Making this assumption works great and means that it can be agnostic of the name of the directory used by bower to install dependencies
(defaults to 'bower_components' but can be configured by a developer).

However, when run locally as part of test fixtures or examples in the component's repo itself, however, the component's dependencies are not siblings.
For the purposes of running locally, then, this task copies external dependencies (from bower) and component html + css into a 'build-local'
directory so the component can be used in local tests, examples, etc.


###Usage

Options:

* `depDir`: Path from project root to the Bower dependencies directory. Server will look in here before 404-ing on a request. Defaults to '/bower_components'.
* `open`: Whether to open a browser tab upon server start automatically. Defaults to true.

Include in package.json:

```
"devDependencies": {
    "grunt-dep-serve": "git+https://github.sw.ge.com/jreichenberg/grunt-dep-serve.git#master",
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
        depDir: '/bower_components'
    }
}
```
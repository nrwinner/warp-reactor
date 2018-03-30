# Warp-Reactor

Warp-Reactor is a simple CLI (command-line interface) for generating react components based on the [angular-cli](https://github.com/angular/angular-cli) project.

# Installation
Install via npm
`npm install -g warp-reactor`

# Usage
Initialize warp-reactor in your react project.
`warp-reactor init`
|  option  |  action   |
|----------|----------|
|\-\-styles | Defines the file extension for the style file to be imported by the component: `warp-reactor init --styles scss`|
|\-\-path   | Defines the root directory of your components: `warp-reactor init --path ./src`|
Now you can begin generating components.
`warp-reactor generate component [component-name]`
Examples: 
`warp-reactor generate component test-component`
Running the `generate` command with a path for the name generates a new component at the specified path with the name of the last path element.

```
warp-reactor init --styles scss -\-path ./src
warp-reactor generate component test-directory/test-component
```
Generates test-component.js and test-component.scss to src/test-directory/test-component.

If you would like a component to not be generated in it's own directory, generate it with the `--nodir` flag
`warp-reactor generate component test-component --nodir`

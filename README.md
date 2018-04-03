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
|&#8209;&#8209;styles | Defines the file extension for the style file to be imported by the component: `warp-reactor init --styles scss`|
|&#8209;&#8209;path   | Defines the root directory of your components: `warp-reactor init --path src`|

### Generating Components
Now you can begin generating components.

`warp-reactor generate component [component-name]`

|  option  |  shorthand | action   |
|----------|----------|----------|
|&#8209;&#8209;extension | &#8209;e | Defines the file extension for the component file |
|&#8209;&#8209;styles | &#8209;s  | Specifies the style type and overrides the style attribute specified in reactor.json file |
| &#8209;&#8209;path | &#8209;p | Specifies the sub directory in which to generate. Appends to the end of the path specified in reactor.json |
| &#8209;&#8209;no&#8209;dir | | If set, the files will be generated without a parent directory |

##### Examples: 
`warp-reactor generate component test-component`
Running the `generate` command with a path for the name generates a new component at the specified path with the name of the last path element.

```
warp-reactor init --styles scss --path src
warp-reactor generate component test-directory/test-component
```
Generates _test-component.js_ and _test-component.scss_ to the *src/test-directory/test-component* directory.

If you would like a component to not be generated in it's own directory, generate it with the `--no-dir` flag

`warp-reactor generate component test-component --nodir`

### Create a new React app with warp-reactor
`warp-reactor new [app-name]`

|  option  |  action   |
|----------|----------|
|&#8209;&#8209;current&#8209;dir | Creates the new app in the current directory |
|&#8209;&#8209;skip&#8209;install   | Skips installing dependencies listed in the package.json |
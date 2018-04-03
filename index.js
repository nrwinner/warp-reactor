#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const builder = require('./project-builder');

// attempt to load config file
try {
    var config = JSON.parse(fs.readFileSync('reactor.json', 'utf-8'));
} catch (error) {
    // we couldn't find a reactor.json file
}

program.version('0.0.1').description('A simple generator CLI, intended to be used alongside create-react-app');

program
    .command('init')
    .description('Creates a reactor.json file in the current directory')
    .option('-s, --styles [styles]', 'When used with the \'init\' command, specifies the extension of style files, IE \'scss\'')
    .option('-p, --path [path]', 'When used with the \'init\' command, specfies the path to which all generate commands will write. You can append to this path later (with the --path option on the \'generate\' command, so it\'s wise set the path here to the root directory')
    .option('-e, --extension [extension]', 'Specifies the extension for component files')
    .action((cmd) => {
        fs.writeFileSync('reactor.json', `{\n    "extension": "${cmd.extension ? cmd.extension : 'js'}",\n    "path": "${cmd.path ? './' + cmd.path : './'}",\n    "styles": "${cmd.styles ? cmd.styles : 'css'}"\n}`, 'utf-8', (err) => {
            if (err) {
                console.log('Error creating reactor.json!');
            }
        })
    });
    
    program
    .command('generate <type> <name>')
    .description('Generates a react [component] into the specified directory')
    .option('-e, --extension [extension]', 'Specifies an extension to be used in favor of the default listed in reactor.json')
    .option('-s, --styles [styles]', 'When used with the \'generate\' command, specifies the style type and overrides the style attribute specified in reactor.json file')
    .option('-p, --path [path]', 'When used with the \'generate\' command, specifies the sub directory in which to generate. Appends to the end of the path specified in reactor.json')
    .option('--no-dir', 'If set, the files will be generated without a parent directory')
    .action((type, name, cmd) => {
        if (!config) {
            console.log('You must run warp-reactor init first!');
            return;
        }

        if (type === 'component') {
            let p = cmd.path ? config.path + '/' + cmd.path : config.path;
            generateComponent(name, cmd.styles, p, !cmd.dir, cmd.extension);
        } else {
            console.log('Type ' + type + ' is not a valid type!');
            return;
        }
    });

program
    .command('new <name>')
    .alias('n')
    .description('Scaffolds a new React app with a reactor.json config')
    .option('-c, --current-dir', 'Scaffold project in the current directory')
    .option('-s, --skip-install', 'Skip installing packages.')
    .action((name, options) => {
      const dir = `./${name}`
      builder.cloneStarter(dir, options.currentDir)
      options.skipInstall ? console.log("You've opted out of installing dependencies.") : builder.installDependencies(name)
    })

program.parse(process.argv)

function generateComponent(name, styles = config.styles, path = config.path, nodir=false, extension = config.extension) {
    if (!config) {
        console.log('You must run warp-reactor init first!');
        return;
    }

    let componentName = name.split('/');
    componentName = componentName[componentName.length - 1];
    componentName = componentName.charAt(0).toUpperCase() + componentName.substring(1);

    // generate a styles file and then generate a JS file that imports it
    makeFile(name, styles, path, '', nodir);

    // now generate a react component
    makeFile(name, extension, path, `import React, { Component } from 'react';\nimport './${name + '.' + styles}';\n\nexport default class ${componentName} extends Component {\n    render() {\n        return;\n    }\n}`, nodir);
}

function makeFile(name, extension, path = config.path, content = '', nodir = false) {

    path += '/' + name;
    if (!nodir) {
        path += '/' + name;
    }

    path = path.replace(/\/{2,}/g, '/') + '.' + extension;

    console.log('Generating ' + path);

    makeDirsFromPath(path);

    // now write the file
    fs.writeFile(path, content, 'utf-8', (err) => {
        if (err) {
            console.log('Error generating ' + name + '.' + extension + ' to ' + path);
            console.log(err);
        }
    });
}

function makeDirsFromPath(path) {
    let dirs = path.split('/');
    let workingPath = './';

    for (let i = 0; i < dirs.length; i++) {
        if (dirs[i] !== '.' && dirs[i].indexOf('.') === -1) {
            // this isn't the current directory and it's not a file
            if ((!fs.existsSync(workingPath + dirs[i])) || !fs.statSync(workingPath + dirs[i]).isDirectory()) {
                try {
                    console.log('Creating ' + workingPath + dirs[i]);
                    fs.mkdirSync(workingPath + dirs[i]);
                } catch (error) {
                    console.log('Error creating directory at ' + workingPath + '/' + dirs[i]);
                }
            }
            workingPath += dirs[i] + '/';
        }
    }
}
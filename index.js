#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');

// attempt to load config file
try {
    var config = JSON.parse(fs.readFileSync('rgen.json', 'utf-8'));
} catch (error) {
    // we couldn't find a rgen.json file
}

program.version('0.0.1').description('A simple generator CLI, intended to be used alongside create-react-app');

program
    .command('init')
    .description('Creates a rgen.json file in the current directory')
    .option('-s, --styles [styles]', 'When used with the \'init\' command, specifies the extension of style files, IE \'scss\'')
    .option('-p, --path [path]', 'When used with the \'init\' command, specfies the path to which all generate commands will write. You can append to this path later (with the --path option on the \'generate\' command, so it\'s wise set the path here to the root directory')
    .action((cmd) => {
        fs.writeFileSync('rgen.json', `{\n    "path": "${cmd.path ? './' + cmd.path : './'}",\n    "styles": "${cmd.styles ? cmd.styles : 'css'}"\n}`, 'utf-8', (err) => {
            if (err) {
                console.log('Error creating rgen.config file!');
            }
        })
    });
    
    program
    .command('generate <type> <name>')
    .description('Generates a react [component] into the specified directory')
    .option('-s, --styles [styles]', 'When used with the \'generate\' command, specifies the style type and overrides the style attribute specified in rgen.json file')
    .option('-p, --path [path]', 'When used with the \'generate\' command, specifies the sub directory in which to generate. Appends to the end of the path specified in rgen.json')
    .option('--no-dir', 'If set, the files will be generated without a parent directory')
    .action((type, name, cmd) => {
        if (!config) {
            console.log('You must run rgen init first!');
            return;
        }

        if (type === 'component') {
            let p = cmd.path ? config.path + '/' + cmd.path : config.path;
            generateComponent(name, cmd.styles, p, !cmd.dir);
        } else {
            console.log('Type ' + type + ' is not a valid type!');
            return;
        }
    });

program.parse(process.argv)

function generateComponent(name, styles = config.styles, path = config.path, nodir=false) {
    if (!config) {
        console.log('You must run rgen init first!');
        return;
    }
    // generate a styles file and then generate a JS file that imports it
    makeFile(name, styles, path, '', nodir);

    // now generate a react component
    makeFile(name, 'js', path, `import React, { Component } from 'react';\nimport './${name + '.' + styles}';\n\nexport default class ${name} extends Component {\n    render() {\n        return;\n    }\n}`, nodir);
}

function makeFile(name, extension, path = config.path, content = '', nodir = false) {
    console.log('Generating ' + name + '.' + extension + ' to ' + (nodir ? path : path + '/' + name));
    path = (config.path !== config.path ? config.path : '') + (path.charAt(path.length - 1) === '/' ? path.substring(0, path.length - 1) : path);
    if (!nodir) path += '/' + name;
    path = path.replace(/\/{2,}/g, '/');

    makeDirsFromPath(path);

    // now write the file
    fs.writeFile(path + '/' + name + '.' + extension, content, 'utf-8', (err) => {
        if (err) {
            console.log('Error generating ' + name + '.' + extension + ' to ' + path);
            console.log(err);
        }
    });
}

function makeDirsFromPath(path) {
    let dirs = path.split('/');
    let workingPath = './';

    console.log('starting, path: ', path);

    for (let i = 0; i < dirs.length; i++) {
        if (dirs[i] !== '.' && dirs[i].indexOf('.') === -1) {
            // this isn't the current directory and it's not a file
            if ((!fs.existsSync(workingPath + dirs[i])) || !fs.statSync(workingPath + dirs[i]).isDirectory()) {
                try {
                    console.log('creating ' + workingPath + dirs[i]);
                    fs.mkdirSync(workingPath + dirs[i]);
                } catch (error) {
                    console.log('Error creating directory at ' + workingPath + '/' + dirs[i]);
                }
            }
            workingPath += dirs[i] + '/';
        }
    }
}
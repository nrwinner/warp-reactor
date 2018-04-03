const shell = require('shelljs')

function cloneStarter(dir, cloneToCurrent) {
  if(!shell.which('git')) {
    shell.echo('Uh oh, looks like you don\'t have git installed!!')
    shell.exit(1)
  }
  if (cloneToCurrent) {
    shell.exec(`git clone https://github.com/DonSeannelly/react-parcel.git . && git remote remove origin`)
  } else {
    shell.exec(`git clone https://github.com/DonSeannelly/react-parcel.git ${dir} && cd ${dir} && git remote remove origin`)
  }
}
  
function installDependencies(appname) {
  shell.cd(`${appname}`)
  if(!shell.which('npm')) {
    // TODO: Add detailed message with how to resolve
    shell.echo('npm must be installed!')
    shell.exit(1);
  }
  shell.exec('npm i')
}

module.exports = { cloneStarter, installDependencies }
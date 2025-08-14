const { execSync } = require('child_process');

function runCommand(cmd) {
  console.log(`\x1b[36m[CMD]\x1b[0m ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function gitCloneOrPull(repo, branch, targetDir) {
  const fs = require('fs');
  if (!fs.existsSync(targetDir)) {
    runCommand(`git clone -b ${branch} ${repo} ${targetDir}`);
  } else {
    runCommand(`cd ${targetDir} && git pull origin ${branch}`);
  }
}

function gitCommitAndPush(dir, message) {
  runCommand(`cd ${dir} && git add . && git commit -m "${message}" && git push`);
}

module.exports = { runCommand, gitCloneOrPull, gitCommitAndPush };

const { spawn } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

function ensureLogDir() {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  return logDir;
}

function runCommandSilent(cmd, args, cwd, logFileName) {
  return new Promise((resolve, reject) => {
    const logDir = ensureLogDir();
    const logFilePath = path.join(logDir, logFileName);
    fs.writeFileSync(logFilePath, ''); // reset log

    const child = spawn(cmd, args, { cwd});

    child.stdout.on('data', data => fs.appendFileSync(logFilePath, data));
    child.stderr.on('data', data => fs.appendFileSync(logFilePath, data));

    child.on('close', code => {
      if (code === 0) {
        resolve(logFilePath);
      } else {
        reject({ code, logFilePath, cmd: `${cmd} ${args.join(' ')}` });
      }
    });
  });
}

function gitCloneOrPull(repo, branch, targetDir) {
  if (fs.existsSync(targetDir)) {
    return runCommandSilent('git', ['pull', 'origin', branch], targetDir, 'git.log');
  }
  return runCommandSilent('git', ['clone', '-b', branch, repo, targetDir], process.cwd(), 'git.log');
}

function gitCommitAndPush(dir, message) {
    const safeMessage = message.replace(/'/g, "'\\''"); // escape dấu nháy đơn

  return runCommandSilent('git', ['add', '.'], dir, 'git.log')
    .then(() => runCommandSilent('git', ['commit', '-m', safeMessage], dir, 'git.log'))
    .then(() => runCommandSilent('git', ['push'], dir, 'git.log'));
}

module.exports = { runCommandSilent, gitCloneOrPull, gitCommitAndPush };

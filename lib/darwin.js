const { spawn } = require('child_process');
const { captureOutput, getError, parseInfo } = require('./util');

let timer;
let pacUrl;

function getCommandValues(cmd, args) {
  const proc = spawn(cmd, args, {
    cwd: undefined,
    env: process.env,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const output = captureOutput(proc);

  return new Promise((resolve, reject) => {
    proc.on('close', (code) => {
      if (code !== 0 && code !== 4) {
        return reject(getError(`${cmd} ${args}`, code, output));
      }

      resolve(parseInfo(output.stdout));
    });

    proc.on('error', reject);
  });
}

const loadPacUrl = (init) => {
  clearTimeout(timer);
  const result = getCommandValues('networksetup', ['-getautoproxyurl', 'Wi-Fi'])
    .then((values) => {
      return values.URL ? values :
        getCommandValues('networksetup', ['-getautoproxyurl', 'Ethernet']);
    }).then((values) => {
      pacUrl = Promise.resolve(values.URL === '(null)' ? null : values.URL);
      timer = setTimeout(loadPacUrl, 10000);
      return pacUrl;
    }, (err) => {
      if (init) {
        pacUrl = null;
      }
      timer = setTimeout(loadPacUrl, 1000);
      throw err;
    });
  pacUrl = pacUrl || result;
  return result;
};

module.exports = () => {
  pacUrl = pacUrl || loadPacUrl();
  return pacUrl;
};

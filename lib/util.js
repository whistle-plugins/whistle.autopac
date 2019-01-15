const util = require('util');

function captureOutput(child) {
  const output = {
    stdout: '',
    stderr: '',
  };

  child.stdout.on('data', (data) => {
    output.stdout += data.toString();
  });
  child.stderr.on('data', (data) => {
    output.stderr += data.toString();
  });

  return output;
}

function getError(command, code, output) {
  const stdout = output.stdout.trim();
  const stderr = output.stderr.trim();
  const err = new Error(util.format(
    '%s command exited with code %d:\n%s\n%s',
    command, code, stdout, stderr
  ));
  err.code = code;
  return err;
}

function parseInfo(data) {
  return data
    .split('\n')
    .map(i => i.split(': '))
    .reduce((info, item) => {
      if (item.length < 2) { return info; }
      const [key, value] = item.map(i => i.trim().replace(/\s+/g, '-'));
      info[key] = value;
      return info;
    }, {});
}

module.exports = {
  captureOutput,
  getError,
  parseInfo,
};

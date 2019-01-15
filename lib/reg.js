const path = require('path');
const { spawn } = require('child_process');
const { captureOutput, getError } = require('./util');

const ITEM_PATTERN =
  /^(.*)\s(REG_SZ|REG_MULTI_SZ|REG_EXPAND_SZ|REG_DWORD|REG_QWORD|REG_BINARY|REG_NONE)\s+([^\s].*)$/;

function getRegExePath() {
  if (process.platform === 'win32') {
    return path.join(process.env.windir, 'system32', 'reg.exe');
  }
  return 'REG';
}

module.exports = (regPath) => {
  const args = ['QUERY', regPath,
    `/reg:${process.arch === 'x64' ? '64' : '32'}`,
  ];
  const proc = spawn(getRegExePath(), args, {
    cwd: undefined,
    env: process.env,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let buffer = '';
  const output = captureOutput(proc);
  proc.stdout.on('data', (data) => {
    buffer += data.toString();
  });

  return new Promise((resolve, reject) => {
    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(getError('QUERY', code, output));
      }
      const items = [];
      const result = [];
      const lines = buffer.split('\n');
      let lineNumber = 0;

      for (let i = 0, l = lines.length; i < l; i++) {
        const line = lines[i].trim();
        if (line.length > 0) {
          if (lineNumber !== 0) {
            items.push(line);
          }
          ++lineNumber;
        }
      }

      for (let i = 0, l = items.length; i < l; i++) {
        const match = ITEM_PATTERN.exec(items[i]);
        if (match) {
          result.push({
            name: match[1].trim(),
            type: match[2].trim(),
            value: match[3],
          });
        }
      }
      resolve(result);
    });
    proc.on('error', reject);
  });
};

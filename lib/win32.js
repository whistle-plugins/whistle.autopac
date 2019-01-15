
const getRegValues = require('./reg');

const PAC_RE = /(https?:\/\/[\x20-\x7e]+)/g;
const PAC_SUFFIX = /\.pac(?:\?|$)/i;
const SETTINGS_PATH = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Connections';
const SETTINGS_KEY = 'DefaultConnectionSettings';
let timer;
let pacUrl;

const toString = (value) => {
  const result = [];
  for (let i = 0, len = value.length; i < len;) {
    const code = parseInt(value.substring(i, i += 2), 16);
    result.push(String.fromCharCode(code));
  }
  return result.join('');
};
const parsePacUrl = (value) => {
  value = toString(value).match(PAC_RE);
  if (!value) {
    return '';
  }
  const len = value.length;
  for (let i = 0; i < len; i++) {
    const url = value[i];
    if (PAC_SUFFIX.test(url)) {
      return url;
    }
  }
  return value[len - 1];
};

const loadPacUrl = (init) => {
  clearTimeout(timer);
  const result = getRegValues(SETTINGS_PATH).then((list) => {
    const { value } = list.find(item => item.name === SETTINGS_KEY);
    pacUrl = result;
    timer = setTimeout(loadPacUrl, 10000);
    return parsePacUrl(value);
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
  pacUrl = pacUrl || loadPacUrl(true);
  return pacUrl;
};

const getPacUrl = process.platform === 'win32' ? require('./win32') : require('./darwin');

const noop = () => {};

module.exports = (server) => {
  server.on('request', (req, res) => {
    req.on('error', noop);
    res.on('error', noop);
    getPacUrl().then((url) => {
      res.end(url ? `/./ pac://${url}` : '');
    }, () => res.end());
  });
};

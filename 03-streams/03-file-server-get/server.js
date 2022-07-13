const http = require('http');
const path = require('path');
const fs = require('node:fs');

const server = new http.Server();

const hasSubDir = (path) => {
  return path.includes('/');
};

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);


  switch (req.method) {
    case 'GET':
      if (hasSubDir(pathname)) {
        res.statusCode = 400;
        res.end('Bad Request');
        break;
      }

      const stream = fs.createReadStream(filepath);

      stream.pipe(res);

      stream.on('error', (err) => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File Not Found');
        } else {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      });
      req.on('aborted', () => {
        stream.destroy();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

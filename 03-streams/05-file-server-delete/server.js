const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const hasSubDir = (slug) => {
  return slug.includes('/');
};

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (hasSubDir(pathname)) {
        res.statusCode = 400;
        res.end('Bad Request');
        break;
      }

      fs.access(filepath, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File does not exist');
          } else {
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        } else {
          fs.rm(filepath, (err) => {
            if (err) {
              res.statusCode = 500;
              res.end('Internal Server Error');
            } else {
              res.statusCode = 200;
              res.end('Ok');
            }
          });
        }
      });


      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

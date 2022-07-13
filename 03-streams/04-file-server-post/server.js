const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const hasSubDir = (slug) => {
  return slug.includes('/');
};


server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (hasSubDir(pathname)) {
        res.statusCode = 400;
        res.end('Bad Request');
        break;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File Already exists');
        break;
      }

      const limitSizeStreamTransform = new LimitSizeStream({limit: 1048576});
      const fileWriteStream = fs.createWriteStream(filepath);
      req.pipe(limitSizeStreamTransform).pipe(fileWriteStream);

      limitSizeStreamTransform.on('error', () => {
        fileWriteStream.destroy();
        fs.rmSync(filepath);
        res.statusCode = 413;
        res.end('Payload Too Large');
      });
      fileWriteStream
          .on('error', () => {
            fileWriteStream.destroy();
            res.statusCode = 500;
            res.end('Internal Server Error');
          })
          .on('finish', () => {
            res.statusCode = 201;
            res.end('Created');
          });
      req.on('aborted', () => {
        fileWriteStream.destroy();
        fs.rmSync(filepath);
      });


      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

const express = require('express');
const app = express();
// const port = 3001;
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const interactionsPath = process.argv[2];
const port = process.argv[3];
const interactions = require(interactionsPath);

function sortInteractionByPath(ints) {
  const sorted = {};
  Object.values(ints).forEach(int => {
    // console.log('int')
    // console.log(int)
    sorted[int.withRequest.path] === undefined ? sorted[int.withRequest.path] = [int] : sorted[int.withRequest.path].push(int)
  })
  return sorted;
}

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode < 400
  }
}))

// log all requests to access.log
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
}))

const sortedInteractions = sortInteractionByPath(interactions);

Object.entries(sortedInteractions).forEach(int => {

  function createEndpoints(path, interactions) {
    app.all(path, function (req, res, next) {

      function sendResponseToMatchingInteraction(int) {
        /*
        _parsedUrl: {
        protocol: null,
        slashes: null,
        auth: null,
        host: null,
        port: null,
        hostname: null,
        hash: null,
        search: '?q=b',
        query: 'q=b',
        pathname: '/path',
        path: '/path?q=b',
        href: '/path?q=b',
        _raw: '/path?q=b' }
      */

        function headersMatch(int, req) {
          if (int.withRequest.headers === undefined) {
            return true;
          }
          const matchingHeaderFields = Object.entries(int.withRequest.headers).map((intHeaderField) => {
            return req.headers.hasOwnProperty(intHeaderField[0].toLowerCase()) &&
              req.headers[intHeaderField[0].toLowerCase()] === intHeaderField[1];
          });
          return matchingHeaderFields.every(match => match);
        }

        if (
          (int.withRequest.query === req._parsedUrl.query || (int.withRequest.query === undefined && req._parsedUrl.query === null)) &&
          int.withRequest.method === req.method &&
          headersMatch(int, req)
        ) {
          console.log('first case');
          res
            .status(int.willRespondWith.status)
            .set({
              ...int.willRespondWith.headers
            })
            .set('etag', false)
            .set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
            .send(int.willRespondWith.body)
            .end();
          next();
        } else {
          console.log('second case');
          // res
          //   .status(404)
          //   .send('received request does not match any interaction')
          //   .end()
          next();
        }
        // res.end();
      }

      const intsArr = Object.keys(interactions).map(key => {
        return interactions[key];
      });

      intsArr.forEach(sendResponseToMatchingInteraction)
    });
  }

  createEndpoints(int[0], int[1]);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
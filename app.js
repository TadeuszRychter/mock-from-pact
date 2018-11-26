const express = require('express');
const app = express();
// const port = 3001;
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const createEndpoints = require('./createEndpoints')

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

Object.entries(sortedInteractions).forEach(([path, interactions]) => {
  createEndpoints(path, interactions, app);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

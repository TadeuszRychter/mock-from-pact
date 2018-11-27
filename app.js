const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const createEndpoints = require('./createEndpoints');
const fs = require('fs');
const path = require('path');
const interactionsPath = process.argv[2];
const port = process.argv[3];
const interactions = require(interactionsPath);

function sortInteractionByPath(ints) {
  const sorted = {};
  Object.values(ints).forEach(int => {
    sorted[int.withRequest.path] === undefined ? sorted[int.withRequest.path] = [int] : sorted[int.withRequest.path].push(int)
  })
  return sorted;
}

app.use(cors());

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

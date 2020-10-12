const express = require('express');
const sendNotFound = require('./notFound');

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

const matchBody = (intBody, reqBody) => JSON.stringify(intBody) == reqBody;

const matchInteraction = (req, interactions) =>
    Object.values(interactions).find(
        int =>
                (int.withRequest.query === req._parsedUrl.query || (int.withRequest.query === undefined && req._parsedUrl.query === null)) &&
                int.withRequest.method === req.method &&
                (headersMatch(int, req) || int.skipHeaders) &&
                (int.skipBody ? true : req.body ? matchBody(int.withRequest.body, req.body) : true)
    );

const sendResponse = (int, res, next) => {
    res
        .status(int.willRespondWith.status)
        .set({
            ...int.willRespondWith.headers
        })
        .set('etag', false)
        .set('Cache-Control', 'no-cache, must-revalidate, private')
        .send(int.willRespondWith.body)
        .end();
    next();
};

module.exports = (path, interactions, app) => app.all(
    path,
    (req, res, next) => {
        var data='';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
            data += chunk;
        });

        req.on('end', function() {
            req.body = data;
            const matchedInteraction = matchInteraction(req, interactions);
            matchedInteraction
                ? sendResponse(matchedInteraction, res, next)
                : sendNotFound(path, interactions, req, res, next)
        });
    }
);

const stringify = require('./stringify')

module.exports = (path, interactions, req, res, next) => {
    res
        .status(404)
        .send(`
            For path ${path} there are ${interactions.length} interactions.
            But none of them was matched unfortunately.
            Request received:
             query: ${stringify(req._parsedUrl.query)}
             headers:${stringify(req.headers)}
             method: ${stringify(req.method)}
            Example of valid request: ${stringify(interactions[0])}
        `)
        .end();
    next();
};

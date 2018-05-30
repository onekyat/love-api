const restify = require('restify');
const mongo = require('./modules/mongo');
const postLove = require('./modules/post-love');
const getLovesByUserId = require('./modules/get-loves-by-user-id');
 
const server = restify.createServer({
  formatters: {
    'application/json': (req, res, body) => {
      if (res.statusCode === 400) {
        const { code, message } = body;
        console.log(req.path(), message);
        return JSON.stringify({
          status: 400,
          code,
          message
        });
      } else if (res.statusCode === 500) {
        const message = `${(body.message) ? body.message : body} (${JSON.stringify(req.params)})`;
        console.log(req.path(), message);
        return JSON.stringify({
          status: 500,
          message
        });
      } else {
        if (req.path() !== '/health') {
          console.log(req.path(), body);
        }
        return JSON.stringify({
          status: 200,
          message: 'ok',
          result: body
        });
      }
    }
  }
});

server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.bodyParser({ mapParams: true }));

server.get('/health', (req, res, next) => {
  res.send('ok');
});
server.post('/', postLove);
server.get('/users/:userId', getLovesByUserId);
 
server.listen(process.env.PORT, () => {
  console.log('%s listening at %s', server.name, server.url);
});

mongo.connect().then(() => {
  console.log('Connected to MongoDB.');
}).catch((err) => {
  console.error(err);
});

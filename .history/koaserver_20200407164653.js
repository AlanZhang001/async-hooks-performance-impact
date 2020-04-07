const host = 'localhost';
const port = 8765;

const koa = require('koa');

const app = new koa();

app.use(async ctx => {
  ctx.body = 'Hello World!';
});
app.listen(port);

const autocannon = require('autocannon');

autocannon({
    url: `http://${host}:${port}`,
    connections: 100, //default 10
}, (error, results) => {
  console.log(`koaserver: ${results.requests.mean} reqs.`);
  process.exit();
})

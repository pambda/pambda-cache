const test = require('tape');
const { cache } = require('..');

test('test', t => {
  t.plan(4);

  const pambda = cache();

  let statusCode = 200;

  const lambda = pambda((event, next, callback) => {
    callback(null, {
      statusCode,
    });

    statusCode = 404;
  });

  lambda({ httpMethod: 'GET', path: '/' }, {}, (err, data) => {
    t.error(err);
    t.equal(data.statusCode, 200);

    process.nextTick(() => {
      lambda({ httpMethod: 'GET', path: '/' }, {}, (err, data) => {
        t.error(err);
        t.equal(data.statusCode, 200);
      });
    });
  });
});

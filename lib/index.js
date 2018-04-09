const { callbackify } = require('lambda-callbackify');

const cache = (root = '/', options) => {
  const cachedData = Object.create(null);

  return next => {
    next = callbackify(next);

    return (event, context, callback) => {
      const { httpMethod } = event;

      if (httpMethod !== 'GET' && httpMethod !== 'HEAD') {
        return next(event, context, callback);
      }

      const { path } = event;

      if (!path.startsWith(root)) {
        return next(event, context, callback);
      }

      const data = cachedData[path];

      if (data) {
        return callback(null, data);
      }

      next(event, context, (err, data) => {
        if (err) {
          return callback(err);
        }

        if (data.statusCode === 200) {
          cachedData[path] = data;
        }

        callback(null, data);
      });
    };
  };
};

/*
 * Exports.
 */
exports.cache = cache;

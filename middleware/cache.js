const NodeCache = require("node-cache");

// stdTTL: default time-to-live in seconds (5 minutes)
// checkperiod: automatic delete check interval (10 minutes)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

/**
 * Middleware factory: returns middleware that caches GET responses.
 * @param {number} ttl - Time to live in seconds (optional, defaults to stdTTL)
 */
function cacheMiddleware(ttl) {
  return (req, res, next) => {
    if (req.method !== "GET") return next();

    const key = `__cache__${req.originalUrl}`;
    const cached = cache.get(key);

    if (cached) {
      return res.status(200).json(cached);
    }

    // Intercept res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 200) {
        cache.set(key, body, ttl);
      }
      return originalJson(body);
    };

    next();
  };
}

/**
 * Invalidate cache entries matching a prefix pattern.
 * Useful after POST/PUT/DELETE to clear related cache.
 */
function invalidateCache(pattern) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const keys = cache.keys();
        keys.forEach((key) => {
          if (key.includes(pattern)) {
            cache.del(key);
          }
        });
      }
      return originalJson(body);
    };
    next();
  };
}

module.exports = { cache, cacheMiddleware, invalidateCache };

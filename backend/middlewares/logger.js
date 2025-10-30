import logger from "../config/logger.js";

export const apiLogger = (req, res, next) => {
  const start = Date.now();

  logger.info("Incoming API Request", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
    body: req.method !== "GET" ? req.body : undefined,
    query: req.query,
    params: req.params,
  });

  const originalEnd = res.end;
  res.end = function (chunk, encoding) {
    const duration = Date.now() - start;

    logger.info("API Response", {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString(),
      responseSize: chunk ? chunk.length : 0,
    });

    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms - ${
        req.ip || req.connection.remoteAddress
      }`
    );

    originalEnd.call(this, chunk, encoding);
  };

  next();
};

export const errorLogger = (err, req, res, next) => {
  logger.error("API Error", {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
    body: req.body,
    query: req.query,
    params: req.params,
  });

  next(err);
};

export const authLogger = (action, userId, details = {}) => {
  logger.info("Authentication Event", {
    action,
    userId,
    details,
    timestamp: new Date().toISOString(),
  });
};

export const securityLogger = (event, details = {}) => {
  logger.warn("Security Event", {
    event,
    details,
    timestamp: new Date().toISOString(),
  });
};

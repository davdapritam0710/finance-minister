import logger from "../config/logger.js";

// API request logging middleware
export const apiLogger = (req, res, next) => {
  const start = Date.now();

  // Log incoming request
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

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (chunk, encoding) {
    const duration = Date.now() - start;

    // Log response
    logger.info("API Response", {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString(),
      responseSize: chunk ? chunk.length : 0,
    });

    // Log HTTP level for Morgan-style logging
    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms - ${
        req.ip || req.connection.remoteAddress
      }`
    );

    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Error logging middleware
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

// Database operation logging
export const dbLogger = (operation, collection, data = {}) => {
  logger.info("Database Operation", {
    operation,
    collection,
    data: JSON.stringify(data),
    timestamp: new Date().toISOString(),
  });
};

// Authentication logging
export const authLogger = (action, userId, details = {}) => {
  logger.info("Authentication Event", {
    action,
    userId,
    details,
    timestamp: new Date().toISOString(),
  });
};

// Security event logging
export const securityLogger = (event, details = {}) => {
  logger.warn("Security Event", {
    event,
    details,
    timestamp: new Date().toISOString(),
  });
};

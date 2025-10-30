import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: "Too many password reset attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 50
});

const securityHeaders = (req, res, next) => {
  res.removeHeader("X-Powered-By");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  next();
};

const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    if (typeof obj === "string") {
      return obj
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    }
    if (typeof obj === "object" && obj !== null) {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  next();
};

const ipWhitelist = (allowedIPs = ["192.168.1.100"]) => {
  return (req, res, next) => {
    if (allowedIPs.length === 0) {
      return next();
    }

    const clientIP = req.ip || req.connection.remoteAddress;

    if (allowedIPs.includes(clientIP)) {
      return next();
    }

    res.status(403).json({
      success: false,
      message: "Access denied from this IP address",
    });
  };
};

const requestSizeLimiter = (maxSize = "10mb") => {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers["content-length"] || "0");
    const maxSizeBytes = parseInt(maxSize) * 1024 * 1024;

    if (contentLength > maxSizeBytes) {
      return res.status(413).json({
        success: false,
        message: "Request entity too large",
      });
    }

    next();
  };
};

export {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  speedLimiter,
  securityHeaders,
  sanitizeInput,
  ipWhitelist,
  requestSizeLimiter,
};

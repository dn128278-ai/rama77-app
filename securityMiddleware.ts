import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// ------------------ ENVIRONMENT & CONFIGURATION ------------------
export const JWT_SECRET =
  process.env.JWT_SECRET || 'rama77-super-secret-jwt-key-2026-production-secured';

export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin@rama77.com',
  password: process.env.ADMIN_PASSWORD || 'rama77admin@2026',
};

// ------------------ RATE LIMITING ENGINE ------------------
interface RateLimitRecord {
  timestamps: number[];
}

export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  keyPrefix?: string;
}) {
  const store = new Map<string, RateLimitRecord>();
  const prefix = options.keyPrefix || 'rl';

  // Periodic cleanup every 2 minutes to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < options.windowMs);
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 120000);

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown-client';
    const key = `${prefix}:${clientIp}`;
    const now = Date.now();

    let record = store.get(key);
    if (!record) {
      record = { timestamps: [] };
      store.set(key, record);
    }

    // Filter out expired timestamps
    record.timestamps = record.timestamps.filter((t) => now - t < options.windowMs);

    const remaining = Math.max(0, options.max - record.timestamps.length);
    const resetTime = Math.ceil(
      (record.timestamps.length > 0 ? record.timestamps[0] + options.windowMs : now + options.windowMs) / 1000
    );

    res.setHeader('X-RateLimit-Limit', options.max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTime);

    if (record.timestamps.length >= options.max) {
      const retryAfterSec = Math.ceil((record.timestamps[0] + options.windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message:
          options.message ||
          `Too many requests from this IP. Please wait ${retryAfterSec} seconds before retrying.`,
        retryAfter: retryAfterSec,
        timestamp: new Date().toISOString(),
      });
    }

    record.timestamps.push(now);
    next();
  };
}

// Pre-configured rate limiters
export const globalApiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 120,
  message: 'API rate limit exceeded. Please slow down your requests.',
  keyPrefix: 'global',
});

export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 15,
  message: 'Too many authentication attempts. Please wait 1 minute before retrying.',
  keyPrefix: 'auth',
});

export const adminActionRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Admin action rate limit reached. Please wait before executing more updates.',
  keyPrefix: 'admin',
});

export const biddingRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 40,
  message: 'Bidding frequency limit exceeded. Please wait a few seconds before placing next bid.',
  keyPrefix: 'bids',
});

// ------------------ ANTI-SQL INJECTION MIDDLEWARE ------------------
// High-confidence SQL injection pattern matcher (avoids false positives on natural words while catching attack vectors)
const SQL_INJECTION_PATTERNS = [
  /(\bUNION\s+(ALL\s+)?SELECT\b)/i,
  /(\bSELECT\s+[\s\S]+?\s+FROM\b)/i,
  /(\bINSERT\s+INTO\b)/i,
  /(\bDELETE\s+FROM\b)/i,
  /(\bDROP\s+(TABLE|DATABASE|VIEW|INDEX)\b)/i,
  /(\bALTER\s+(TABLE|DATABASE)\b)/i,
  /(\bUPDATE\s+[\s\S]+?\s+SET\b)/i,
  /(\b(EXEC|EXECUTE)\s*\(|\bSLEEP\s*\(\s*\d+\s*\)|\bBENCHMARK\s*\()/i,
  /(\bINFORMATION_SCHEMA\b)/i,
  /(--\s*|\/\*[\s\S]*?\*\/)/,
  /(;\s*(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\b)/i,
  /('\s*OR\s*'\d+'\s*=\s*'\d+|"\s*OR\s*"\d+"\s*=\s*"\d+)/i,
  /('\s*OR\s*'[a-zA-Z0-9_]+'\s*=\s*'[a-zA-Z0-9_]+|"\s*OR\s*"[a-zA-Z0-9_]+"\s*=\s*"[a-zA-Z0-9_]+)/i,
  /('\s*OR\s*1\s*=\s*1|"\s*OR\s*1\s*=\s*1)/i,
  /('\s*AND\s*1\s*=\s*1|"\s*AND\s*1\s*=\s*1)/i,
];

function containsSqlInjection(value: any): boolean {
  if (typeof value === 'string') {
    return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
  } else if (Array.isArray(value)) {
    return value.some(containsSqlInjection);
  } else if (typeof value === 'object' && value !== null) {
    return Object.values(value).some(containsSqlInjection);
  }
  return false;
}

export function antiSqlInjection(req: Request, res: Response, next: NextFunction) {
  if (
    containsSqlInjection(req.body) ||
    containsSqlInjection(req.query) ||
    containsSqlInjection(req.params)
  ) {
    console.warn(
      `[SECURITY_ALERT] Potential SQL Injection blocked from IP: ${req.ip} on path: ${req.path}`
    );
    return res.status(400).json({
      success: false,
      error: 'SQL_INJECTION_BLOCKED',
      message:
        'Malicious characters or unauthorized SQL commands detected. Request blocked by Security Firewall.',
      timestamp: new Date().toISOString(),
    });
  }
  next();
}

// ------------------ ANTI-XSS & HTML SANITIZATION ------------------
const XSS_ATTACK_PATTERN =
  /(<script[\s\S]*?>[\s\S]*?<\/script>|javascript:|data:text\/html|vbscript:|onload\s*=|onerror\s*=|onclick\s*=|onmouseover\s*=|eval\(|expression\(|<iframe|<object|<embed)/i;

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeRecursive(obj: any): any {
  if (typeof obj === 'string') {
    return escapeHtml(obj.trim());
  } else if (Array.isArray(obj)) {
    return obj.map(sanitizeRecursive);
  } else if (typeof obj === 'object' && obj !== null) {
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      cleaned[key] = sanitizeRecursive(val);
    }
    return cleaned;
  }
  return obj;
}

export function antiXssSanitizer(req: Request, res: Response, next: NextFunction) {
  // Check for blatant script injection attempt
  const bodyString = JSON.stringify(req.body || {});
  const queryString = JSON.stringify(req.query || {});
  if (XSS_ATTACK_PATTERN.test(bodyString) || XSS_ATTACK_PATTERN.test(queryString)) {
    console.warn(`[SECURITY_ALERT] XSS payload blocked from IP: ${req.ip} on path: ${req.path}`);
    return res.status(400).json({
      success: false,
      error: 'XSS_ATTACK_BLOCKED',
      message:
        'Cross-Site Scripting (XSS) payload detected in request body. Disallowed HTML/scripts blocked.',
      timestamp: new Date().toISOString(),
    });
  }

  // Recursively sanitize string fields in body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeRecursive(req.body);
  }

  next();
}

// ------------------ SECURITY HEADERS MIDDLEWARE ------------------
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );

  // Content Security Policy allowing AI Studio frame & assets
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; img-src 'self' data: https: blob:; font-src 'self' data: https:;"
  );

  next();
}

// ------------------ JWT AUTHENTICATION FOR ADMIN ACTIONS ------------------
export interface AdminJwtPayload {
  username: string;
  role: 'admin';
  iss: string;
  iat?: number;
  exp?: number;
}

export function generateAdminToken(username = 'admin@rama77.com'): string {
  const payload: AdminJwtPayload = {
    username,
    role: 'admin',
    iss: 'rama77-backend-security',
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '2h',
    algorithm: 'HS256',
  });
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED_ACCESS',
      message:
        'Authorization header missing. Administrative actions require valid JWT bearer token.',
      timestamp: new Date().toISOString(),
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN_FORMAT',
      message: 'Authorization header must follow "Bearer <token>" standard.',
      timestamp: new Date().toISOString(),
    });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN_INSUFFICIENT_PERMISSIONS',
        message: 'Administrative privileges required for this operation.',
        timestamp: new Date().toISOString(),
      });
    }

    (req as any).adminUser = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'JWT_TOKEN_EXPIRED',
        message: 'Your administrator session token has expired. Please log in again.',
        timestamp: new Date().toISOString(),
      });
    }
    return res.status(401).json({
      success: false,
      error: 'INVALID_JWT_SIGNATURE',
      message: 'Invalid or forged JWT token signature. Access denied.',
      timestamp: new Date().toISOString(),
    });
  }
}

// ------------------ STRICT INPUT VALIDATION HELPERS ------------------
export const Validators = {
  isValidPana(pana: string): boolean {
    return /^\d{3}$/.test(pana);
  },

  isValidJodi(jodi: string): boolean {
    return /^\d{2}$/.test(jodi);
  },

  isValidSingleDigit(digit: string): boolean {
    return /^\d{1}$/.test(digit);
  },

  isValidPhone(phone: string): boolean {
    return /^[6-9]\d{9}$/.test(phone);
  },

  isValidAmount(amount: any, min = 1, max = 10000000): boolean {
    const num = Number(amount);
    return Number.isInteger(num) && num >= min && num <= max;
  },

  isValidMpin(mpin: string): boolean {
    return /^\d{4}$/.test(mpin);
  },
};

// ------------------ SAFE GLOBAL ERROR HANDLER ------------------
// Internal server errors, database paths, or stack traces are NEVER exposed to clients
export function safeErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.status || err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  // Secure internal logging
  console.error('[BACKEND_SECURE_LOGGER]', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    statusCode,
    message: err.message,
    code: err.code,
    stack: isDev ? err.stack : undefined,
  });

  // Safe client response with sanitized error message
  res.status(statusCode).json({
    success: false,
    error: err.code || (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR'),
    message:
      statusCode >= 500
        ? 'An internal processing error occurred. For security reasons, details are logged server-side.'
        : err.message || 'Invalid request parameters.',
    timestamp: new Date().toISOString(),
  });
}

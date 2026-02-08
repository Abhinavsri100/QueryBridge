import rateLimit from 'express-rate-limit';
import { type Request, type Response } from 'express';

export const queryRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2, // Limit each user to 2 queries per windowMs
  keyGenerator: (req: Request) => {
    // Use user ID if available, otherwise fallback to IP
    return (req as any).user?.id || req.ip;
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      message: "You have reached the limit of 2 queries per hour. ✨ PRO version with unlimited queries will be launched soon! ✨",
      proTeaser: true
    });
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

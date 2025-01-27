import rateLimit from "express-rate-limit";

// rate limit
const apiLimiter = rateLimit({
  windowMs: 60*1000, // 1 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
export default apiLimiter;

import arcjet, { tokenBucket } from "@arcjet/next";

// Separate from transaction creation: each authenticated user gets up to five
// scan attempts, refilling every 24 hours. Provider project quotas still apply.
const aiRateLimit = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"],
  rules: [
    tokenBucket({ mode: "LIVE", refillRate: 5, interval: 86400, capacity: 5 }),
  ],
});

export default aiRateLimit;

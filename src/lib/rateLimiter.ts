import prisma from "./prisma";

export async function checkRateLimit(apiKeyId: string) {
  // Get current rate limit config for this key or create default
  let rateLimit = await prisma.rateLimit.findFirst({
    where: { apiKeyId },
  });

  if (!rateLimit) {
    rateLimit = await prisma.rateLimit.create({
      data: {
        apiKeyId,
        limit: 10, // Default 10 requests
        window: 60, // per 60 seconds
      },
    });
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - rateLimit.window * 1000);

  // If the last update was before the current window, reset the counter
  if (rateLimit.updatedAt < windowStart) {
    await prisma.rateLimit.update({
      where: { id: rateLimit.id },
      data: {
        requests: 1,
        updatedAt: now,
      },
    });
    return { allowed: true, remaining: rateLimit.limit - 1 };
  }

  // If within the window, check if limit reached
  if (rateLimit.requests >= rateLimit.limit) {
    return { allowed: false, remaining: 0 };
  }

  // Increment requests
  await prisma.rateLimit.update({
    where: { id: rateLimit.id },
    data: {
      requests: { increment: 1 },
    },
  });

  return { allowed: true, remaining: rateLimit.limit - rateLimit.requests - 1 };
}

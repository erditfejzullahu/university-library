import redis from "./redis";

const WINDOW_SIZE_IN_SECONDS = 60 //1 min
const MAX_REQUESTS = 5;

export async function rateLimiter(ip: string): Promise<boolean> {
    const key = `login_attempts:${ip}`

    const currentCount = await redis.get(key);

    if(currentCount && Number(currentCount) >= MAX_REQUESTS) {
        return false; // rate limit exceeded
    }

    await redis.multi().incr(key).expire(key, WINDOW_SIZE_IN_SECONDS).exec();
    
    return true
}
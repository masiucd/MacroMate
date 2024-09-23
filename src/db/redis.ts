import "server-only";

import Redis, {type RedisOptions} from "ioredis";

import env from "@/env";

function createRedisInstance() {
  try {
    let options: RedisOptions = {
      host: "localhost",
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      retryStrategy: (times: number) => {
        if (times > 3) {
          throw new Error(
            `Redis connection failed after ${times} attempts`,
          );
        }
        return Math.min(times * 200, 1000);
      },
    };

    let redis = new Redis({
      port: parseInt(env.REDIS_PORT, 10),
      family: 4, // 4 (IPv4) or 6 (IPv6)
      // password: "password",
      db: 0,
      ...options,
    });

    redis.on("error", (err) => {
      // eslint-disable-next-line no-console
      console.warn("Redis error", err);
    });

    return redis;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating redis instance", error);
    throw new Error("Error creating redis instance");
  }
}

export let redis = createRedisInstance();

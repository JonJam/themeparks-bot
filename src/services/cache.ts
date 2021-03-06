import { caching } from "cache-manager";
import * as redisStore from "cache-manager-redis-store";
import * as debug from "debug";
import { redisHost, redisKey, redisPort } from "../settings";

const log = debug("services:cache");

let redisCache: any;

// If redisHost has not been defined, then do not use caching.
if (redisHost) {
  // Configuring caching for themeparks. Documentation for options: https://github.com/NodeRedis/node_redis#rediscreateclient
  redisCache = caching({
    auth_pass: redisKey,
    host: redisHost,
    port: redisPort,
    store: redisStore
    // If want to use TLS then uncomment below
    // tls: { servername: redisHost }
  });

  const redisClient = redisCache.store.getClient();

  redisClient.on("error", (e: Error) => {
    log(e);
  });
}

export default redisCache;

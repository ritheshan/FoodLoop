import redis from "../utils/redis.js";

const cache = (keyPrefix) => async (req, res, next) => {
  const key = `${keyPrefix}:${req.originalUrl}`;
  const cached = await redis.get(key);

  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  res.sendResponse = res.json;
  res.json = (body) => {
    redis.set(key, JSON.stringify(body), "EX", 300); // 5 mins cache
    res.sendResponse(body);
  };

  next();
};

export default cache;

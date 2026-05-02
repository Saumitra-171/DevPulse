const Redis = require('ioredis');
const logger = require('../utils/logger');

let client;
let subscriber;
let publisher;

const connectRedis = async () => {
  const config = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  };

  client = new Redis(config);
  subscriber = new Redis(config);
  publisher = new Redis(config);

  await client.ping();
  logger.info('✅ Redis connected');
};

const get = async (key) => client.get(key);
const set = async (key, value, ttl) => ttl ? client.set(key, value, 'EX', ttl) : client.set(key, value);
const del = async (key) => client.del(key);
const getJSON = async (key) => { const v = await get(key); return v ? JSON.parse(v) : null; };
const setJSON = async (key, value, ttl) => set(key, JSON.stringify(value), ttl);

const publish = async (channel, message) => publisher.publish(channel, JSON.stringify(message));

const subscribe = (channel, callback) => {
  subscriber.subscribe(channel);
  subscriber.on('message', (ch, message) => {
    if (ch === channel) callback(JSON.parse(message));
  });
};

module.exports = { connectRedis, get, set, del, getJSON, setJSON, publish, subscribe };
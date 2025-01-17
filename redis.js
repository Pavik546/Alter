const redis = require('redis');

// Create Redis client
const client = redis.createClient({socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }});

client.on('connect', () => console.log('Connected to Redis'));
client.on('error', (err) => console.error('Redis error:', err));

// Connect the client (for Redis v4 or later)
(async () => {
    await client.connect();
})();

module.exports = client;

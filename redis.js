const redis = require('redis');

// Create Redis client
const client = redis.createClient({
    url: 'redis://red-cu56hhtds78s73e0fjs0:6379',
  });

client.on('connect', () => console.log('Connected to Redis'));
client.on('error', (err) => console.error('Redis error:', err));

// Connect the client (for Redis v4 or later)
(async () => {
    await client.connect();
})();

module.exports = client;

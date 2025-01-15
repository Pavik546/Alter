const redis = require('redis');

// Create Redis client
const client = redis.createClient();

client.on('connect', () => console.log('Connected to Redis'));
client.on('error', (err) => console.error('Redis error:', err));

// Connect the client (for Redis v4 or later)
(async () => {
    await client.connect();
})();

module.exports = client;

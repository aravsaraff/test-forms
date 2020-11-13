const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const redis = require('redis');
const client = redis.createClient({
	host: 'localhost',
	port: 6379
});

const redisConfig = {
	host: 'localhost',
	port: 6379,
	client: client,
	ttl: 604800
};

module.exports = (session) => {
	const redisStore = require('connect-redis')(session);
	return new redisStore(redisConfig);
};

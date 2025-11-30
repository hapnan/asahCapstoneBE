import redis from 'redis';
import 'dotenv/config';
class CacheService {
    constructor() {
        this._client = redis.createClient({
            url: process.env.REDIS_URL,
        });

        this._client.on('error', (error) => {
            console.error('Redis error:', error);
        });

        this._client.connect();
    }

    async set(key, value, expirationInSecond = 1800) {
        await this._client.set(key, value, {
            EX: expirationInSecond,
        });
    }

    async get(key) {
        const result = await this._client.get(key);

        if (result === null) {
            throw new Error('Cache tidak ditemukan');
        }

        return result;
    }

    async delete(key) {
        return this._client.del(key);
    }
}

export default CacheService;

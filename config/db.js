import { MongoClient } from 'mongodb';
import { config } from './env.js';

const client = new MongoClient(config.mongoUri);
let db;

export const connectDB = async () => {
    try {
        await client.connect();
        db = client.db(config.dbName);
        await db
            .collection('users')
            .createIndex({ email: 1 }, { unique: true });
        console.log('Database connected!');
    } catch (err) {
        console.error('Database connection failed', err.message);
        process.exit(1);
    }
};

export const getDB = () => {
    if (!db) throw new Error('Database not found!');
    return db;
};

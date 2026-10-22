import 'dotenv/config'
const requireEnv = (name) => {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is required!`);
    return value;
};

export const config = {
    port: Number(requireEnv('PORT')),
    dbName: requireEnv('DB_NAME'),
    mongoUri: requireEnv('MONGO_URI'),
};
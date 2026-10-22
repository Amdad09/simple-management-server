import express from 'express';
import cors from 'cors'
import { config } from './config/env.js';
import usersRouter from './routers/users.js'
import { connectDB } from './config/db.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', usersRouter);

app.use((err, req, res, next) => {
    if (err.code === 11000) {
        return res.status(409).json({ message: 'Email already exists' });
    }
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Invalid JSON body' });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});


await connectDB(); 
    
app.listen(config.port, () => {
    console.log('Server running on '+config.port);
})

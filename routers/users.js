import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { toObejctId } from '../utils/objectId.js';

const router = Router();
const users = () => getDB().collection('users');

router.get('/', async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const page = Math.max(Number(req.query.page) || 1, 1);
    try {
        const result = await users()
            .find()
            .sort({ createdAt: -1, _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const _id = toObejctId(req.params.id);
        if (!_id) return res.status(400).json({ message: 'Invalid id' });
        const user = await users().findOne({ _id });
        if (!user) return res.status(404).json({ message: 'user not found!' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, userId } = req.body;
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ message: 'Email is required!' });
        }
        const user = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            userId: new ObjectId(userId),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await users().insertOne(user);
        res.status(201).json({ _id: result.insertedId, ...user });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error(err);
        res.status(500).json({ message: 'Failed to create user' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const _id = toObejctId(req.params.id);
        if (!_id) return res.status(400).json({ message: 'Invalid id' });
        const result = await users().deleteOne({ _id });
        if (result.deleteCount === 0)
            return res.status(404).json({ message: 'User not found' });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const _id = toObejctId(id);
        if (!_id) return res.status(400).json({ message: 'invalid id' });

        const { name, email } = req.body ?? {};

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Name is required!' });
        }
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ message: 'Email is required!' });
        }

        const result = await users().findOneAndUpdate(
            { _id },
            {
                $set: {
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    updatedAt: new Date(),
                },
            },
            { returnDocument: 'after' },
        );
        if (!result)
            return res.status(404).json({ message: 'User not found!' });
        res.json(result);
    } catch (err) {
        next(err);
    }
});

export default router;

import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { requireAuth } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const SALT_ROUNDS = 10;

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({ data: { email, password: hash } });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, email: user.email, avatarUrl: user.avatarUrl || null } });
  } catch (err) {
    console.error('REGISTER ERROR', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, email: user.email, avatarUrl: user.avatarUrl || null } });
  } catch (err) {
    console.error('LOGIN ERROR', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/* ---------------- UPLOAD AVATAR ---------------- */
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

router.put('/avatar', requireAuth as any, upload.single('avatar'), async (req: any, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Missing avatar file' });
    const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const updated = await prisma.user.update({ where: { id: req.user.id }, data: { avatarUrl: imageUrl } });
    res.json({ avatarUrl: updated.avatarUrl });
  } catch (err) {
    console.error('AVATAR UPLOAD ERROR', err);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

export default router;

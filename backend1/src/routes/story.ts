import { Request, Response, Router } from "express";
import prisma from "../prisma";
import { AuthRequest, requireAuth } from "../middleware/auth";

const router = Router();

/* =================================================
   GET ALL STORIES
================================================= */
router.get("/", async (_: Request, res: Response) => {
  try {
    const stories = await prisma.story.findMany({
      include: {
        author: { select: { email: true } },
        village: { include: { pincode: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    const formatted = await Promise.all(stories.map(async (s) => {
      const likes = await prisma.like.count({ where: { resourceType: 'STORY', resourceId: s.id } });
      return {
        id: s.id,
        title: s.title,
        originalText: s.originalText,
        originalLang: s.originalLang,
        createdAt: s.createdAt,
        author: { email: s.author.email },
        village: {
          id: s.village?.id ?? "",
          name: s.village?.name ?? "Unknown",
          pincode: s.village?.pincode?.code ?? "000000"
        },
        likesCount: likes
      };
    }));

    res.json(formatted);
  } catch (err) {
    console.error("GET STORIES ERROR:", err);
    res.status(500).json({ error: "Failed to load stories" });
  }
});

/* ---------------- LIKE / TOGGLE ---------------- */
router.post('/:id/like', requireAuth as any, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.like.findUnique({ where: { userId_resourceType_resourceId: { userId, resourceType: 'STORY', resourceId: id } } as any }).catch(() => null);

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
    } else {
      await prisma.like.create({ data: { userId, resourceType: 'STORY', resourceId: id } as any });
    }

    const likes = await prisma.like.count({ where: { resourceType: 'STORY', resourceId: id } });
    res.json({ likesCount: likes, liked: !existing });
  } catch (err) {
    console.error('STORY LIKE TOGGLE ERROR', err);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

/* =================================================
   CREATE STORY
================================================= */
router.post("/", requireAuth as any, async (req: AuthRequest, res: Response) => {
  try {
    const { title, originalText, originalLang = "en", villageId } = req.body;

    if (!title || !originalText || !villageId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    /* 2️⃣ Create story with authenticated user as author */
    const authorId = req.user!.id;

    const story = await prisma.story.create({
      data: {
        title,
        originalText,
        originalLang,
        villageId,
        authorId,
      },
      include: {
        author: { select: { email: true } },
        village: { include: { pincode: true } },
      },
    });

    res.status(201).json({
      id: story.id,
      title: story.title,
      originalText: story.originalText,
      originalLang: story.originalLang,
      createdAt: story.createdAt,
      author: { email: story.author.email },
      village: {
        id: story.village.id,
        name: story.village.name,
        pincode: story.village.pincode.code,
      },
    });
  } catch (err) {
    console.error("CREATE STORY ERROR:", err);
    res.status(500).json({ error: "Failed to create story" });
  }
});

/* =================================================
   UPDATE STORY (only author)
================================================= */
router.put("/:id", requireAuth as any, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, originalText, originalLang } = req.body;

    const story = await prisma.story.findUnique({
      where: { id },
      include: { author: true, village: { include: { pincode: true } } },
    });

    if (!story) return res.status(404).json({ error: "Story not found" });
    if (story.authorId !== req.user!.id) return res.status(403).json({ error: "Not authorized" });

    const updated = await prisma.story.update({
      where: { id },
      data: { title: title ?? story.title, originalText: originalText ?? story.originalText, originalLang: originalLang ?? story.originalLang },
      include: { author: { select: { email: true } }, village: { include: { pincode: true } } },
    });

    res.json({
      id: updated.id,
      title: updated.title,
      originalText: updated.originalText,
      originalLang: updated.originalLang,
      createdAt: updated.createdAt,
      author: { email: updated.author.email },
      village: { id: updated.village.id, name: updated.village.name, pincode: updated.village.pincode.code },
    });
  } catch (err) {
    console.error("UPDATE STORY ERROR:", err);
    res.status(500).json({ error: "Failed to update story" });
  }
});

/* =================================================
   DELETE STORY (only author)
================================================= */
router.delete("/:id", requireAuth as any, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({ where: { id } });
    if (!story) return res.status(404).json({ error: "Story not found" });
    if (story.authorId !== req.user!.id) return res.status(403).json({ error: "Not authorized" });

    await prisma.story.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error("DELETE STORY ERROR:", err);
    res.status(500).json({ error: "Failed to delete story" });
  }
});

export default router;

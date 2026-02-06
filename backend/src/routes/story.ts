import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/**
 * POST /api/stories
 * Create a new story
 */
router.post("/", async (req, res) => {
  const { title, originalText, originalLang, villageId, authorEmail } = req.body;

  if (!title || !originalText || !originalLang || !villageId || !authorEmail) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1. Find or create user (email-based for MVP)
    let user = await prisma.user.findUnique({
      where: { email: authorEmail }
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email: authorEmail }
      });
    }

    const village = await prisma.village.findUnique({
  where: { id: villageId }
});

if (!village) {
  return res.status(400).json({ error: "Village does not exist" });
}

    // 2. Create story
    const story = await prisma.story.create({
      data: {
        title,
        originalText,
        originalLang,
        villageId,
        authorId: user.id
      }
    });

    return res.status(201).json(story);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create story" });
  }
});

/**
 * GET /api/villages/:villageId/stories
 * Get stories of a village
 */
router.get("/village/:villageId", async (req, res) => {
  const { villageId } = req.params;

  try {
    const stories = await prisma.story.findMany({
      where: { villageId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { email: true }
        }
      }
    });

    return res.json(stories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch stories" });
  }
});

export default router;

import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/* =================================================
   GET ALL STORIES
================================================= */
router.get("/", async (_, res) => {
  try {
    const stories = await prisma.story.findMany({
      include: {
        author: { select: { email: true } },
        village: { include: { pincode: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(
      stories.map((s) => ({
        id: s.id,
        title: s.title,
        originalText: s.originalText,
        originalLang: s.originalLang,
        createdAt: s.createdAt,
        author: { email: s.author.email },
        village: {
          id: s.village.id,
          name: s.village.name,
          pincode: s.village.pincode.code,
        },
      }))
    );
  } catch (err) {
    console.error("GET STORIES ERROR:", err);
    res.status(500).json({ error: "Failed to load stories" });
  }
});

/* =================================================
   CREATE STORY
================================================= */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      originalText,
      originalLang = "en",
      villageId,
      authorEmail,
    } = req.body;

    if (!title || !originalText || !villageId || !authorEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    /* 1️⃣ Ensure author exists */
    let author = await prisma.user.findUnique({
      where: { email: authorEmail },
    });

    if (!author) {
      author = await prisma.user.create({
        data: { email: authorEmail },
      });
    }

    /* 2️⃣ Create story with authorId */
    const story = await prisma.story.create({
      data: {
        title,
        originalText,
        originalLang,
        villageId,
        authorId: author.id,
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

export default router;

import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/* --------------------------------------------------
   GET FULL VILLAGE DATA
   /api/villages/:id
---------------------------------------------------*/
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const village = await prisma.village.findUnique({
      where: { id },
      include: {
        pincode: true,

        stories: {
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: { email: true },
            },
          },
        },

        photos: {
          where: { approved: true },
          orderBy: { createdAt: "desc" },
        },

        foods: {
          where: { approved: true },
          orderBy: { createdAt: "desc" },
        },

        specialties: {
          where: { approved: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!village) {
      return res.status(404).json({ error: "Village not found" });
    }

    res.json({
      id: village.id,
      name: village.name,
      pincode: village.pincode.code,
      district: village.pincode.district,
      state: village.pincode.state,

      stories: village.stories.map((s) => ({
        id: s.id,
        title: s.title,
        text: s.originalText,
        createdAt: s.createdAt,
        author: s.author?.email || "Unknown",
      })),

      photos: village.photos.map((p) => ({
        id: p.id,
        url: p.imageUrl,
        caption: p.description,
      })),

      foods: village.foods.map((f) => ({
        id: f.id,
        name: f.name,
        description: f.description,
        imageUrl: f.imageUrl,
      })),

      specialties: village.specialties.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        category: s.category,
        imageUrl: s.imageUrl,
      })),
    });
  } catch (err) {
    console.error("VILLAGE FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to load village data" });
  }
});

export default router;

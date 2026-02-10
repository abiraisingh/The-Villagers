import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/**
 * GET /api/village-details/:villageId
 */
router.get("/:villageId", async (req, res) => {
  const { villageId } = req.params;

  try {
    const village = await prisma.village.findUnique({
      where: { id: villageId },
      include: {
        pincode: true,

        stories: {
          orderBy: { createdAt: "desc" }
        },

        foods: {
          where: { approved: true },
          orderBy: { createdAt: "desc" }
        },

        specialties: {
          where: { approved: true },
          orderBy: { createdAt: "desc" }
        },

        photos: {
          where: { approved: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!village) {
      return res.status(404).json({ error: "Village not found" });
    }

    return res.json({
      village: {
        id: village.id,
        name: village.name,
        pincode: village.pincode.code
      },
      stories: village.stories,
      food: village.foods,          // 👈 frontend expects `food`
      specialties: village.specialties,
      photos: village.photos
    });
  } catch (err) {
    console.error("VILLAGE DETAILS ERROR:", err);
    return res.status(500).json({ error: "Failed to load village data" });
  }
});

export default router;

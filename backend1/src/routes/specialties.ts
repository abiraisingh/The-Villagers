import { Request, Response, Router } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { requireAuth } from "../middleware/auth";

const router = Router();

/* ---------------- GET SPECIALTIES ---------------- */
router.get("/", async (_: Request, res: Response) => {
  try {
    const specialties = await prisma.specialty.findMany({
      where: { approved: true },
      include: {
        village: {
          include: { pincode: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const formatted = specialties.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      category: s.category,
      imageUrl: s.imageUrl,
      village: s.village.name,
      pincode: s.village.pincode.code,
      createdBy: s.createdBy
    }));

    res.json(formatted);
  } catch (err) {
    console.error("GET SPECIALTIES ERROR:", err);
    res.status(500).json({ error: "Failed to load specialties" });
  }
});

/* ---------------- ADD SPECIALTY ---------------- */
router.post("/", requireAuth as any, async (req: any, res) => {
  try {
    const { title, description, category, pincode, villageName } = req.body;

    if (!title || !category || !pincode || !villageName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    /* 1️⃣ Resolve village */
    const village = await prisma.village.findFirst({
      where: {
        name: villageName,
        pincode: { code: pincode }
      }
    });

    if (!village) {
      return res.status(404).json({ error: "Village not found" });
    }

    /* 2️⃣ Create specialty */
    const specialty = await prisma.specialty.create({
      data: {
        title,
        description,
        category,
        villageId: village.id,
        createdBy: req.user?.id ?? null,
        approved: true // dev mode: visible immediately
      },
      include: {
        village: {
          include: { pincode: true }
        }
      }
    });

    /* 3️⃣ Return display-ready response */
    res.status(201).json({
      id: specialty.id,
      title: specialty.title,
      description: specialty.description,
      category: specialty.category,
      imageUrl: specialty.imageUrl,
      village: specialty.village.name,
      pincode: specialty.village.pincode.code
    });
  } catch (err: any) {
    /* 🔴 Handle duplicate specialty (title + village) */
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({
        error: "This specialty already exists for the selected village"
      });
    }

    console.error("ADD SPECIALTY ERROR:", err);
    res.status(500).json({ error: "Failed to add specialty" });
  }
});

/* ---------------- UPDATE SPECIALTY (only creator) ---------------- */
router.put("/:id", requireAuth as any, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const existing = await prisma.specialty.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Specialty not found" });
    if (existing.createdBy !== req.user?.id) return res.status(403).json({ error: "Not authorized" });

    const updated = await prisma.specialty.update({
      where: { id },
      data: { title: title ?? existing.title, description: description ?? existing.description, category: category ?? existing.category },
      include: { village: { include: { pincode: true } } }
    });

    res.json({ id: updated.id, title: updated.title, description: updated.description, category: updated.category, imageUrl: updated.imageUrl, village: updated.village.name, pincode: updated.village.pincode.code });
  } catch (err: any) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({ error: "This specialty already exists for the selected village" });
    }

    console.error("UPDATE SPECIALTY ERROR:", err);
    res.status(500).json({ error: "Failed to update specialty" });
  }
});

/* ---------------- DELETE SPECIALTY (only creator) ---------------- */
router.delete("/:id", requireAuth as any, async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.specialty.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Specialty not found" });
    if (existing.createdBy !== req.user?.id) return res.status(403).json({ error: "Not authorized" });

    await prisma.specialty.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error("DELETE SPECIALTY ERROR:", err);
    res.status(500).json({ error: "Failed to delete specialty" });
  }
});

export default router;

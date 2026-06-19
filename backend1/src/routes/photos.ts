import { Request, Response, Router } from "express";
import prisma from "../prisma";
import multer from "multer";
import { requireAuth } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ---------------- GET PHOTOS ---------------- */
router.get("/", async (_: Request, res: Response) => {
  try {
    const photos = await prisma.photo.findMany({
      where: { approved: true },
      include: {
        village: {
          include: { pincode: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Attach likes count
    const formatted = await Promise.all(photos.map(async (p) => {
      const likes = await prisma.like.count({ where: { resourceType: 'PHOTO', resourceId: p.id } });
      return {
        id: p.id,
        title: p.title,
        description: p.description,
        imageUrl: p.imageUrl,
        village: p.village?.name ?? "Unknown",
        pincode: p.village?.pincode?.code ?? "000000",
        uploadedBy: p.uploadedBy,
        likesCount: likes
      };
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load photos" });
  }
});

/* ---------------- UPLOAD PHOTO ---------------- */
router.post(
  "/",
  requireAuth as any,
  upload.single("photo"),
  async (req: any, res) => {
    try {
      const { title, description, pincode, villageName } = req.body;

      if (!req.file || !title || !pincode || !villageName) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const village = await prisma.village.findFirst({
        where: {
          name: villageName,
          pincode: { code: pincode }
        },
        include: { pincode: true }
      });

      if (!village) {
        return res.status(404).json({ error: "Village not found" });
      }

      // TEMP: base64 (replace with Supabase/Cloudinary later)
      const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const photo = await prisma.photo.create({
        data: {
          title,
          description,
          imageUrl,
          villageId: village.id,
          uploadedBy: req.user?.id ?? null,
          approved: true,
        },
        include: {
          village: { include: { pincode: true } }
        }
      });

      // RETURN DISPLAY-READY OBJECT (with likesCount)
      res.status(201).json({
        id: photo.id,
        title: photo.title,
        description: photo.description,
        imageUrl: photo.imageUrl,
        village: photo.village.name,
        pincode: photo.village.pincode.code,
        likesCount: 0
      });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

/* ---------------- LIKE / TOGGLE ---------------- */
router.post('/:id/like', requireAuth as any, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.like.findUnique({ where: { userId_resourceType_resourceId: { userId, resourceType: 'PHOTO', resourceId: id } } as any }).catch(() => null);

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
    } else {
      await prisma.like.create({ data: { userId, resourceType: 'PHOTO', resourceId: id } as any });
    }

    const likes = await prisma.like.count({ where: { resourceType: 'PHOTO', resourceId: id } });
    res.json({ likesCount: likes, liked: !existing });
  } catch (err) {
    console.error('LIKE TOGGLE ERROR', err);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

/* ---------------- UPDATE PHOTO (only uploader) ---------------- */
router.put("/:id", requireAuth as any, upload.single("photo"), async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const existing = await prisma.photo.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Photo not found" });
    if (existing.uploadedBy !== req.user?.id) return res.status(403).json({ error: "Not authorized" });

    const imageUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}` : existing.imageUrl;

    const updated = await prisma.photo.update({
      where: { id },
      data: { title: title ?? existing.title, description: description ?? existing.description, imageUrl },
      include: { village: { include: { pincode: true } } }
    });

    res.json({ id: updated.id, title: updated.title, description: updated.description, imageUrl: updated.imageUrl, village: updated.village.name, pincode: updated.village.pincode.code });
  } catch (err) {
    console.error("UPDATE PHOTO ERROR:", err);
    res.status(500).json({ error: "Failed to update photo" });
  }
});

/* ---------------- DELETE PHOTO (only uploader) ---------------- */
router.delete("/:id", requireAuth as any, async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.photo.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Photo not found" });
    if (existing.uploadedBy !== req.user?.id) return res.status(403).json({ error: "Not authorized" });

    await prisma.photo.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error("DELETE PHOTO ERROR:", err);
    res.status(500).json({ error: "Failed to delete photo" });
  }
});

export default router;

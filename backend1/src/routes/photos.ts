import { Request, Response, Router } from "express";
import prisma from "../prisma";
import multer from "multer";

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

    const formatted = photos.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      village: p.village.name,
      pincode: p.village.pincode.code
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
  upload.single("photo"),
  async (req, res) => {
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
          approved: true
        },
        include: {
          village: { include: { pincode: true } }
        }
      });

      // RETURN DISPLAY-READY OBJECT
      res.status(201).json({
        id: photo.id,
        title: photo.title,
        description: photo.description,
        imageUrl: photo.imageUrl,
        village: photo.village.name,
        pincode: photo.village.pincode.code
      });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;

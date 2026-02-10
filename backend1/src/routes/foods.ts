import prisma from "../prisma";
import multer from "multer";
import { Prisma } from "@prisma/client";
import { Request, Response, Router } from "express";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ---------------- GET FOODS ---------------- */
router.get("/", async (_: Request, res: Response) => {
  try {
    const foods = await prisma.food.findMany({
      where: { approved: true },
      include: {
        village: {
          include: { pincode: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = foods.map((f) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      ingredients: f.ingredients,
      imageUrl: f.imageUrl,
      village: f.village.name,
      pincode: f.village.pincode.code,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("GET FOODS ERROR:", err);
    res.status(500).json({ error: "Failed to load foods" });
  }
});

/* ---------------- UPLOAD FOOD ---------------- */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, ingredients, pincode, villageName } = req.body;

    if (!name || !pincode || !villageName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    /* 1️⃣ Resolve village */
    const village = await prisma.village.findFirst({
      where: {
        name: villageName,
        pincode: { code: pincode },
      },
      include: { pincode: true },
    });

    if (!village) {
      return res.status(404).json({ error: "Village not found" });
    }

    /* 2️⃣ Handle image (temporary base64) */
    const imageUrl = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : null;

    /* 3️⃣ Create food */
    const food = await prisma.food.create({
      data: {
        name,
        description,
        ingredients,
        imageUrl,
        villageId: village.id,
        approved: true, // visible immediately (dev mode)
      },
      include: {
        village: { include: { pincode: true } },
      },
    });

    /* 4️⃣ Return display-ready object */
    return res.status(201).json({
      id: food.id,
      name: food.name,
      description: food.description,
      ingredients: food.ingredients,
      imageUrl: food.imageUrl,
      village: food.village.name,
      pincode: food.village.pincode.code,
    });
  } catch (err: any) {
    /* 🔴 Handle duplicate food (name + village) */
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({
        error: "This dish already exists for the selected village",
      });
    }

    console.error("FOOD UPLOAD ERROR:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

export default router;

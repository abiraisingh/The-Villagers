import { Router } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/:code", async (req, res) => {
  const { code } = req.params;

  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: "Invalid pincode" });
  }

  try {
    // 1. Check DB first
    const existing = await prisma.pincode.findUnique({
      where: { code },
      include: {
        villages: {
          where: { approved: true },
          select: { id: true, name: true }
        }
      }
    });

    if (existing) {
      return res.json(existing);
    }

    // 2. Fetch from external API
    const apiRes = await fetch(
      `https://api.postalpincode.in/pincode/${code}`
    );
    const data = await apiRes.json();

    if (!data[0] || data[0].Status !== "Success") {
      return res.status(404).json({ error: "Pincode not found" });
    }

    const postOffices = data[0].PostOffice;

    const state = postOffices[0].State;
    const district = postOffices[0].District;

    // 3. Save to DB
   // Save pincode first
const savedPincode = await prisma.pincode.create({
  data: {
    code,
    state,
    district
  }
});

// Save villages explicitly
await prisma.village.createMany({
  data: postOffices.map((po: any) => ({
    name: po.Name,
    pincodeId: savedPincode.id
  })),
  skipDuplicates: true
});

// Fetch back from DB (source of truth)
const result = await prisma.pincode.findUnique({
  where: { id: savedPincode.id },
  include: {
    villages: {
      select: { id: true, name: true }
    }
  }
});

return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});


router.get("/debug/all-villages", async (_, res) => {
  const villages = await prisma.village.findMany({
    select: { id: true, name: true }
  });
  res.json(villages);
});
router.delete("/debug/clear", async (_, res) => {
  await prisma.story.deleteMany();
  await prisma.user.deleteMany();
  await prisma.village.deleteMany();
  await prisma.pincode.deleteMany();

  res.json({ status: "cleared" });
});


export default router;

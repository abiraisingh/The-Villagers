import express from "express";
import cors from "cors";

import photosRoutes from "./routes/photos";
import pincodeRoutes from "./routes/pincode";
import foodsRoutes from "./routes/foods";
import specialtiesRoutes from "./routes/specialties";
import storiesRoutes from "./routes/story";
import villagesRoutes from "./routes/villages";
import villageDetailsRoutes from "./routes/village-details";
import authRoutes from "./routes/auth";
import { optionalAuth } from "./middleware/auth";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// try to attach user when token provided (not required for reads)
app.use(optionalAuth as any);

app.use("/api/photos", photosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pincodes", pincodeRoutes);
app.use("/api/foods", foodsRoutes);
app.use("/api/specialties", specialtiesRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/villages", villagesRoutes);
app.use("/api/village-details", villageDetailsRoutes);

app.get("/", (_, res) => {
  res.send("API running");
});

export default app;

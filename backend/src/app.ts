import express from "express";
import cors from "cors";
import pincodeRoutes from "./routes/pincode";
import storyRoutes from "./routes/story";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pincodes", pincodeRoutes);
app.use("/api/stories", storyRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

export default app;

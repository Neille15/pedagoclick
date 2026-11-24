import "dotenv/config";
import express from "express";
import healthRoutes from "./routes/healthRoutes.js"

const app  = express();
const port = Number(process.env.PORT || 5000);

app.use("/api", healthRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
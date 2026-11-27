import "dotenv/config";
import express from "express";
import healthRoutes from "./routes/healthRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use("/api", healthRoutes);

app.use("/api", studentRoutes);

app.use((req, res) => {
  res.status(404).json({ erorr: "Route not Found" });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

import { pool } from "../db/pool.js";

export async function getHealth(req, res) {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (error) {
    console.error("Database health check error", error.message);
    res.status(503).json({ status: "error", db: "unavailable" });
  }
}

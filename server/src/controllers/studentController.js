import { pool } from "../db/pool.js";

export async function getStudents(req, res, next) {
  try {
    const page = Number(req.query.page ?? 1);
    const requestedLimit = Number(req.query.limit ?? 20);

    if (
      !Number.isSafeInteger(page) ||
      page < 1 ||
      !Number.isSafeInteger(requestedLimit) ||
      requestedLimit < 1
    ) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive integers" });
    }

    const limit = Math.min(requestedLimit, 100);
    const offset = (page - 1) * limit;

    if (!Number.isSafeInteger(offset)) {
      return res.status(400).json({ error: "Page is too large" });
    }
    const result = await pool.query(
      `SELECT student_number, first_name, last_name
       FROM public.students
       ORDER BY student_number
       LIMIT $1 OFFSET $2 `,
      [limit, offset],
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) AS total FROM public.students",
    );

    res.json({
      data: result.rows,
      page,
      limit,
      total: Number(countResult.rows[0].total),
    });
  } catch (error) {
    next(error);
  }
}

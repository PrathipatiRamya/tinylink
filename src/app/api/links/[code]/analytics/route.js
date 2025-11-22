import pool from "@/lib/db";

export async function GET(request, context) {
  const { code } = await context.params;

  const result = await pool.query(
    `SELECT DATE(clicked_at) AS day, COUNT(*) AS clicks
     FROM clicks
     WHERE code=$1
     GROUP BY day
     ORDER BY day ASC`,
    [code]
  );

  return Response.json(result.rows);
}

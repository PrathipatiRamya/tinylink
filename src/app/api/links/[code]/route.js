import pool from "@/lib/db";

export async function DELETE(request, context) {
  const { code } = await context.params;

  const res = await pool.query(
    "DELETE FROM links WHERE code=$1 RETURNING code",
    [code]
  );

  if (res.rowCount === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}

export async function GET(request, context) {
  const { code } = await context.params;
  const res = await pool.query(
    "SELECT code, url, clicks, last_clicked, created_at FROM links WHERE code=$1",
    [code]
  );

  if (res.rowCount === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(res.rows[0]);
}

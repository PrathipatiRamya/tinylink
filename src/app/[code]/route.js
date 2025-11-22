import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { code } = await context.params;

  const res = await pool.query("SELECT url FROM links WHERE code=$1", [code]);

  if (res.rowCount === 0) return new Response("Not found", { status: 404 });

  const url = res.rows[0].url;

  // Log click
  await pool.query("INSERT INTO clicks (code) VALUES ($1)", [code]);

  // Update latest click + total clicks for display
  await pool.query(
    "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code=$1",
    [code]
  );

  return NextResponse.redirect(url);
}

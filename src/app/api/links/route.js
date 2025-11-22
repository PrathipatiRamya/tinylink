import pool from "@/lib/db";

// LIST LINKS
export async function GET() {
  const res = await pool.query(
    "SELECT code, url, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC"
  );
  return Response.json(res.rows);
}

// CREATE LINK
export async function POST(request) {
  try {
    const body = await request.json();
    const url = body.url?.trim();
    let code = body.code?.trim();

    // Validate URL
    if (!url)
      return Response.json({ error: "URL is required" }, { status: 400 });

    try {
      new URL(url);
    } catch {
      return Response.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Validate custom code format 5–10 alphanumeric
    const codeRegex = /^[A-Za-z0-9]{5,10}$/;

    if (code) {
      if (!codeRegex.test(code)) {
        return Response.json(
          { error: "Custom code must be 5–10 letters or numbers" },
          { status: 400 }
        );
      }

      // Check if code already exists
      const exists = await pool.query("SELECT 1 FROM links WHERE code=$1", [
        code,
      ]);
      if (exists.rowCount > 0) {
        return Response.json(
          { error: "Custom code already exists" },
          { status: 409 }
        );
      }
    } else {
      // Auto-generate a code between 5–10 characters
      function randomCode(length) {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return Array.from(
          { length },
          () => chars[Math.floor(Math.random() * chars.length)]
        ).join("");
      }

      let attempts = 0;
      do {
        code = randomCode(Math.floor(Math.random() * (10 - 5 + 1)) + 5);
        const exists = await pool.query("SELECT 1 FROM links WHERE code=$1", [
          code,
        ]);
        if (exists.rowCount === 0) break;
        attempts++;
      } while (attempts < 5);
    }

    // Save link
    await pool.query("INSERT INTO links (code, url) VALUES ($1, $2)", [
      code,
      url,
    ]);

    return Response.json({ code }, { status: 201 });
  } catch (error) {
    console.error(error);

    // Handle DB code length error
    if (error.code === "22001") {
      return Response.json(
        { error: "Generated code exceeded length limit. Try again." },
        { status: 500 }
      );
    }

    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

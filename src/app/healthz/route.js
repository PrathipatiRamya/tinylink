import pool from "@/lib/db";
import os from "os";

export async function GET(request) {
  const headers = new Headers(request.headers);
  const prefersJSON =
    headers.get("accept")?.includes("application/json") ?? false;

  const start = Date.now();
  let dbStatus = "connected";
  let status = "healthy";

  try {
    await pool.query("SELECT 1");
  } catch (err) {
    dbStatus = "error";
    status = "unhealthy";
  }

  const dbLatency = Date.now() - start;

  // Server stats
  const memory = process.memoryUsage();
  const cpuLoad = os.loadavg()[0]; // 1-minute CPU load average

  const response = {
    status,
    database: dbStatus,
    db_latency_ms: dbLatency,
    server: {
      cpu_load: cpuLoad.toFixed(2),
      free_memory_mb: Math.round(memory.free / 1024 / 1024),
      used_memory_mb: Math.round(memory.rss / 1024 / 1024),
    },
    timestamp: new Date().toISOString(),
  };

  // Return JSON if automated system requests it
  if (prefersJSON) return Response.json(response);

  // Styled UI for browser
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>System Health Monitor</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: #f1f5f9;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .card {
          width: 420px;
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0px 10px 30px rgba(0,0,0,0.1);
          animation: fadeIn 0.4s ease;
        }
        .title {
          font-size: 26px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 5px;
          text-align: center;
        }
        .status {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 18px;
          color: ${status === "healthy" ? "#22c55e" : "#dc2626"};
        }
        .row {
          margin: 12px 0;
          font-size: 15px;
          color: #334155;
          display: flex;
          justify-content: space-between;
        }
        .value {
          font-weight: bold;
          color: #0f172a;
        }
        .footer {
          margin-top: 20px;
          font-size: 13px;
          text-align: center;
          color: #64748b;
        }
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(10px);}
          to {opacity: 1; transform: translateY(0);}
        }
      </style>
      <script>
        setTimeout(() => location.reload(), 5000); // auto-refresh every 5s
      </script>
    </head>
    <body>
      <div class="card">
        <div class="title">System Health</div>
        <div class="status">${response.status.toUpperCase()}</div>

        <div class="row"><span>Database:</span> <span class="value">${
          response.database
        }</span></div>
        <div class="row"><span>DB Latency:</span> <span class="value">${
          response.db_latency_ms
        } ms</span></div>
        <div class="row"><span>CPU Load:</span> <span class="value">${
          response.server.cpu_load
        }</span></div>
        <div class="row"><span>RAM Used:</span> <span class="value">${
          response.server.used_memory_mb
        } MB</span></div>
        <div class="row"><span>Free Memory:</span> <span class="value">${
          response.server.free_memory_mb
        } MB</span></div>

        <div class="footer">Last updated: ${new Date().toLocaleString()}</div>
      </div>
    </body>
    </html>
  `,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

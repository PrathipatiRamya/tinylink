"use client";
import Toast from "./Toast";
import QRCode from "qrcode";
import { useState } from "react";

export default function LinksTable({ links, onDeleted }) {
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);

  async function handleDelete(code) {
    if (!confirm("Delete link " + code + "?")) return;
    setDeleting(code);

    const res = await fetch("/api/links/" + code, { method: "DELETE" });

    if (res.status === 204) {
      setToast("Link deleted!");
      onDeleted && onDeleted();
    }

    setDeleting(null);
  }

  async function generateQR(fullUrl) {
    try {
      const qrImage = await QRCode.toDataURL(fullUrl);
      const win = window.open();
      win.document.write(
        `<img src="${qrImage}" style="width:300px;height:auto;" />`
      );
    } catch (error) {
      setToast("QR generation failed");
    }
  }

  return (
    <div className="table-wrapper card">
      {/* 🔹 Health Check Button */}
      <div style={{ marginBottom: "12px", textAlign: "right" }}>
        <button
          className="btn-outline"
          onClick={() => window.open("/healthz", "_blank")}
          style={{ padding: "8px 14px", fontWeight: "600" }}
        >
          ❤️‍🩹 Health Check
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Target URL</th>
            <th>Clicks</th>
            <th>Last Clicked</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((link) => {
            const shortUrl = `${window.location.origin}/${link.code}`;

            return (
              <tr key={link.code}>
                <td>{link.code}</td>

                <td>
                  <a
                    href={link.url}
                    target="_blank"
                    style={{ color: "#007bff" }}
                  >
                    {link.url}
                  </a>
                </td>

                <td>{link.clicks}</td>

                <td>
                  {link.last_clicked
                    ? new Date(link.last_clicked).toLocaleString()
                    : "-"}
                </td>

                <td style={{ display: "flex", gap: "6px" }}>
                  {/* Copy Button */}
                  <button
                    className="btn-outline"
                    onClick={() => {
                      navigator.clipboard.writeText(shortUrl);
                      setToast("Copied!");
                    }}
                  >
                    Copy
                  </button>

                  {/* QR Code */}
                  <button
                    className="btn-outline"
                    onClick={() => generateQR(shortUrl)}
                  >
                    QR
                  </button>

                  {/* Delete */}
                  <button
                    className="btn-danger"
                    disabled={deleting === link.code}
                    onClick={() => handleDelete(link.code)}
                  >
                    {deleting === link.code ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

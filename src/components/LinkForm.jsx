"use client";
import { useState } from "react";

export default function LinkForm({ onCreated }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code: code || undefined }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUrl("");
      setCode("");
      onCreated && onCreated();
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <label>Long URL</label>
      <input value={url} onChange={(e) => setUrl(e.target.value)} />

      <label>Custom Code (optional)</label>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="(5–10 letters or numbers, leave empty for auto)"
      />

      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

      <button className="btn-primary" disabled={loading}>
        {loading ? "Creating..." : "Create Short Link"}
      </button>
    </form>
  );
}

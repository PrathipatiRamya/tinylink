"use client";

import { useEffect, useState } from "react";
import AnalyticsChart from "@/components/AnalyticsChart";

export default function StatsPage({ params }) {
  const { code } = params;
  const [link, setLink] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/links/${code}`);
      const data = await res.json();
      if (!data.error) setLink(data);
    };

    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [code]);

  if (!link) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      {/* Header Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #00C6FF, #0072FF)",
          padding: "18px 24px",
          borderRadius: "12px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ margin: 0 }}>{code}</h2>
        <button
          onClick={() =>
            navigator.clipboard.writeText(window.location.origin + "/" + code)
          }
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            color: "white",
            fontWeight: "600",
          }}
        >
          Copy Link 🔗
        </button>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        <MetricCard label="Total Clicks" value={link.clicks} />
        <MetricCard
          label="Last Clicked"
          value={
            link.last_clicked
              ? new Date(link.last_clicked).toLocaleString()
              : "Never"
          }
        />
        <MetricCard
          label="Created"
          value={new Date(link.created_at).toLocaleString()}
        />
      </div>

      {/* Chart */}
      <div
        style={{
          padding: "20px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <AnalyticsChart code={code} />
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "16px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
        transition: "transform 0.2s",
      }}
    >
      <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>{label}</p>
      <h3 style={{ marginTop: "8px", fontSize: "22px", color: "#0F172A" }}>
        {value}
      </h3>
    </div>
  );
}

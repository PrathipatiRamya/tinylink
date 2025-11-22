"use client";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

export default function AnalyticsChart({ code }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/links/${code}/analytics`)
      .then((res) => res.json())
      .then(setData);
  }, [code]);

  if (!data.length) {
    return <p style={{ color: "#555" }}>No click data yet.</p>;
  }

  const labels = data.map((d) => d.day);
  const clicks = data.map((d) => Number(d.clicks));

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: 10 }}>Click Analytics</h3>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Clicks",
              data: clicks,
              borderColor: "#007bff",
              tension: 0.4,
            },
          ],
        }}
      />
    </div>
  );
}

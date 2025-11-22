"use client";

import { useEffect, useState } from "react";
import LinkForm from "@/components/LinkForm";
import LinksTable from "@/components/LinksTable";

export default function Home() {
  const [links, setLinks] = useState([]);

  async function loadLinks() {
    const res = await fetch("/api/links");
    setLinks(await res.json());
  }

  useEffect(() => {
    loadLinks();

    const interval = setInterval(loadLinks, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1 className="hero-title">TinyLink ⚡</h1>

      <div className="card" style={{ marginBottom: "25px" }}>
        <LinkForm onCreated={loadLinks} />
      </div>

      <LinksTable links={links} onDeleted={loadLinks} />
    </div>
  );
}

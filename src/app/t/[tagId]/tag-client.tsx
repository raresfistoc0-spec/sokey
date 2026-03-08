"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function TagClient({ tagId }: { tagId: string }) {
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);

  const [spotifyLink, setSpotifyLink] = useState("");
  const [pin, setPin] = useState("");

  const [username, setUsername] = useState("");
  const [savedUsername, setSavedUsername] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editSpotifyLink, setEditSpotifyLink] = useState("");
  const [editPin, setEditPin] = useState("");

  const safeTag = useMemo(() => (tagId || "").toString().trim(), [tagId]);

  useEffect(() => {
    async function load() {
      setError("");
      setSuccess("");
      setLoading(true);

      try {
        const res = await fetch(`/api/tags/${safeTag}`);
        const data = await res.json();

        if (!data.exists) {
          setExists(false);
          return;
        }

        const link = (data.spotifyLink || "").toString();
        const u = (data.username || "").toString();

        setExists(true);
        setSpotifyLink(link);
        setSavedUsername(u);
        setEditSpotifyLink(link);
      } catch (e) {
        console.error(e);
        setError("Eroare la încărcare.");
        setExists(false);
      } finally {
        setLoading(false);
      }
    }

    if (safeTag && safeTag !== "undefined") {
      load();
    } else {
      setError("Tag invalid.");
      setLoading(false);
    }
  }, [safeTag]);

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [exists, editMode, safeTag]);

  function isSpotifyUrl(url: string) {
    try {
      const u = new URL(url);
      return (
        u.hostname.includes("spotify.com") ||
        u.hostname.includes("open.spotify.com")
      );
    } catch {
      return false;
    }
  }

  async function activate() {
    setError("");
    setSuccess("");

    const link = spotifyLink.trim();
    const p = pin.trim();
    const u = username.trim();

    if (!u) return setError("Introdu un username");
    if (!link) return setError("Lipsește link-ul spotify");
    if (!isSpotifyUrl(link)) return setError("Link invalid");
    if (!p) return setError("Lipsește PIN-ul");
    if (p.length < 4) return setError("PIN-ul conține minim 4 caractere");

    try {
      const res = await fetch(`/api/tags/${safeTag}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spotifyLink: link,
          pin: p,
          username: u,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Eroare la salvare.");
        return;
      }

      setExists(true);
      setSavedUsername(u);
      setPin("");
    } catch (e) {
      console.error(e);
      setError("Eroare la salvare.");
    }
  }

  async function updateLink() {
    setError("");
    setSuccess("");

    const link = editSpotifyLink.trim();
    const p = editPin.trim();

    if (!link) return setError("Lipsește link-ul Spotify");
    if (!isSpotifyUrl(link)) return setError("Link invalid");
    if (!p) return setError("Introdu PIN-ul");

    try {
      const res = await fetch(`/api/tags/${safeTag}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spotifyLink: link,
          pin: p,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Eroare la actualizare");
        return;
      }

      setSpotifyLink(link);
      setEditPin("");
      setEditMode(false);
    } catch (e) {
      console.error(e);
      setError("Eroare la actualizare");
    }
  }

  const S: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(1200px 800px at 50% -10%, #1e293b 0%, #0f172a 40%, #000000 85%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily:
        "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
      color: "#f1f5f9",
    },

    card: {
      width: "100%",
      maxWidth: 420,
      padding: 40,
      background: "transparent",
      borderRadius: 0,
      backdropFilter: "none",
      boxShadow: "none",
      display: "flex",
      flexDirection: "column",
      gap: 24,
    },

    section: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
    },

    input: {
      width: "100%",
      padding: 14,
      borderRadius: 16,
      border: "1px solid rgba(0,0,0,0.15)",
      background: "#ffffff",
      color: "#0f172a",
      fontSize: 14,
      outline: "none",
    },

    helper: {
      fontSize: 12,
      opacity: 0.6,
      textAlign: "left",
    },

    btnPrimary: {
      width: "100%",
      padding: 18,
      borderRadius: 26,
      border: "none",
      background: "#1DB954",
      color: "white",
      fontWeight: 800,
      fontSize: 16,
      cursor: "pointer",
      boxShadow: "0 0 50px rgba(29,185,84,0.55)",
    },

    btnGhost: {
      width: "100%",
      padding: 16,
      borderRadius: 24,
      border: "1px solid rgba(255,255,255,0.15)",
      background: "transparent",
      color: "#cbd5e1",
      fontWeight: 600,
      cursor: "pointer",
    },
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* UI identic cu al tău */}
      </div>
    </div>
  );
}
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

        setExists(true);
        setSpotifyLink(data.spotifyLink || "");
        setSavedUsername(data.username || "");
        setEditSpotifyLink(data.spotifyLink || "");
      } catch (e) {
        console.error(e);
        setError("Eroare la încărcare.");
        setExists(false);
      } finally {
        setLoading(false);
      }
    }

    if (safeTag && safeTag !== "undefined") load();
  }, [safeTag]);

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [exists, editMode, safeTag]);

  function isSpotifyUrl(url: string) {
    try {
      const u = new URL(url);
      return u.hostname.includes("spotify.com");
    } catch {
      return false;
    }
  }

  async function activate() {
    setError("");

    const link = spotifyLink.trim();
    const p = pin.trim();
    const u = username.trim();

    if (!u) return setError("Introdu username");
    if (!isSpotifyUrl(link)) return setError("Link Spotify invalid");
    if (p.length < 4) return setError("PIN minim 4 caractere");

    try {
      const res = await fetch(`/api/tags/${safeTag}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotifyLink: link,
          pin: p,
          username: u,
        }),
      });

      const data = await res.json();

      if (!data.success) return setError(data.error);

      setExists(true);
      setSavedUsername(u);
      setPin("");
    } catch {
      setError("Eroare la salvare");
    }
  }

  async function updateLink() {
    setError("");

    const link = editSpotifyLink.trim();
    const p = editPin.trim();

    if (!isSpotifyUrl(link)) return setError("Link invalid");
    if (!p) return setError("PIN necesar");

    try {
      const res = await fetch(`/api/tags/${safeTag}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotifyLink: link,
          pin: p,
        }),
      });

      const data = await res.json();

      if (!data.success) return setError(data.error);

      setSpotifyLink(link);
      setEditPin("");
      setEditMode(false);
    } catch {
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
      color: "#f1f5f9",
    },

    card: {
      width: "100%",
      maxWidth: 420,
      padding: 40,
      display: "flex",
      flexDirection: "column",
      gap: 24,
    },

    input: {
      width: "100%",
      padding: 14,
      borderRadius: 16,
      border: "1px solid rgba(0,0,0,0.15)",
      background: "#ffffff",
      color: "#0f172a",
    },

    btn: {
      width: "100%",
      padding: 18,
      borderRadius: 26,
      border: "none",
      background: "#1DB954",
      color: "white",
      fontWeight: 800,
      cursor: "pointer",
    },
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <Image
          src="/logo1.png"
          alt="logo"
          width={100}
          height={100}
          style={{ margin: "0 auto" }}
        />

        <h1 style={{ textAlign: "center", fontSize: 34 }}>
          {savedUsername || username || "SOKEY"}
        </h1>

        {error && <div style={{ color: "red" }}>{error}</div>}

        {!exists ? (
          <>
            <input
              style={S.input}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              style={S.input}
              placeholder="Link Spotify"
              value={spotifyLink}
              onChange={(e) => setSpotifyLink(e.target.value)}
            />

            <input
              style={S.input}
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />

            <button style={S.btn} onClick={activate}>
              Activează
            </button>
          </>
        ) : (
          <>
            <button
              style={S.btn}
              onClick={() => (window.location.href = spotifyLink)}
            >
              Deschide Spotify
            </button>

            <button onClick={() => setEditMode(!editMode)}>
              Modifică link
            </button>

            {editMode && (
              <>
                <input
                  style={S.input}
                  value={editSpotifyLink}
                  onChange={(e) => setEditSpotifyLink(e.target.value)}
                />

                <input
                  style={S.input}
                  type="password"
                  placeholder="PIN"
                  value={editPin}
                  onChange={(e) => setEditPin(e.target.value)}
                />

                <button style={S.btn} onClick={updateLink}>
                  Salvează
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function TagClient({
  tagId,
  initialExists,
  initialSpotifyLink,
  initialUsername,
}: {
  tagId: string;
  initialExists: boolean;
  initialSpotifyLink: string;
  initialUsername: string;
}) {

  
  const [exists,setExists] = useState(initialExists);

  const [spotifyLink,setSpotifyLink] = useState(initialSpotifyLink);
  const [pin,setPin] = useState("");

  const [username,setUsername] = useState("");
  const [savedUsername,setSavedUsername] = useState(initialUsername);

  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");

  const [editMode,setEditMode] = useState(false);
  const [editSpotifyLink,setEditSpotifyLink] = useState(initialSpotifyLink);
  const [editPin,setEditPin] = useState("");
  const safeTag = tagId.trim();

  async function safeJson(res:Response){
    try{
      return await res.json();
    }catch{
      const txt = await res.text();
      console.error(txt);
      throw new Error("Server error");
    }
  }


  function isSpotifyUrl(url:string){
    try{
      const u = new URL(url);
      return u.hostname.includes("spotify.com");
    }catch{
      return false;
    }
  }

  useEffect(() => {
  setError("");
  setSuccess("");
}, [exists, editMode, safeTag]);

  async function activate(){

    setError("");

    const link = spotifyLink.trim();
    const p = pin.trim();
    const u = username.trim();

    if(!u) return setError("Introdu username");
    if(!isSpotifyUrl(link)) return setError("Link Spotify invalid");
    if(p.length < 4) return setError("PIN minim 4 caractere");

    try{

      const res = await fetch(`/api/tags/${safeTag}`,{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          spotifyLink:link,
          pin:p,
          username:u
        })
      });

      const data = await safeJson(res);

      if(!res.ok || !data.success){
        setError(data.error || "Server error");
        return;
      }

      setExists(true);
      setSavedUsername(u);
      setPin("");

    }catch(e){

      console.error(e);
      setError("Eroare la salvare");

    }
  }

  async function updateLink(){

    setError("");

    const link = editSpotifyLink.trim();
    const p = editPin.trim();

    if(!isSpotifyUrl(link)) return setError("Link invalid");
    if(!p) return setError("PIN necesar");

    try{

      const res = await fetch(`/api/tags/${safeTag}`,{
        method:"PUT",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          spotifyLink:link,
          pin:p
        })
      });

      const data = await safeJson(res);

      if(!res.ok || !data.success){
        setError(data.error || "Server error");
        return;
      }

      setSpotifyLink(link);
      setEditPin("");
      setEditMode(false);

    }catch(e){

      console.error(e);
      setError("Eroare la actualizare");

    }
  }


  const S:Record<string,React.CSSProperties> = {

    page:{
      minHeight:"100vh",
      background:"radial-gradient(1200px 800px at 50% -10%, #1e293b 0%, #0f172a 40%, #000000 85%)",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      padding:24,
      fontFamily:"ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
      color:"#f1f5f9"
    },

    card:{
      width:"100%",
      maxWidth:420,
      padding:40,
      display:"flex",
      flexDirection:"column",
      gap:24
    },

    section:{
      display:"flex",
      flexDirection:"column",
      gap:14
    },

    input:{
      width:"100%",
      padding:14,
      borderRadius:16,
      border:"1px solid rgba(0,0,0,0.15)",
      background:"#ffffff",
      color:"#0f172a",
      fontSize:14
    },

    helper:{
      fontSize:12,
      opacity:0.6
    },

    btnPrimary:{
      width:"100%",
      padding:18,
      borderRadius:26,
      border:"none",
      background:"#1DB954",
      color:"white",
      fontWeight:800,
      fontSize:16,
      cursor:"pointer",
      boxShadow:"0 0 50px rgba(29,185,84,0.55)"
    },

    btnGhost:{
      width:"100%",
      padding:16,
      borderRadius:24,
      border:"1px solid rgba(255,255,255,0.15)",
      background:"transparent",
      color:"#cbd5e1",
      fontWeight:600,
      cursor:"pointer"
    }

  };


  return (

    <div style={S.page}>
      <div style={S.card}>


        {/* LOGO + USERNAME */}

        <div style={{...S.section,alignItems:"center",textAlign:"center",position:"relative"}}>

          <div
  style={{
    position:"absolute",
    width:240,
    height:240,
    background:"radial-gradient(circle, rgba(29,185,84,0.35) 0%, rgba(29,185,84,0.15) 40%, transparent 70%)",
    filter:"blur(70px)",
    borderRadius:"50%",
    transform:"translateZ(0)",
    willChange:"transform",
    pointerEvents:"none"
  }}
/>

          <Image
            src="/logo1.png"
            alt="Logo"
            width={100}
            height={100}
            style={{
              zIndex:1,
              filter:"brightness(1.5) contrast(1.2) drop-shadow(0 0 30px rgba(29,185,84,0.7))"
            }}
          />
      

          <div
            style={{
              fontSize:38,
              fontWeight:900,
              letterSpacing:2,
              fontFamily:"'Poppins','Montserrat',sans-serif",
              background:"linear-gradient(90deg,#1DB954,#4ade80,#22d3ee)",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
              textShadow:"0 0 35px rgba(29,185,84,0.4)"
            }}
          >
            {savedUsername || username || "SOKEY"}
          </div>

        </div>

        {success && <div style={{color:"#4ade80"}}>{success}</div>}
{error && (
  <div style={{
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(15,23,42,0.9)",
    color: "#f87171",
    padding: "12px 18px",
    borderRadius: 16,
    fontWeight: 600,
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
    border: "1px solid rgba(248,113,113,0.3)",
    backdropFilter: "blur(10px)",
    zIndex: 9999
  }}>
    {error}
  </div>
)}


        {!exists ? (

          <>
            <div style={S.section}>
              <div>Username</div>
              <input
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                placeholder="Ex: sokey"
                style={S.input}
              />
            </div>

            <div style={S.section}>
              <div>Link Spotify</div>
              <input
                value={spotifyLink}
                onChange={(e)=>setSpotifyLink(e.target.value)}
                placeholder="https://open.spotify.com/track/..."
                style={S.input}
              />
            </div>
            

            <div style={S.section}>
              <div>PIN</div>
              <input
                value={pin}
                onChange={(e)=>setPin(e.target.value)}
                type="password"
                placeholder="Minim 4 caractere"
                style={S.input}
              />
              <div style={S.helper}>
                PIN-ul este necesar pentru modificări ulterioare
              </div>
            </div>

            <button onClick={activate} style={S.btnPrimary}>
              Activează & Salvează
            </button>

          </>

        ) : (

          <>
            <button
              onClick={()=>spotifyLink && (window.location.href = spotifyLink)}
              style={S.btnPrimary}
            >
              Deschide Spotify
            </button>

            <button
              onClick={()=>setEditMode(!editMode)}
              style={S.btnGhost}
            >
              {editMode ? "Renunță" : "Modifică link-ul"}
            </button>

            {editMode && (

              <>
                <div style={S.section}>
                  <div>Link nou Spotify</div>
                  <input
                    value={editSpotifyLink}
                    onChange={(e)=>setEditSpotifyLink(e.target.value)}
                    style={S.input}
                  />
                </div>

                <div style={S.section}>
                  <div>PIN</div>
                  <input
                    value={editPin}
                    onChange={(e)=>setEditPin(e.target.value)}
                    type="password"
                    style={S.input}
                  />
                </div>

                <button onClick={updateLink} style={S.btnPrimary}>
                  Salvează modificarea
                </button>

              </>
            )}

          </>

        )}

      </div>
    </div>

  );

}
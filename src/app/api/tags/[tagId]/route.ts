import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import bcrypt from "bcryptjs";

type TagDoc = {
  spotifyLink?: string;
  pinHash?: string;
  username?: string;
  createdAt?: any;
  updatedAt?: any;
};
export async function GET(
  _req: Request,
  context: { params: Promise<{ tagId: string }> }
) {
  const p = await context.params;
  const tagId = (p?.tagId ?? "").toString().trim();

  if (!tagId) {
    return NextResponse.json({ error: "Tag invalid" }, { status: 400 });
  }

  const ref = db.collection("tags").doc(tagId);
  const snap = await ref.get();

  if (!snap.exists) {
    return NextResponse.json({
      exists: false,
      spotifyLink: "",
      username: "",
    });
  }

  const data = snap.data() as TagDoc;

  return NextResponse.json({
    exists: true,
    spotifyLink: (data.spotifyLink || "").toString(),
    username: (data.username || "").toString(),
  });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ tagId: string }> }
) {
  const p = await context.params;
  const tagId = (p?.tagId ?? "").toString().trim();

  if (!tagId) {
    return NextResponse.json({ error: "Tag invalid" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const spotifyLink = (body.spotifyLink || "").toString().trim();
  const pin = (body.pin || "").toString().trim();
  const username = (body.username || "").toString().trim();

  if (!spotifyLink) {
    return NextResponse.json({ error: "Link-ul Spotify lipsește" }, { status: 400 });
  }

  if (!pin) {
    return NextResponse.json({ error: "PIN-ul lipsește" }, { status: 400 });
  }

  if (pin.length < 4) {
    return NextResponse.json(
      { error: "PIN incorect" },
      { status: 400 }
    );
  }

  const ref = db.collection("tags").doc(tagId);
  const snap = await ref.get();

  // 🔥 CREARE TAG (prima activare)
  if (!snap.exists) {
    if (!username) {
      return NextResponse.json(
        { error: "Username obligatoriu la activare" },
        { status: 400 }
      );
    }

    const pinHash = await bcrypt.hash(pin, 10);

    await ref.set({
      spotifyLink,
      pinHash,
      username, // 🔥 salvăm username
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ ok: true, mode: "created" });
  }

  // 🔥 UPDATE DOAR LINK (username NU se modifică)
  const data = snap.data() as TagDoc;
  const pinHash = (data.pinHash || "").toString();

  if (!pinHash) {
    return NextResponse.json(
      { error: "Tag-ul există, dar nu are PIN setat" },
      { status: 400 }
    );
  }

  const ok = await bcrypt.compare(pin, pinHash);
  if (!ok) {
    return NextResponse.json({ error: "PIN incorect" }, { status: 403 });
  }

  await ref.update({
    spotifyLink,
    updatedAt: new Date(),
  });

  return NextResponse.json({ ok: true, mode: "updated" });
}
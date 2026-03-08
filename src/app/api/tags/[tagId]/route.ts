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
  context: { params: { tagId: string } }
) {
  const tagId = (context.params?.tagId ?? "").toString().trim();

  if (!tagId) {
    return NextResponse.json({ success: false, error: "Tag invalid" }, { status: 400 });
  }

  try {
    const ref = db.collection("tags").doc(tagId);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({
        success: true,
        exists: false,
        spotifyLink: "",
        username: "",
      });
    }

    const data = snap.data() as TagDoc;

    return NextResponse.json({
      success: true,
      exists: true,
      spotifyLink: (data.spotifyLink || "").toString(),
      username: (data.username || "").toString(),
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Eroare server" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: { tagId: string } }
) {
  const tagId = (context.params?.tagId ?? "").toString().trim();

  if (!tagId) {
    return NextResponse.json({ success: false, error: "Tag invalid" }, { status: 400 });
  }

  try {

    const body = await req.json().catch(() => ({}));

    const spotifyLink = (body?.spotifyLink || "").toString().trim();
    const pin = (body?.pin || "").toString().trim();
    const username = (body?.username || "").toString().trim();

    if (!spotifyLink) {
      return NextResponse.json(
        { success: false, error: "Link Spotify lipsă" },
        { status: 400 }
      );
    }

    if (!pin || pin.length < 4) {
      return NextResponse.json(
        { success: false, error: "PIN invalid" },
        { status: 400 }
      );
    }

    const ref = db.collection("tags").doc(tagId);
    const snap = await ref.get();

    // 🔥 CREARE TAG
    if (!snap.exists) {

      if (!username) {
        return NextResponse.json(
          { success: false, error: "Username obligatoriu" },
          { status: 400 }
        );
      }

      const pinHash = await bcrypt.hash(pin, 10);

      await ref.set({
        spotifyLink,
        pinHash,
        username,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        mode: "created",
      });
    }

    // 🔥 UPDATE LINK EXISTENT

    const data = snap.data() as TagDoc;

    const pinHash = (data?.pinHash || "").toString();

    if (!pinHash) {
      return NextResponse.json(
        { success: false, error: "PIN lipsă în DB" },
        { status: 400 }
      );
    }

    const ok = await bcrypt.compare(pin, pinHash);

    if (!ok) {
      return NextResponse.json(
        { success: false, error: "PIN incorect" },
        { status: 403 }
      );
    }

    await ref.update({
      spotifyLink,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      mode: "updated",
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, error: "Eroare server" },
      { status: 500 }
    );
  }
}
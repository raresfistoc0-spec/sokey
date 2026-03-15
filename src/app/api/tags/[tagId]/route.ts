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

// =========================
// GET TAG
// =========================

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tagId: string }> }
) {

  const { tagId } = await params;

  const cleanTag = tagId?.toString().trim();

  if (!cleanTag) {
    return NextResponse.json(
      { success: false, error: "Tag invalid" },
      { status: 400 }
    );
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
      spotifyLink: data.spotifyLink || "",
      username: data.username || "",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, error: "Eroare server" },
      { status: 500 }
    );
  }
}

// =========================
// CREATE TAG
// =========================

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tagId: string }> }
) {

  const { tagId } = await params;

  const cleanTag = tagId?.toString().trim();

  try {
    const body = await req.json();

    const spotifyLink = body?.spotifyLink?.toString().trim();
    const pin = body?.pin?.toString().trim();
    const username = body?.username?.toString().trim();

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

    // CREATE TAG
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

    // UPDATE EXISTING TAG

    const data = snap.data() as TagDoc;

    const pinHash = data?.pinHash;

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

// =========================
// UPDATE TAG
// =========================

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ tagId: string }> }
) {

  const { tagId } = await params;

  const cleanTag = tagId?.toString().trim();

  try {
    const body = await req.json();

    const spotifyLink = body?.spotifyLink?.toString().trim();
    const pin = body?.pin?.toString().trim();

    if (!spotifyLink) {
      return NextResponse.json(
        { success: false, error: "Link Spotify lipsă" },
        { status: 400 }
      );
    }

    if (!pin) {
      return NextResponse.json(
        { success: false, error: "PIN lipsă" },
        { status: 400 }
      );
    }

    const ref = db.collection("tags").doc(tagId);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json(
        { success: false, error: "Tag-ul nu există" },
        { status: 404 }
      );
    }

    const data = snap.data() as TagDoc;

    const ok = await bcrypt.compare(pin, data.pinHash || "");

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
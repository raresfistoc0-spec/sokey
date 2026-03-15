import TagClient from "./tag-client";
import { db } from "@/lib/firebaseAdmin";

export default async function Page({
  params,
}: {
  params: Promise<{ tagId: string }>;
}) {

  const { tagId } = await params;

  let initialExists = false;
  let initialSpotifyLink = "";
  let initialUsername = "";

  try {

    const doc = await db.collection("tags").doc(tagId).get();

    if (doc.exists) {
      const data = doc.data();

      initialExists = true;
      initialSpotifyLink = data?.spotifyLink || "";
      initialUsername = data?.username || "";
    }

  } catch (e) {
    console.error("Firebase error:", e);
  }

  return (
    <TagClient
      tagId={tagId}
      initialExists={initialExists}
      initialSpotifyLink={initialSpotifyLink}
      initialUsername={initialUsername}
    />
  );
}
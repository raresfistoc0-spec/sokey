import TagClient from "./tag-client";
import { db } from "@/lib/firebaseAdmin";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ tagId: string }>;
}) {

  const { tagId } = await params;

  const ref = db.collection("tags").doc(tagId);
  const snap = await ref.get();

  if (snap.exists) {

    const data = snap.data();
    const spotifyLink = data?.spotifyLink;

    if (spotifyLink) {
      redirect(spotifyLink);
    }

  }

  return (
    <TagClient
      tagId={tagId}
      initialExists={false}
      initialSpotifyLink=""
      initialUsername=""
    />
  );
}
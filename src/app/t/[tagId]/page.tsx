import TagClient from "./tag-client";

export default async function Page({
  params,
}: {
  params: Promise<{ tagId: string }>;
}) {

  const { tagId } = await params;

  return <TagClient tagId={tagId} />;
}
import { PinyinPractice } from "@/components/PinyinPractice";

export const dynamic = "force-dynamic";

export default async function PinyinPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <PinyinPractice userId={userId} />;
}

import { DailyLesson } from "@/components/DailyLesson";

export const dynamic = "force-dynamic";

export default async function LearnPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <DailyLesson userId={userId} />;
}

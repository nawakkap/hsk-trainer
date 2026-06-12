import { notFound } from "next/navigation";
import { DailyLesson } from "@/components/DailyLesson";
import { curricula } from "@/lib/curriculum";
import type { Level } from "@/lib/curriculum/types";

export function generateStaticParams() {
  return [{ level: "hsk1" }, { level: "hsk3" }];
}

export default async function LearnPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  if (level !== "hsk1" && level !== "hsk3") notFound();
  const curriculum = curricula[level as Level];
  return <DailyLesson curriculum={curriculum} />;
}

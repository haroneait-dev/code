import { ogImage, ogSize, ogContentType } from "@/lib/og";
import { curriculum } from "@/lib/curriculum";

export const alt = "Leçon — Claude Mastery";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return curriculum.flatMap((mod) =>
    mod.lessons.map((l) => ({ moduleId: mod.id, lessonId: l.id }))
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;
  const mod = curriculum.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);

  return ogImage({
    badge: mod?.title ?? "Formation",
    title: lesson?.title ?? "Formation Claude Code",
    subtitle: lesson?.intro,
    kind: "leçon",
  });
}

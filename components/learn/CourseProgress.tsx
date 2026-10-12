"use client";

import { useEffect, useState } from "react";
import { Meter, StepProgress } from "@/components/ui/motion";

const KEY = "cm-lecons-terminees";
const EVENT = "cm-lecons-change";
let memory: string[] = [];
function read(): string[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(data) ? data.filter((id): id is string => typeof id === "string") : [];
  } catch { return memory; }
}

export function useCourseProgress() {
  const [done, setDone] = useState<string[]>([]);
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    const update = () => setDone(read());
    update();
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener(EVENT, update); window.removeEventListener("storage", update); };
  }, []);
  function toggle(id: string) {
    const current = read();
    memory = current.includes(id) ? current.filter(value => value !== id) : [...current, id];
    try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch { setAvailable(false); }
    window.dispatchEvent(new Event(EVENT));
  }
  return { done, toggle, available };
}

export function CourseProgress({ ids, segmented = false }: { ids: string[]; segmented?: boolean }) {
  const { done } = useCourseProgress();
  const count = ids.filter(id => done.includes(id)).length;
  return <div className="space-y-3">
    <p className="text-small text-on-surface-variant" aria-live="polite">{count} / {ids.length} leçons terminées</p>
    {segmented ? <StepProgress current={count} total={ids.length} /> : <Meter value={ids.length ? count / ids.length : 0} />}
  </div>;
}

export function LessonCompletion({ id }: { id: string }) {
  const { done, toggle, available } = useCourseProgress();
  return <div className="mt-8 border-t border-outline-variant pt-6">
    <label className="inline-flex items-center gap-3 min-h-11 cursor-pointer text-body font-semibold">
      <input type="checkbox" checked={done.includes(id)} onChange={() => toggle(id)} className="w-5 h-5 accent-primary" />
      Leçon terminée
    </label>
    <p className="text-small text-on-surface-variant">Votre progression reste dans ce navigateur. Rien n’est envoyé.</p>
    {!available && <p className="text-small text-error" role="status">Le stockage est indisponible. Votre progression sera conservée uniquement pendant cette visite.</p>}
  </div>;
}

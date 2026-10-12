import { Lightbulb, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { LessonSection, Exercise } from "@/lib/curriculum";

const CALLOUT_ICONS = {
  tip: Lightbulb,
  info: Info,
  warn: AlertTriangle,
  success: CheckCircle2,
};

const CALLOUT_COLOR = { tip: "rgb(var(--c-tertiary))", info: "rgb(var(--c-on-surface-variant))", warn: "rgb(var(--c-error))", success: "rgb(var(--c-primary))" };

export function LessonSectionRenderer({
  section,
}: {
  section: LessonSection;
}) {
  return (
    <div className="space-y-5">
      {section.heading && (
        <h2
          className="text-h2 font-headline-lg  font-semibold mt-10 pb-2 border-b border-outline-variant text-on-surface scroll-mt-24"
          id={slugify(section.heading)}
        >
          {section.heading}
        </h2>
      )}

      {section.body && (
        <p
          className="font-body-rt text-body-rt text-on-surface leading-[1.7]"
          dangerouslySetInnerHTML={{ __html: section.body }}
        />
      )}

      {section.bullets && section.bullets.length > 0 && (
        <ul className="space-y-2">
          {section.bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-3 text-body-rt text-on-surface leading-[1.7]"
            >
              <span className="w-1.5 h-1.5 rounded bg-on-surface-variant mt-2.5 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: b }} />
            </li>
          ))}
        </ul>
      )}

      {section.code && <CodeBlock {...section.code} />}

      {section.callout && (
        <CalloutBox
          type={section.callout.type}
          icon={section.callout.icon}
          text={section.callout.text}
        />
      )}

      {section.table && <Table {...section.table} />}

      {section.keypoints && section.keypoints.length > 0 && (
        <div className="bg-primary-fixed/20 border border-primary-fixed-dim/40 rounded-lg p-5">
          <h4 className="font-semibold text-primary mb-3 text-small uppercase tracking-wider">
            Points clés
          </h4>
          <ul className="space-y-2">
            {section.keypoints.map((k, i) => (
              <li
                key={i}
                className="flex gap-3 text-body-sm text-on-surface leading-[1.7]"
              >
                <CheckCircle2
                  className="w-4 h-4 text-primary mt-0.5 shrink-0"
                  strokeWidth={1.75}
                />
                <span dangerouslySetInnerHTML={{ __html: k }} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CodeBlock({
  lang,
  label,
  code,
}: {
  lang: string;
  label?: string;
  code: string;
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 border-b border-outline-variant">
        <span className="text-small font-code-md text-on-surface-variant">
          {label ?? lang}
        </span>
      </div>
      <pre className="font-code-md text-code-md text-on-surface overflow-x-auto p-4">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function CalloutBox({
  type,
  text,
}: {
  type: keyof typeof CALLOUT_ICONS;
  icon: string;
  text: string;
}) {
  const Icon = CALLOUT_ICONS[type] ?? Info;
  const color = CALLOUT_COLOR[type] ?? "rgb(var(--c-primary))";
  return (
    <div
      className="rounded-lg p-5"
      style={{
        backgroundColor: "rgb(var(--c-surface-container-low))",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div className="flex items-start gap-3">
        <Icon
          className="w-5 h-5 mt-0.5 shrink-0"
          style={{ color }}
          strokeWidth={1.75}
        />
        <p
          className="font-body-sm text-on-surface-variant m-0"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto border border-outline-variant rounded-lg">
      <table className="w-full text-small">
        <thead className="bg-surface-container-low">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left px-3 py-2 border-b border-outline-variant text-on-surface-variant font-semibold text-small uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-outline-variant/60">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2 text-on-surface"
                  dangerouslySetInnerHTML={{
                    __html:
                      ci === 0
                        ? `<code class="font-code-md text-small text-primary">${cell}</code>`
                        : cell,
                  }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ExerciseList({ exercises }: { exercises: Exercise[] }) {
  return (
    <div className="mt-12 pt-8 border-t border-outline-variant">
      <h3 className="text-h3 font-headline-lg  text-on-surface mb-6">
        Exercices
      </h3>
      <ol className="space-y-4">
        {exercises.map((ex, i) => (
          <li
            key={i}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5"
          >
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-small text-on-surface-variant font-code-md">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-small uppercase tracking-wider font-semibold px-2 py-0.5 rounded"
                style={{
                  backgroundColor: levelBg(ex.level),
                  color: levelColor(ex.level),
                }}
              >
                {ex.level}
              </span>
            </div>
            <h4 className="font-body-rt text-body-rt font-semibold text-on-surface mb-1">
              {ex.title}
            </h4>
            <p className="text-body-sm text-on-surface-variant leading-[1.7]">
              {ex.description}
            </p>
            <details className="mt-3 group">
              <summary className="text-small text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors select-none">
                Indice
              </summary>
              <div className="mt-2 p-3 rounded bg-surface-container-low border-l-2 border-on-surface-variant/30 text-small text-on-surface-variant leading-[1.7]">
                {ex.hint}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}

function levelBg(level: Exercise["level"]) {
  switch (level) {
    case "débutant":
      return "rgb(var(--c-green-soft))";
    case "intermédiaire":
      return "rgb(var(--c-mark))";
    case "avancé":
      return "rgb(var(--c-error-container))";
  }
}
function levelColor(level: Exercise["level"]) {
  switch (level) {
    case "débutant":
      return "rgb(var(--c-on-surface))";
    case "intermédiaire":
      return "rgb(var(--c-on-primary-fixed))";
    case "avancé":
      return "rgb(var(--c-on-error-container))";
  }
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

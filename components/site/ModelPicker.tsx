"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { MODELS } from "@/lib/models";

const TASKS = [
  { label: "Tri, résumés, extraction", tier: 0 },
  { label: "Rédaction, code courant", tier: 1 },
  { label: "Code complexe, agents", tier: 2 },
  { label: "Problèmes très difficiles", tier: 3 },
];
const VOLUMES = [1, 10, 50, 200, 1000, 5000, 20000];
const INPUTS = [1000, 5000, 20000, 100000, 300000];
const OUTPUTS = [300, 1000, 3000, 8000];

const fmtTok = (n: number) => (n >= 1000 ? `${n / 1000}K` : `${n}`);
const fmtEur = (n: number) =>
  n < 1 ? `${n.toFixed(2).replace(".", ",")} $` : `${Math.round(n).toLocaleString("fr-FR")} $`;

function Slider({ label, values, index, onChange, format }: { label: string; values: number[]; index: number; onChange: (i: number) => void; format: (n: number) => string }) {
  return (
    <label className="block">
      <span className="flex justify-between text-[15px] mb-2">
        <span className="text-on-surface-variant">{label}</span>
        <span className="font-mono font-semibold text-on-surface tabular-nums">{format(values[index])}</span>
      </span>
      <input type="range" min={0} max={values.length - 1} step={1} value={index} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[rgb(var(--c-primary))]" />
    </label>
  );
}

export function ModelPicker() {
  const [tier, setTier] = useState(1);
  const [vol, setVol] = useState(2);
  const [inp, setInp] = useState(1);
  const [out, setOut] = useState(1);

  const { pick, costs, max } = useMemo(() => {
    let t = tier;
    if (INPUTS[inp] > 200000 && t === 0) t = 1; // Haiku : 200K de contexte au plus
    const costs = MODELS.map((m) => ({
      m,
      monthly: (VOLUMES[vol] * 30 * (INPUTS[inp] * m.input + OUTPUTS[out] * m.output)) / 1e6,
      fits: INPUTS[inp] <= m.context * 1000,
    }));
    return { pick: MODELS[t], costs, max: Math.max(...costs.map((c) => c.monthly)) };
  }, [tier, vol, inp, out]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
      <div className="rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-6 md:p-8 space-y-7">
        <div>
          <p className="text-[15px] text-on-surface-variant mb-3">Ce que vous demandez surtout</p>
          <div className="grid grid-cols-2 gap-2">
            {TASKS.map((t) => (
              <button
                key={t.tier}
                type="button"
                onClick={() => setTier(t.tier)}
                aria-pressed={tier === t.tier}
                className={`text-left text-[14px] leading-snug rounded-md border px-3 py-2.5 transition-colors ${tier === t.tier ? "border-primary bg-primary text-on-primary" : "border-outline-variant hover:border-on-surface"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <Slider label="Demandes par jour" values={VOLUMES} index={vol} onChange={setVol} format={(n) => n.toLocaleString("fr-FR")} />
        <Slider label="Texte envoyé par demande (tokens)" values={INPUTS} index={inp} onChange={setInp} format={fmtTok} />
        <Slider label="Longueur des réponses (tokens)" values={OUTPUTS} index={out} onChange={setOut} format={fmtTok} />
        <p className="text-[13px] text-on-surface-variant leading-relaxed">
          1 000 tokens ≈ 750 mots. Ces prix concernent l'API. Avec un abonnement Claude (Pro, Max), vous ne payez pas au token.
        </p>
      </div>

      <div className="rounded-lg border-[1.5px] border-on-surface bg-surface-container-low p-6 md:p-8 shadow-[6px_6px_0_rgb(var(--c-mark))]">
        <p className="font-mono text-[13px] text-on-surface-variant mb-2">Notre conseil</p>
        <motion.p key={pick.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-headline-lg text-[34px] md:text-[42px] leading-none font-extrabold text-on-surface mb-3">
          <span className="text-mark">{pick.name}</span>
        </motion.p>
        <p className="text-[16px] text-on-surface-variant leading-relaxed mb-6">{pick.pitch}</p>
        <p className="font-mono text-[13px] text-on-surface-variant mb-3">Coût estimé par mois</p>
        <div className="space-y-3 mb-6">
          {costs.map(({ m, monthly, fits }) => (
            <div key={m.id}>
              <div className="flex justify-between text-[14px] mb-1">
                <span className={m.id === pick.id ? "font-bold text-on-surface" : "text-on-surface-variant"}>{m.name}</span>
                <span className="font-mono tabular-nums">{fits ? fmtEur(monthly) : "contexte trop court"}</span>
              </div>
              <div className="h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${m.id === pick.id ? "bg-primary" : "bg-[rgb(var(--c-on-surface-variant)/0.35)]"}`}
                  animate={{ width: fits ? `${Math.max(2, (monthly / max) * 100)}%` : "0%" }}
                  transition={{ type: "spring", stiffness: 180, damping: 24 }}
                />
              </div>
            </div>
          ))}
        </div>
        <Link href={pick.href} className="inline-flex items-center gap-2 font-semibold text-primary">
          Tout savoir sur {pick.name} <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

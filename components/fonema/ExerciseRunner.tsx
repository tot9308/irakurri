"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { OptionTile } from "@/components/ui/OptionTile";

const V = ["a","e","i","o","u"];

export function ExerciseRunner({ phoneme, exerciseNumber, onComplete }: { phoneme: string; exerciseNumber: number; onComplete: () => void }) {
  const syls = V.map(v => phoneme + v);
  const [phase, setPhase] = useState<"intro"|"active"|"done">("intro");
  const [fb, setFb] = useState<"correct"|"wrong"|null>(null);
  const [sel, setSel] = useState<string|null>(null);
  const [tgt, setTgt] = useState("");
  const [opts, setOpts] = useState<string[]>([]);
  const play = (s: string) => console.log("Audio:", s);

  const pick = () => {
    const t = syls[Math.floor(Math.random()*syls.length)];
    setTgt(t);
    const o = syls.filter(s => s!==t);
    setOpts([t,...o.sort(()=>0.5-Math.random()).slice(0,2)].sort(()=>0.5-Math.random()));
    setSel(null); setFb(null); setPhase("active");
  };

  const selOpt = (v: string) => {
    if (fb !== null) return;
    setSel(v);
    const ok = v === tgt;
    setFb(ok?"correct":"wrong");
    play(tgt);
  };

  const nxt = () => { setFb(null); setSel(null); setPhase("done"); };
  const fin = () => onComplete();

  if (exerciseNumber === 1) {
    return (
      <div className="min-h-screen p-8 max-w-2xl mx-auto text-center">
        <div className="card">
          <div className="text-9xl font-bold text-primary-600 mb-2">{phoneme.toUpperCase()}</div>
          <div className="text-6xl font-bold text-neutral-700 mb-4">{phoneme}</div>
          <p className="text-lg text-neutral-600 mb-8">Fonema <strong>{phoneme}</strong>. Escoltu.</p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" onClick={() => play(phoneme)} size="lg">Soinua</Button>
            {phase==="done" ? <Button onClick={fin} size="lg">Hurrengoa</Button> : <Button onClick={()=>setPhase("done")} size="lg">Entendido</Button>}
          </div>
        </div>
      </div>
    );
  }

  if (exerciseNumber === 2) {
    return (
      <div className="min-h-screen p-8 max-w-3xl mx-auto">
        <div className="card text-center">
          <p className="text-neutral-600 mb-6">Klikatu silaba bakoitza:</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {syls.map(s => (
              <div key={s} className="touch-target rounded-2xl border-2 p-4 text-3xl font-bold border-neutral-300 bg-white text-neutral-800 hover:border-primary-400 hover:bg-primary-50" onClick={()=>play(s)}>{s}</div>
            ))}
          </div>
          <Button onClick={nxt} size="lg">Hurrengoa</Button>
        </div>
      </div>
    );
  }

  if (exerciseNumber === 3 || exerciseNumber === 4) {
    return (
      <div className="min-h-screen p-8 max-w-3xl mx-auto">
        <div className="card text-center">
          {phase==="intro" ? (
            <>
              <div className="text-6xl font-bold text-primary-600 mb-6">{tgt}</div>
              <p className="text-neutral-600 mb-8">Zergrafema aukeratu duzu?</p>
              <Button variant="secondary" onClick={pick} size="lg">Hasi</Button>
            </>
          ) : (
            <>
              <div className="text-6xl font-bold text-primary-600 mb-6">{tgt}</div>
              <p className="text-neutral-600 mb-8">Zergrafema aukeratu duzu?</p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {opts.map(o => {
                  const st = fb===null?"idle":o===tgt?"correct":o===sel?"wrong":"idle";
                  return <OptionTile key={o} value={o} label={o} state={st as any} onSelect={selOpt} disabled={fb!==null} />;
                })}
              </div>
              {fb!==null ? <div className="mt-6 flex justify-center"><Button variant="secondary" onClick={nxt} size="lg">{fb==="correct"?"Hurrengoa":"Saiatu berriro"}</Button></div> : <div className="mt-6 flex justify-center"><Button variant="secondary" onClick={()=>play(tgt)} size="lg">Soinua errepikatu</Button></div>}
            </>
          )}
        </div>
      </div>
    );
  }

  // 5
  return (
    <div className="min-h-screen p-8 max-w-md mx-auto text-center">
      <div className="card p-10">
        <div className="text-6xl text-emerald-500 mb-4">*</div>
        <h2 className="text-3xl font-bold mb-4">Fonema {phoneme} bukatuta!</h2>
        <p className="text-neutral-600 mb-8">Ejercicio 5 de 5 eginda.</p>
        <Button onClick={fin} size="lg" className="w-full">Hiru fonemara itzuli</Button>
      </div>
    </div>
  );
}
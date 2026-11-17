import * as React from "react";
import { Button } from "@/components/ui/Button";
import { OptionTile } from "@/components/ui/OptionTile";
import { itemsByPhoneme, allPhonemes } from "@/lib/catalog";

type Step =
  | "select-phoneme"
  | "presentation"
  | "practice"
  | "complete";

export default function InvitadoPage() {
  const [step, setStep] = React.useState<Step>("select-phoneme");
  const [phoneme, setPhoneme] = React.useState<string>("");
  const [items, setItems] = React.useState<{ grapheme: string; type: string }[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = React.useState({ correct: 0, total: 0 });

  const itemsForPhoneme = React.useMemo(() => itemsByPhoneme(phoneme), [phoneme]);

  React.useEffect(() => {
    const saved = localStorage.getItem(`irakurri-progress-${phoneme}`);
    if (saved) {
      try { setScore(JSON.parse(saved)); } catch {}
    }
  }, [phoneme]);

  const saveProgress = () => {
    localStorage.setItem(`irakurri-progress-${phoneme}`, JSON.stringify(score));
  };

  const handleSelectPhoneme = (p: string) => {
    setPhoneme(p);
    const items = itemsByPhoneme(p);
    const practiceItems = items.filter((i) => i.type === "presentation" || i.type === "syllable");
    setItems(practiceItems.map((i) => ({ grapheme: i.grapheme, type: i.type })));
    setStep("presentation");
    setCurrentIndex(0);
    setSelected(null);
    setFeedback(null);
  };

  const currentItem = items[currentIndex];

  const handleOptionSelect = (value: string) => {
    if (feedback !== null) return;
    setSelected(value);
    const isCorrect = value === currentItem.grapheme;
    setFeedback(isCorrect ? "correct" : "wrong");
    setScore((prev) => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
    saveProgress();
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setFeedback(null);
    } else {
      setStep("complete");
    }
  };

  const handleRepeat = () => {
    console.log("Repetir audio para:", currentItem?.grapheme);
  };

  if (step === "select-phoneme") {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6">Aukeratu fonema</h1>
          <p className="text-neutral-600 mb-8">Aukeratu fonemak nahi duzuntu eskaintza.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {allPhonemes().map((p) => (
              <button key={p} onClick={() => handleSelectPhoneme(p)}
                className="touch-target border-2 border-neutral-300 rounded-xl bg-white p-4 text-xl font-semibold text-neutral-700 hover:border-primary-400 hover:bg-primary-50 transition-colors">
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "presentation") {
    return (
      <div className="min-h-screen p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-9xl font-bold text-primary-600 mb-4 select-none">{currentItem.grapheme}</div>
          <p className="text-lg text-neutral-600 mb-8">Fonema <strong>{currentItem.grapheme}</strong>. Escoltu.</p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" onClick={handleRepeat} size="lg">Soinua errepikatu</Button>
            <Button onClick={handleNext} size="lg">Hurrengoa</Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "practice") {
    const options = [currentItem.grapheme, ...getDistractors(currentItem.grapheme, items)];
    return (
      <div className="min-h-screen p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-neutral-500">{currentIndex + 1} / {items.length}</span>
          <span className="text-sm font-medium text-neutral-700">{score.correct} / {score.total} zuzen</span>
        </div>
        <div className="card text-center">
          <div className="text-6xl font-bold text-primary-600 mb-6 select-none">{currentItem.grapheme}</div>
          <p className="text-neutral-600 mb-8">Zer grafema aukeratu duzu?</p>
          <Opciones
            correct={currentItem.grapheme}
            options={options}
            onSelect={handleOptionSelect}
            selected={selected}
            feedback={feedback}
          />
        </div>
        {feedback !== null && (
          <div className="mt-6 flex justify-center">
            <Button variant="secondary" onClick={handleNext}>{feedback === "correct" ? "Hurrengoa" : "Saiatu berriro"}</Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-md mx-auto text-center">
      <div className="card p-10">
        <div className="text-6xl text-emerald-500 mb-4">🎉</div>
        <h2 className="text-3xl font-bold mb-4">Saioa amaitu da!</h2>
        <p className="text-neutral-600 mb-6">{score.correct} / {score.total} zuzen.</p>
        <Button onClick={() => setStep("select-phoneme")} className="w-full">Berriro hasi</Button>
      </div>
    </div>
  );
}

function getDistractors(correct: string, allItems: { grapheme: string }[]): string[] {
  const others = allItems.filter((i) => i.grapheme !== correct);
  const sameFirst = others.filter((i) => i.grapheme[0] === correct[0]);
  const rest = others.filter((i) => i.grapheme[0] !== correct[0]);
  const picked = [...sameFirst, ...rest].sort(() => 0.5 - Math.random()).slice(0, 1).map((i) => i.grapheme);
  return picked;
}

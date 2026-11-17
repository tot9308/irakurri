import * as React from "react";

interface PresentacionFonemaProps {
  fonema: string;
  onContinue: () => void;
}

export function PresentacionFonema({ fonema, onContinue }: PresentacionFonemaProps) {
  return (
    <div className="card max-w-2xl mx-auto text-center">
      <div className="text-9xl font-bold text-primary-600 mb-4 select-none">
        {fonema}
      </div>
      <p className="text-lg text-neutral-600 mb-8">
        Fonema <strong>{fonema}</strong>. Escoltu eta irudia kontsulta.
      </p>
      <Button onClick={onContinue}>
        Hurrengoa
      </Button>
    </div>
  );
}

import { Button } from "@/components/ui/Button";

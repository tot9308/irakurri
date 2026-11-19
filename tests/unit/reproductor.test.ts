import { describe, expect, it } from "vitest";
import { pausaPractica } from "@/lib/leccion/reproductor";

describe("pausaPractica", () => {
  it("ajusta la pausa a la velocidad sin bajar del minimo", () => {
    expect(pausaPractica(1)).toBe(900);
    expect(pausaPractica(0.5)).toBe(1800);
    expect(pausaPractica(1.5)).toBe(600);
    expect(pausaPractica(0)).toBe(900);
    expect(pausaPractica(1, 1200)).toBe(1200);
  });
});

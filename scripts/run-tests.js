/**
 * scripts/run-tests.js
 * Ejecuta pruebas unitarias simples sin depender de vitest/esbuild.
 * Uso: node scripts/run-tests.js
 */

const { updateMastery, INITIAL_MASTERY } = require("../apps/web/lib/mastery");
const { itemsByPhoneme, allPhonemes } = require("../apps/web/lib/catalog");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    console.error(`  ❌ ${message}`);
    process.exitCode = 1;
  }
}

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    console.error(`  ❌ ${message} (esperado: ${JSON.stringify(expected)}, obtenido: ${JSON.stringify(actual)})`);
    process.exitCode = 1;
  }
}

console.log("\n🧪 Tests de Mastery\n");

assertEqual(
  INITIAL_MASTERY.state,
  "datu_zezena",
  "Estado inicial es datu_zezena"
);
assertEqual(INITIAL_MASTERY.attempts, 0, "0 intentos iniciales");

// Pasa a bidean con menos del 80%
let m = { ...INITIAL_MASTERY };
m = updateMastery(m, true);
m = updateMastery(m, false);
m = updateMastery(m, false);
m = updateMastery(m, false);
assertEqual(m.state, "bidean", "4 intentos con 25% acierto -> bidean");
assertEqual(m.attempts, 4, "4 intentos registrados");

// Pasa a lortuta con >=80%
m = { ...INITIAL_MASTERY };
m = updateMastery(m, true);
m = updateMastery(m, true);
m = updateMastery(m, true);
m = updateMastery(m, true);
assertEqual(m.state, "lortuta", "4 intentos con 100% acierto -> lortuta");
assertEqual(m.correct, 4, "4 correctos");

// Menos de 4 intentos mantiene datu_zezena
m = { ...INITIAL_MASTERY };
m = updateMastery(m, true);
m = updateMastery(m, true);
m = updateMastery(m, true);
assertEqual(m.state, "datu_zezena", "3 intentos -> datu_zezena");

// Leitner box se reinicia tras fallo
m = { ...INITIAL_MASTERY };
m = updateMastery(m, true);
m = updateMastery(m, true);
assertEqual(m.leitner_box, 3, "Leitner box = 3 tras 2 aciertos");
m = updateMastery(m, false);
assertEqual(m.leitner_box, 1, "Leitner box = 1 tras fallo");

console.log("\n🧪 Tests de Catalogo\n");

const phonemes = allPhonemes();
assert(phonemes.length > 0, "Hay fonemas en el catalogo");
assertEqual(phonemes[0], "m", "Primer fonema es m");

const mItems = itemsByPhoneme("m");
assert(mItems.length > 0, "Hay items para fonema m");
mItems.forEach((i) => assert(i.phoneme === "m", "Todos los items son de fonema m"));

const emptyItems = itemsByPhoneme("zzz");
assertEqual(emptyItems.length, 0, "Fonema inexistente devuelve array vacio");

console.log(`\n📊 Resultado: ${passed} pasados, ${failed} fallados\n`);

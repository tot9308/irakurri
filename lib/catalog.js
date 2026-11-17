"use strict";

const CATALOGUE_N1 = [
  { phoneme: "m", level: "N1", type: "presentation", grapheme: "m" },
  { phoneme: "m", level: "N1", type: "syllable", grapheme: "ma" },
  { phoneme: "m", level: "N1", type: "syllable", grapheme: "me" },
  { phoneme: "m", level: "N1", type: "syllable", grapheme: "mi" },
  { phoneme: "m", level: "N1", type: "syllable", grapheme: "mo" },
  { phoneme: "m", level: "N1", type: "syllable", grapheme: "mu" },
  { phoneme: "k", level: "N1", type: "presentation", grapheme: "k" },
  { phoneme: "k", level: "N1", type: "syllable", grapheme: "ka" },
  { phoneme: "k", level: "N1", type: "syllable", grapheme: "ke" },
  { phoneme: "k", level: "N1", type: "syllable", grapheme: "ki" },
  { phoneme: "k", level: "N1", type: "syllable", grapheme: "ko" },
  { phoneme: "k", level: "N1", type: "syllable", grapheme: "ku" },
  { phoneme: "t", level: "N1", type: "presentation", grapheme: "t" },
  { phoneme: "t", level: "N1", type: "syllable", grapheme: "ta" },
  { phoneme: "t", level: "N1", type: "syllable", grapheme: "te" },
  { phoneme: "t", level: "N1", type: "syllable", grapheme: "ti" },
  { phoneme: "t", level: "N1", type: "syllable", grapheme: "to" },
  { phoneme: "t", level: "N1", type: "syllable", grapheme: "tu" },
  { phoneme: "l", level: "N1", type: "presentation", grapheme: "l" },
  { phoneme: "l", level: "N1", type: "syllable", grapheme: "la" },
  { phoneme: "l", level: "N1", type: "syllable", grapheme: "le" },
  { phoneme: "l", level: "N1", type: "syllable", grapheme: "li" },
  { phoneme: "l", level: "N1", type: "syllable", grapheme: "lo" },
  { phoneme: "l", level: "N1", type: "syllable", grapheme: "lu" },
  { phoneme: "b", level: "N1", type: "presentation", grapheme: "b" },
  { phoneme: "b", level: "N1", type: "syllable", grapheme: "ba" },
  { phoneme: "b", level: "N1", type: "syllable", grapheme: "be" },
  { phoneme: "b", level: "N1", type: "syllable", grapheme: "bi" },
  { phoneme: "b", level: "N1", type: "syllable", grapheme: "bo" },
  { phoneme: "b", level: "N1", type: "syllable", grapheme: "bu" },
  { phoneme: "p", level: "N1", type: "presentation", grapheme: "p" },
  { phoneme: "p", level: "N1", type: "syllable", grapheme: "pa" },
  { phoneme: "p", level: "N1", type: "syllable", grapheme: "pe" },
  { phoneme: "p", level: "N1", type: "syllable", grapheme: "pi" },
  { phoneme: "p", level: "N1", type: "syllable", grapheme: "po" },
  { phoneme: "p", level: "N1", type: "syllable", grapheme: "pu" },
  { phoneme: "d", level: "N1", type: "presentation", grapheme: "d" },
  { phoneme: "d", level: "N1", type: "syllable", grapheme: "da" },
  { phoneme: "d", level: "N1", type: "syllable", grapheme: "de" },
  { phoneme: "d", level: "N1", type: "syllable", grapheme: "di" },
  { phoneme: "d", level: "N1", type: "syllable", grapheme: "do" },
  { phoneme: "d", level: "N1", type: "syllable", grapheme: "du" },
];

function itemsByPhoneme(phoneme) {
  return CATALOGUE_N1.filter((i) => i.phoneme === phoneme);
}

function allPhonemes() {
  return [...new Set(CATALOGUE_N1.map((i) => i.phoneme))];
}

module.exports = { itemsByPhoneme, allPhonemes, CATALOGUE_N1 };

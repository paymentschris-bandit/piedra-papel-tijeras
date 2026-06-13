import { writeFileSync } from "fs";
import { FULL_LOCALES } from "./i18n-packs.mjs";

let out = "/* Auto-generated — run: node generate-i18n-more.mjs */\n(function () {\n";
for (const [code, locale] of Object.entries(FULL_LOCALES)) {
  out += `  I18N_LOCALES["${code}"] = ${JSON.stringify(locale, null, 2)};\n`;
}
out += "})();\n";
writeFileSync("i18n-more-locales.js", out);
console.log(`Wrote i18n-more-locales.js (${Object.keys(FULL_LOCALES).length} locales)`);

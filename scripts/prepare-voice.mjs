import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
mkdirSync("tmp/voice", { recursive: true });
const lines = readFileSync("docs/demo-narration.txt", "utf8")
  .trim()
  .split("\n");
const durations = [];
for (let i = 0; i < lines.length; i++) {
  const voice = spawnSync("say", [
    "-v",
    "Samantha",
    "-r",
    "180",
    "-o",
    `tmp/voice/${i}.aiff`,
    lines[i],
  ]);
  if (voice.status) throw new Error("Voice generation failed");
  const probe = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=nw=1:nk=1",
      `tmp/voice/${i}.aiff`,
    ],
    { encoding: "utf8" },
  );
  durations.push(Number(probe.stdout));
}
writeFileSync("tmp/voice/durations.json", JSON.stringify(durations));
console.log("Prepared six local voice segments");

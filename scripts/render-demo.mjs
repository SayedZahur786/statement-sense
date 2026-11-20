import { createCanvas } from "@napi-rs/canvas";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const captions = [
  ["Where did your money go?", "One statement. A clearer monthly picture."],
  [
    "Choose a bank. Upload your PDF.",
    "80 invented transactions, clearly labelled.",
  ],
  [
    "Categories. Top merchants. A visible tie-out.",
    "Transfers stay separate from spending.",
  ],
  [
    "Spot subscription candidates.",
    "A familiar merchant is not proof of a subscription.",
  ],
  ["Search every transaction.", "Correct a category for this session."],
  [
    "Your PDF is not saved. No AI processing.",
    "Close the tab to clear your report.",
  ],
];
const { starts, total } = JSON.parse(
  readFileSync("tmp/video/timing.json", "utf8"),
);
mkdirSync("tmp/captions", { recursive: true });
let list = "";
for (let i = 0; i < captions.length; i++) {
  const c = createCanvas(1440, 130);
  const x = c.getContext("2d");
  x.fillStyle = "#153a2c";
  x.fillRect(0, 0, 1440, 130);
  x.textAlign = "center";
  x.fillStyle = "#fff";
  x.font = "bold 32px Arial";
  x.fillText(captions[i][0], 720, 48);
  x.font = "26px Arial";
  x.fillStyle = "#d6ed97";
  x.fillText(captions[i][1], 720, 94);
  writeFileSync(`tmp/captions/${i}.png`, c.toBuffer("image/png"));
  list += `file '${i}.png'\nduration ${(starts[i + 1] ?? total) - (i === 0 ? 0 : starts[i])}\n`;
}
list += "file '5.png'\n";
writeFileSync("tmp/captions/concat.txt", list);
const inputs = ["-i", "tmp/video/walkthrough.webm"];
for (let i = 0; i < 6; i++) inputs.push("-i", `tmp/voice/${i}.aiff`);
inputs.push("-f", "concat", "-safe", "0", "-i", "tmp/captions/concat.txt");
const audio =
  starts
    .map(
      (time, i) => `[${i + 1}:a]adelay=${Math.round(time * 1000)}:all=1[a${i}]`,
    )
    .join(";") +
  ";" +
  starts.map((_, i) => `[a${i}]`).join("") +
  "amix=inputs=6:normalize=0[audio]";
const result = spawnSync(
  "ffmpeg",
  [
    "-y",
    ...inputs,
    "-filter_complex",
    `[0:v]tpad=stop_mode=clone:stop_duration=8[v];[v][7:v]overlay=0:H-h:shortest=1[out];${audio}`,
    "-map",
    "[out]",
    "-map",
    "[audio]",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "23",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-t",
    String(total),
    "-movflags",
    "+faststart",
    "docs/demo.mp4",
  ],
  { stdio: "inherit" },
);
if (result.status) process.exit(result.status);
spawnSync(
  "ffmpeg",
  [
    "-y",
    "-ss",
    String(starts[2] + 1),
    "-i",
    "docs/demo.mp4",
    "-frames:v",
    "1",
    "-update",
    "1",
    "docs/demo-poster.jpg",
  ],
  { stdio: "inherit" },
);

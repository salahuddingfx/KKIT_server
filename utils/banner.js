"use strict";

// ─── ANSI color helpers ───────────────────────────────────────────────────────
const c = {
  reset:   "\x1b[0m",
  bold:    "\x1b[1m",
  dim:     "\x1b[2m",
  // Foreground
  red:     "\x1b[38;2;220;38;38m",
  redBr:   "\x1b[38;2;239;68;68m",
  white:   "\x1b[38;2;255;255;255m",
  grey:    "\x1b[38;2;113;113;122m",
  silver:  "\x1b[38;2;212;212;216m",
  green:   "\x1b[38;2;34;197;94m",
  yellow:  "\x1b[38;2;250;204;21m",
  blue:    "\x1b[38;2;96;165;250m",
  cyan:    "\x1b[38;2;34;211;238m",
  orange:  "\x1b[38;2;249;115;22m",
};

// ─── sleep helper ─────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── type a string character by character ────────────────────────────────────
async function typeWrite(text, delay = 18) {
  for (const ch of text) {
    process.stdout.write(ch);
    await sleep(delay);
  }
}

// ─── horizontal rule ─────────────────────────────────────────────────────────
const HR = c.dim + c.grey + "─".repeat(60) + c.reset;

// ─── ASCII wordmark ───────────────────────────────────────────────────────────
const LOGO = [
  c.red + c.bold + "  ██╗  ██╗██╗  ██╗██╗████████╗" + c.reset,
  c.red + c.bold + "  ██║ ██╔╝██║ ██╔╝██║╚══██╔══╝" + c.reset,
  c.redBr + c.bold + "  █████╔╝ █████╔╝ ██║   ██║   " + c.reset,
  c.redBr + c.bold + "  ██╔═██╗ ██╔═██╗ ██║   ██║   " + c.reset,
  c.white + c.bold + "  ██║  ██╗██║  ██╗██║   ██║   " + c.reset,
  c.white + c.bold + "  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   " + c.reset,
];

// ─── tag line ─────────────────────────────────────────────────────────────────
const TAGLINE =
  c.dim + c.grey + "  Premium Digital Solutions & Learning Platform" + c.reset;

// ─── info row helper ─────────────────────────────────────────────────────────
function infoRow(label, value, valueColor = c.white) {
  const lbl = c.grey + c.dim + label.padEnd(18) + c.reset;
  return `  ${lbl}${valueColor}${c.bold}${value}${c.reset}`;
}

// ─── spinning dot animation (runs while DB connects) ─────────────────────────
function startSpinner(label) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  const id = setInterval(() => {
    process.stdout.write(
      `\r  ${c.yellow}${frames[i % frames.length]}${c.reset}  ${c.grey}${label}${c.reset}   `
    );
    i++;
  }, 80);
  return () => {
    clearInterval(id);
    process.stdout.write("\r" + " ".repeat(60) + "\r"); // clear line
  };
}

// ─── main banner ─────────────────────────────────────────────────────────────
async function printBanner({ port, env, mongoHost }) {
  console.clear();

  // Logo — print each line with a tiny stagger
  for (const line of LOGO) {
    console.log(line);
    await sleep(55);
  }

  console.log(TAGLINE);
  await sleep(80);
  console.log();
  console.log(HR);
  await sleep(60);

  // Typing effect for the status section header
  process.stdout.write("\n");
  await typeWrite(c.silver + c.bold + "  SERVER READY" + c.reset + "\n", 30);
  await sleep(60);
  console.log(HR);
  await sleep(40);

  // Info rows with staggered reveal
  const rows = [
    infoRow("Environment", env.toUpperCase(),  env === "production" ? c.green : c.yellow),
    infoRow("Port",        port,                c.cyan),
    infoRow("Database",    mongoHost,           c.green),
    infoRow("API Base",    `/api/v1`,           c.blue),
    infoRow("Docs",        `/api/v1/health`,    c.blue),
    infoRow("Mode",        env === "production" ? "🔒  Production" : "🛠   Development", c.orange),
  ];

  for (const row of rows) {
    await sleep(55);
    console.log(row);
  }

  await sleep(60);
  console.log();
  console.log(HR);

  // Blinking ready prompt
  await sleep(120);
  process.stdout.write(
    "\n  " +
    c.red + c.bold + "▶" + c.reset + "  " +
    c.white + "Listening on " +
    c.cyan + c.bold + `http://localhost:${port}` +
    c.reset + "\n\n"
  );
}

module.exports = { printBanner, startSpinner };
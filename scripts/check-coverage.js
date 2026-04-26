#!/usr/bin/env bun

const threshold = Number(process.env.COVERAGE_MIN || "90");

const proc = Bun.spawnSync(["bun", "test", "--coverage"], {
  stdout: "pipe",
  stderr: "pipe",
});

const output = `${new TextDecoder().decode(proc.stdout)}${new TextDecoder().decode(proc.stderr)}`;
process.stdout.write(output);

if (proc.exitCode !== 0) {
  console.error("Coverage check aborted because tests failed.");
  process.exit(proc.exitCode);
}

const match = output.match(/All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/);
if (!match) {
  console.error("Could not parse coverage summary from bun output.");
  process.exit(1);
}

const funcs = Number(match[1]);
const lines = Number(match[2]);

if (Number.isNaN(funcs) || Number.isNaN(lines)) {
  console.error("Coverage summary contains invalid numeric values.");
  process.exit(1);
}

if (funcs < threshold || lines < threshold) {
  console.error(
    `Coverage threshold not met. Required: ${threshold}% funcs/lines. Got funcs=${funcs}%, lines=${lines}%`
  );
  process.exit(1);
}

console.log(
  `Coverage threshold met. funcs=${funcs}%, lines=${lines}%, min=${threshold}%`
);

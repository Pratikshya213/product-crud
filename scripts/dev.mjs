import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const backendDir = join(root, "backend");
const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
const jsonServerBin = join(backendDir, "node_modules", "json-server", "lib", "cli", "bin.js");
const children = [];
const isWindows = process.platform === "win32";
let shuttingDown = false;

function stopChildren(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  setTimeout(() => process.exit(exitCode), 300);
}

function start(command, args, cwd) {
  const child = spawn(command, args, { cwd, stdio: "inherit", windowsHide: true });
  children.push(child);
  child.on("error", (error) => {
    console.error(`Could not start ${command}: ${error.message}`);
    stopChildren(1);
  });
  child.on("exit", (code) => {
    if (!shuttingDown) stopChildren(code ?? 1);
  });
  return child;
}

async function apiIsAlreadyRunning() {
  try {
    const response = await fetch("http://localhost:5000/products", {
      signal: AbortSignal.timeout(1000),
    });
    if (!response.ok) return false;
    return Array.isArray(await response.json());
  } catch {
    return false;
  }
}

process.on("SIGINT", () => stopChildren(0));
process.on("SIGTERM", () => stopChildren(0));

if (!existsSync(nextBin)) {
  console.error("Frontend dependencies are missing. Run npm install first.");
  process.exit(1);
}

if (!(await apiIsAlreadyRunning())) {
  if (!existsSync(jsonServerBin)) {
    console.error("Backend dependencies are missing. Run npm install in the backend folder first.");
    process.exit(1);
  }
  console.log("Starting the local products API on http://localhost:5000 …");
  start(process.execPath, [jsonServerBin, "--watch", "db.json", "--port", "5000"], backendDir);
}

console.log("Starting the Next.js app …");
start(process.execPath, [nextBin, "dev"], root);

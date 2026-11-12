import { existsSync, mkdirSync, openSync, closeSync } from "node:fs";
import { dirname, resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env");
let connection = process.env.DATABASE_URL;

if (!connection && existsSync(envPath)) {
  const envFile = await import("node:fs").then(({ readFileSync }) => readFileSync(envPath, "utf8"));
  const value = envFile.match(/^\s*DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1];
  connection = value?.trim();
}

if (!connection?.startsWith("file:")) {
  throw new Error("DATABASE_URL muss für die lokale Entwicklung auf eine SQLite-Datei zeigen.");
}

const databasePath = connection.slice("file:".length).split("?")[0];
const absolutePath = resolve(process.cwd(), "prisma", databasePath);
mkdirSync(dirname(absolutePath), { recursive: true });

if (!existsSync(absolutePath)) {
  const descriptor = openSync(absolutePath, "wx");
  closeSync(descriptor);
  console.log("Leere SQLite-Datenbank vorbereitet.");
}

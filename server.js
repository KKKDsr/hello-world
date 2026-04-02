import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

function safeJoin(baseDir, requestPath) {
  const normalized = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const resolved = path.join(baseDir, normalized);
  if (!resolved.startsWith(baseDir)) {
    return null;
  }
  return resolved;
}

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = safeJoin(publicDir, pathname);

  if (!filePath || !existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const fileStats = await stat(filePath);
  if (fileStats.isDirectory()) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  const extension = path.extname(filePath);
  res.writeHead(200, {
    "Content-Type": mimeTypes[extension] || "application/octet-stream"
  });
  createReadStream(filePath).pipe(res);
}).listen(port, () => {
  console.log(`Snake game available at http://localhost:${port}`);
});

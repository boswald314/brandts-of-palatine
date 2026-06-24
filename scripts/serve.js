#!/usr/bin/env node
/* Tiny static file server for the built site. Usage: node scripts/serve.js [port]
   Serves the public/ directory. Pretty-URL friendly: /menu -> menu.html. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "public");
const PORT = Number(process.argv[2] || process.env.PORT || 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".JPG": "image/jpeg",
  ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff": "font/woff", ".woff2": "font/woff2", ".otf": "font/otf", ".ttf": "font/ttf",
};

function send(res, code, body, type) {
  res.writeHead(code, { "Content-Type": type || "text/plain" });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  const tryPaths = [urlPath];
  if (!path.extname(urlPath)) {
    tryPaths.push(urlPath + ".html", path.join(urlPath, "index.html"));
  }

  for (const p of tryPaths) {
    const filePath = path.join(ROOT, p);
    if (filePath.startsWith(ROOT) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const type = TYPES[path.extname(filePath)] || "application/octet-stream";
      return send(res, 200, fs.readFileSync(filePath), type);
    }
  }

  const notFound = path.join(ROOT, "404.html");
  if (fs.existsSync(notFound)) return send(res, 404, fs.readFileSync(notFound), TYPES[".html"]);
  send(res, 404, "Not found");
});

server.listen(PORT, () => {
  console.log(`Brandt's site running at http://localhost:${PORT}`);
});

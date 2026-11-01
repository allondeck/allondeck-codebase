/**
 * Standalone Automated Test Script for Client-Side Image Compression
 *
 * Runs headless Chrome against real canvas-based compression routines,
 * tests multiple simulated and real image payloads, and outputs benchmark metrics.
 */

import { exec } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import ts from "typescript";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Verify Chrome exists
if (!fs.existsSync(CHROME_PATH)) {
  console.error("❌ Google Chrome not found at:", CHROME_PATH);
  process.exit(1);
}

// Transpile imageUtils.ts to plain ES2022 JavaScript
const tsSource = fs.readFileSync("src/lib/imageUtils.ts", "utf8");
const transpiledJs = ts.transpileModule(tsSource, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
}).outputText;

const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<div id="status">Benchmarking image compression...</div>
<script type="module">
${transpiledJs.replace(/export /g, "")}

async function runBenchmarks() {
  const results = [];

  function makeCanvasImage(width, height, pattern = "gradient") {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (pattern === "gradient") {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#032b37");
      grad.addColorStop(0.5, "#00bcd4");
      grad.addColorStop(1, "#f35a10");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      for (let x = 0; x < width; x += 40) {
        for (let y = 0; y < height; y += 40) {
          ctx.fillStyle = "rgba(255,255,255,0.2)";
          ctx.beginPath();
          ctx.arc(x + 20, y + 20, 15, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (pattern === "noise") {
      const imgData = ctx.createImageData(width, height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = (Math.random() * 256) | 0;
        imgData.data[i + 1] = (Math.random() * 256) | 0;
        imgData.data[i + 2] = (Math.random() * 256) | 0;
        imgData.data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
    }
    return canvas;
  }

  async function canvasToFile(canvas, filename, type, quality = 0.95) {
    return new Promise((res) => {
      canvas.toBlob((blob) => {
        res(new File([blob], filename, { type, lastModified: Date.now() }));
      }, type, quality);
    });
  }

  // Test Case 1: High-Res DSLR Photo (3200x2400 JPEG)
  {
    const canvas = makeCanvasImage(3200, 2400, "gradient");
    const rawFile = await canvasToFile(canvas, "deck_installation_dslr.jpg", "image/jpeg", 0.98);
    const start = performance.now();
    const compressed = await compressImageForUpload(rawFile);
    const timeMs = Math.round(performance.now() - start);

    results.push({
      scenario: "3200x2400 DSLR Photo (JPEG)",
      originalName: rawFile.name,
      originalSizeKb: Math.round(rawFile.size / 1024),
      compressedName: compressed.name,
      compressedSizeKb: Math.round(compressed.size / 1024),
      outputType: compressed.type,
      savingsPct: Math.round((1 - compressed.size / rawFile.size) * 100),
      passed: compressed.size <= 280 * 1024 && compressed.type === "image/webp",
      timeMs,
    });
  }

  // Test Case 2: Full HD Phone Photo (1920x1080 PNG)
  {
    const canvas = makeCanvasImage(1920, 1080, "gradient");
    const rawFile = await canvasToFile(canvas, "marine_mat_texture.png", "image/png");
    const start = performance.now();
    const compressed = await compressImageForUpload(rawFile);
    const timeMs = Math.round(performance.now() - start);

    results.push({
      scenario: "1920x1080 Phone Photo (PNG)",
      originalName: rawFile.name,
      originalSizeKb: Math.round(rawFile.size / 1024),
      compressedName: compressed.name,
      compressedSizeKb: Math.round(compressed.size / 1024),
      outputType: compressed.type,
      savingsPct: Math.round((1 - compressed.size / rawFile.size) * 100),
      passed: compressed.size <= 280 * 1024 && compressed.type === "image/webp",
      timeMs,
    });
  }

  // Test Case 3: High Entropy Textured Surface (2000x2000 Noise)
  {
    const canvas = makeCanvasImage(2000, 2000, "noise");
    const rawFile = await canvasToFile(canvas, "non_skid_deck_foam.jpg", "image/jpeg", 0.99);
    const start = performance.now();
    const compressed = await compressImageForUpload(rawFile);
    const timeMs = Math.round(performance.now() - start);

    results.push({
      scenario: "2000x2000 Textured Surface (Noisy)",
      originalName: rawFile.name,
      originalSizeKb: Math.round(rawFile.size / 1024),
      compressedName: compressed.name,
      compressedSizeKb: Math.round(compressed.size / 1024),
      outputType: compressed.type,
      savingsPct: Math.round((1 - compressed.size / rawFile.size) * 100),
      passed: compressed.size <= 280 * 1024 && compressed.type === "image/webp",
      timeMs,
    });
  }

  // Test Case 4: Pre-optimized WebP under 280KB (Should bypass)
  {
    const canvas = makeCanvasImage(400, 300, "gradient");
    const rawFile = await canvasToFile(canvas, "pre_optimized.webp", "image/webp", 0.8);
    const start = performance.now();
    const compressed = await compressImageForUpload(rawFile);
    const timeMs = Math.round(performance.now() - start);

    results.push({
      scenario: "Pre-optimized WebP (Bypass)",
      originalName: rawFile.name,
      originalSizeKb: Math.round(rawFile.size / 1024),
      compressedName: compressed.name,
      compressedSizeKb: Math.round(compressed.size / 1024),
      outputType: compressed.type,
      savingsPct: 0,
      passed: compressed.size === rawFile.size && compressed.name === rawFile.name,
      timeMs,
    });
  }

  // Test Case 5: SVG Vector File (Should bypass untouched)
  {
    const svgFile = new File(['<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"/>'], "company_badge.svg", {
      type: "image/svg+xml",
    });
    const start = performance.now();
    const compressed = await compressImageForUpload(svgFile);
    const timeMs = Math.round(performance.now() - start);

    results.push({
      scenario: "Vector SVG Logo (Bypass)",
      originalName: svgFile.name,
      originalSizeKb: (svgFile.size / 1024).toFixed(2),
      compressedName: compressed.name,
      compressedSizeKb: (compressed.size / 1024).toFixed(2),
      outputType: compressed.type,
      savingsPct: 0,
      passed: compressed.name === "company_badge.svg" && compressed.type === "image/svg+xml",
      timeMs,
    });
  }

  // Test Case 6: Animated GIF (Should bypass untouched)
  {
    const gifFile = new File(["GIF89a_fake_data"], "boat_reel.gif", { type: "image/gif" });
    const start = performance.now();
    const compressed = await compressImageForUpload(gifFile);
    const timeMs = Math.round(performance.now() - start);

    results.push({
      scenario: "Animated GIF Reel (Bypass)",
      originalName: gifFile.name,
      originalSizeKb: (gifFile.size / 1024).toFixed(2),
      compressedName: compressed.name,
      compressedSizeKb: (compressed.size / 1024).toFixed(2),
      outputType: compressed.type,
      savingsPct: 0,
      passed: compressed.name === "boat_reel.gif" && compressed.type === "image/gif",
      timeMs,
    });
  }

  await fetch("/done", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(results),
  });
}

runBenchmarks();
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlContent);
  } else if (req.url === "/done" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      res.writeHead(200);
      res.end("OK");
      handleResults(JSON.parse(body));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(0, "127.0.0.1", () => {
  const port = server.address().port;
  console.log("\n🚀 Starting Client-Side Image Compression Headless Test...");
  console.log(`   Local Server: http://127.0.0.1:${port}`);
  console.log("   Browser: Google Chrome (Headless Engine)");

  const chromeCmd = `"${CHROME_PATH}" --headless=new --disable-gpu "http://127.0.0.1:${port}"`;
  exec(chromeCmd, () => {});
});

function handleResults(results) {
  server.close();

  console.log("\n==========================================================================================");
  console.log("                       IMAGE COMPRESSION BENCHMARK REPORT                                  ");
  console.log("==========================================================================================");
  console.log(
    "Status | Scenario                             | Original   | Compressed | Reduction | Format | Latency"
  );
  console.log(
    "-------+--------------------------------------+------------+------------+-----------+--------+--------"
  );

  let allPassed = true;
  for (const r of results) {
    const status = r.passed ? "  ✅   " : "  ❌   ";
    if (!r.passed) allPassed = false;
    const scen = r.scenario.padEnd(36);
    const orig = `${r.originalSizeKb} KB`.padStart(10);
    const comp = `${r.compressedSizeKb} KB`.padStart(10);
    const sav = `${r.savingsPct}%`.padStart(9);
    const fmt = r.outputType.replace("image/", "").padStart(6);
    const lat = `${r.timeMs}ms`.padStart(7);

    console.log(`${status}| ${scen} | ${orig} | ${comp} | ${sav} | ${fmt} | ${lat}`);
  }
  console.log("==========================================================================================\n");

  if (allPassed) {
    console.log("🎉 ALL TESTS PASSED! Every upload scenario met its constraints (<280KB, WebP, bypasses).\n");
    process.exit(0);
  } else {
    console.error("❌ Some tests failed to meet target constraints.\n");
    process.exit(1);
  }
}

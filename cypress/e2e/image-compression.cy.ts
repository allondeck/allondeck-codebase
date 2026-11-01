import { compressImageForUpload, getSupabaseImageTransformUrl } from "../../src/lib/imageUtils";

describe("Client-Side Image Compression & Upload Flow Suite", () => {
  // Helper to create synthetic image files with different entropy/patterns
  function createTestImageFile(
    width: number,
    height: number,
    name: string,
    mimeType: string,
    quality = 0.95,
    highNoise = false
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      if (highNoise) {
        // High entropy noise to test multi-pass compression under 280KB
        const imgData = ctx.createImageData(width, height);
        for (let i = 0; i < imgData.data.length; i += 4) {
          imgData.data[i] = Math.floor(Math.random() * 256);
          imgData.data[i + 1] = Math.floor(Math.random() * 256);
          imgData.data[i + 2] = Math.floor(Math.random() * 256);
          imgData.data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
      } else {
        // Realistic gradient and marine shapes
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#0b253a");
        grad.addColorStop(0.5, "#00bcd4");
        grad.addColorStop(1, "#f35a10");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        for (let x = 0; x < width; x += 60) {
          for (let y = 0; y < height; y += 60) {
            ctx.fillStyle = `rgba(255, 255, 255, 0.25)`;
            ctx.fillRect(x, y, 40, 40);
          }
        }
      }

      canvas.toBlob(
        (blob) => {
          const file = new File([blob!], name, { type: mimeType, lastModified: Date.now() });
          resolve(file);
        },
        mimeType,
        quality
      );
    });
  }

  it("should generate proper Supabase transformed URLs with query params", () => {
    const url = "https://xyz.supabase.co/storage/v1/object/public/products/sample.jpg";
    const transformed = getSupabaseImageTransformUrl(url, {
      width: 400,
      height: 400,
      bucket: "products",
      quality: 80,
    });
    expect(transformed).to.include("/storage/v1/render/image/public/products/sample.jpg");
    expect(transformed).to.include("width=400");
    expect(transformed).to.include("height=400");
    expect(transformed).to.include("quality=80");
  });

  it("should leave local assets untouched when transform URL is requested", () => {
    const localUrl = "/assets/images/1.jpg";
    const result = getSupabaseImageTransformUrl(localUrl, { width: 300, height: 300 });
    expect(result).to.equal("/assets/images/1.jpg");
  });

  it("should compress a large JPEG (>2000px) down to <= 1600px WebP and under 280KB", async () => {
    const originalFile = await createTestImageFile(2500, 1875, "boat_deck_large.jpg", "image/jpeg", 0.98);
    const originalSizeKb = Math.round(originalFile.size / 1024);

    const startTime = performance.now();
    const compressed = await compressImageForUpload(originalFile, {
      maxWidth: 1600,
      maxHeight: 1600,
      maxSizeBytes: 280 * 1024,
    });
    const duration = Math.round(performance.now() - startTime);

    const compressedSizeKb = Math.round(compressed.size / 1024);

    expect(compressed.name).to.equal("boat_deck_large.webp");
    expect(compressed.type).to.equal("image/webp");
    expect(compressed.size).to.be.lte(280 * 1024);

    // Verify resulting image dimensions and aspect ratio
    const img = new Image();
    const objectUrl = URL.createObjectURL(compressed);
    await new Promise<void>((resolve) => {
      img.onload = () => {
        expect(img.width).to.be.lte(1600);
        expect(img.height).to.be.lte(1600);
        const ratio = img.width / img.height;
        expect(Math.abs(ratio - 2500 / 1875)).to.be.lessThan(0.02);
        URL.revokeObjectURL(objectUrl);
        resolve();
      };
      img.src = objectUrl;
    });

    cy.log(
      `✓ Compressed: ${originalSizeKb} KB -> ${compressedSizeKb} KB (-${Math.round(
        (1 - compressed.size / originalFile.size) * 100
      )}%) in ${duration}ms`
    );
  });

  it("should compress a high-res PNG into WebP under 280KB", async () => {
    const originalPng = await createTestImageFile(1800, 1200, "custom_flooring.png", "image/png");
    const compressed = await compressImageForUpload(originalPng);

    expect(compressed.name).to.equal("custom_flooring.webp");
    expect(compressed.type).to.equal("image/webp");
    expect(compressed.size).to.be.lte(280 * 1024);
  });

  it("should compress a high-entropy/noisy image under 280KB using multi-pass quality/scale reduction", async () => {
    // 2000x2000 pure random noise generates enormous file sizes that challenge compressors
    const noiseFile = await createTestImageFile(2000, 2000, "noisy_raw_texture.jpg", "image/jpeg", 0.99, true);

    const compressed = await compressImageForUpload(noiseFile, {
      maxWidth: 1600,
      maxHeight: 1600,
      maxSizeBytes: 280 * 1024,
    });

    expect(compressed.type).to.equal("image/webp");
    expect(compressed.size).to.be.lte(280 * 1024);
    expect(compressed.name).to.equal("noisy_raw_texture.webp");
  });

  it("should bypass SVG files and preserve original untouched", async () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="red"/></svg>`;
    const svgFile = new File([svgContent], "logo.svg", { type: "image/svg+xml" });

    const result = await compressImageForUpload(svgFile);
    expect(result.name).to.equal("logo.svg");
    expect(result.type).to.equal("image/svg+xml");
    expect(result.size).to.equal(svgFile.size);
  });

  it("should bypass animated GIF files and preserve original untouched", async () => {
    const gifFile = new File(["GIF89a...dummy"], "animation.gif", { type: "image/gif" });
    const result = await compressImageForUpload(gifFile);
    expect(result.name).to.equal("animation.gif");
    expect(result.type).to.equal("image/gif");
    expect(result.size).to.equal(gifFile.size);
  });

  it("should bypass WebP files that are already under 280KB", async () => {
    const smallWebp = await createTestImageFile(300, 200, "already_optimized.webp", "image/webp", 0.7);
    const result = await compressImageForUpload(smallWebp);
    expect(result.name).to.equal("already_optimized.webp");
    expect(result.type).to.equal("image/webp");
    expect(result.size).to.equal(smallWebp.size);
  });

  it("should handle corrupted or non-image files gracefully by returning original", async () => {
    const corruptedFile = new File(["not an image binary payload"], "corrupt.jpg", { type: "image/jpeg" });
    const result = await compressImageForUpload(corruptedFile);
    // Should gracefully fallback without crashing
    expect(result).to.exist;
    expect(result.name).to.equal("corrupt.jpg");
    expect(result.size).to.equal(corruptedFile.size);
  });

  it("simulates the full ProductForm upload pipeline", async () => {
    // 1. User picks a 3MB 2400x1800 raw camera photo
    const rawPhoto = await createTestImageFile(2400, 1800, "IMG_20261101_boat_deck.jpg", "image/jpeg", 0.99);
    expect(rawPhoto.size).to.be.greaterThan(500 * 1024);

    // 2. Form handler intercepts and compresses
    const compressed = await compressImageForUpload(rawPhoto);

    // 3. Form prepares storage path and extension
    const ext = compressed.name.split(".").pop() || "webp";
    const randomId = "test-uuid-12345";
    const storagePath = `${randomId}.${ext}`;

    expect(ext).to.equal("webp");
    expect(storagePath).to.equal("test-uuid-12345.webp");
    expect(compressed.size).to.be.lte(280 * 1024);
    expect(compressed.type).to.equal("image/webp");

    // 4. Verify file payload can be converted to ArrayBuffer (ready for Supabase Storage fetch/upload)
    const buffer = await compressed.arrayBuffer();
    expect(buffer.byteLength).to.equal(compressed.size);
    expect(buffer.byteLength).to.be.greaterThan(0);

    // 5. Verify public URL generation
    const mockPublicUrl = `https://demo.supabase.co/storage/v1/object/public/products/${storagePath}`;
    const transformUrl = getSupabaseImageTransformUrl(mockPublicUrl, {
      width: 400,
      height: 400,
      bucket: "products",
    });
    expect(transformUrl).to.include("/storage/v1/render/image/public/products/test-uuid-12345.webp");
  });
});

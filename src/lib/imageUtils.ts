/**
 * Image utilities for compression and Supabase storage transformations.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";

export interface ImageTransformOptions {
  width: number;
  height: number;
  bucket?: "products" | "store" | string;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
}

/**
 * Build a Supabase Storage image transform URL for smaller, WebP-delivered images.
 * Uses /storage/v1/render/image/public/ so Supabase can resize and serve WebP when supported.
 * If the URL is a local asset (/assets/...) or external URL, returns it unchanged.
 */
export function getSupabaseImageTransformUrl(
  url: string | null | undefined,
  options: ImageTransformOptions
): string {
  if (!url?.trim()) return "";
  
  // Local static asset (e.g. /assets/images/1.jpg)
  if (url.startsWith("/")) return url;

  let fullUrl = url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    if (SUPABASE_URL && options.bucket) {
      fullUrl = `${SUPABASE_URL}/storage/v1/object/public/${options.bucket}/${url.replace(/^\//, "")}`;
    } else {
      return url;
    }
  }

  // Regex to match any Supabase public object URL:
  // e.g. https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
  const objectRegex = /^(https:\/\/[^/]+\.supabase\.co)\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;
  const match = fullUrl.match(objectRegex);
  if (match) {
    const [, host, bucketName, filePath] = match;
    // Always prefer the currently configured SUPABASE_URL if set
    const baseHost = SUPABASE_URL || host;
    const bkt = options.bucket || bucketName;
    const params = new URLSearchParams({
      width: String(options.width),
      height: String(options.height),
    });
    if (options.quality) {
      params.set("quality", String(options.quality));
    }
    if (options.resize) {
      params.set("resize", options.resize);
    }
    return `${baseHost}/storage/v1/render/image/public/${bkt}/${filePath}?${params.toString()}`;
  }

  return fullUrl;
}

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number;
}

/**
 * Compresses an image in the browser before uploading.
 * Scales down to maxWidth/maxHeight (default 1600x1600), converts to WebP,
 * and ensures the resulting file is under maxSizeBytes (default 280KB).
 * Non-raster or non-compressible types (SVG, GIF) are returned untouched.
 */
export async function compressImageForUpload(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    maxSizeBytes = 280 * 1024, // 280 KB
  } = options;

  // Don't compress SVGs or animated GIFs
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  // If already WebP and already under the target size, no need to recompress
  if (file.type === "image/webp" && file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // Calculate aspect ratio scale
        const scale = Math.min(maxWidth / width, maxHeight / height, 1.0);
        const targetWidth = Math.max(1, Math.round(width * scale));
        const targetHeight = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const exportBlob = (q: number, type = "image/webp"): Promise<Blob | null> =>
          new Promise((res) => canvas.toBlob(res, type, q));

        let blob = await exportBlob(quality, "image/webp");

        // Fallback to image/jpeg if browser doesn't support WebP canvas export
        let outputType = "image/webp";
        let outputExt = "webp";
        if (!blob || blob.type !== "image/webp") {
          blob = await exportBlob(quality, "image/jpeg");
          outputType = "image/jpeg";
          outputExt = "jpg";
        }

        // If still exceeds maxSizeBytes, try lower quality
        if (blob && blob.size > maxSizeBytes) {
          const lowerBlob = await exportBlob(0.70, outputType);
          if (lowerBlob) blob = lowerBlob;
        }

        // If still exceeds maxSizeBytes, downscale further
        if (blob && blob.size > maxSizeBytes) {
          const smallerCanvas = document.createElement("canvas");
          const halfScale = 0.75;
          smallerCanvas.width = Math.round(targetWidth * halfScale);
          smallerCanvas.height = Math.round(targetHeight * halfScale);
          const sCtx = smallerCanvas.getContext("2d");
          if (sCtx) {
            sCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
            const smallerBlob = await new Promise<Blob | null>((res) =>
              smallerCanvas.toBlob(res, outputType, 0.70)
            );
            if (smallerBlob) blob = smallerBlob;
          }
        }

        if (!blob) {
          resolve(file);
          return;
        }

        const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        const compressedFile = new File([blob], `${baseName}.${outputExt}`, {
          type: outputType,
          lastModified: Date.now(),
        });

        resolve(compressedFile);
      } catch (err) {
        console.warn("Client-side image compression error, proceeding with original:", err);
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

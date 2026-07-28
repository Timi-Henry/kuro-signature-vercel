import { readFile } from "node:fs/promises";
import sharp from "sharp";

const COUNTER_URL =
  "https://www.counter12.com/img-7Azd5zZ0D8aYAxWZ-78.gif";

const BACKGROUND_URL = new URL(
  "../public/signature-bg.png",
  import.meta.url,
);

const COUNTER_POSITION = {
  left: 329,
  top: 58,
  width: 118,
  height: 43,
};

const NO_CACHE_HEADERS = {
  "Content-Type": "image/png",
  "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
  "X-Content-Type-Options": "nosniff",
};

async function getCounterImage() {
  const separator = COUNTER_URL.includes("?") ? "&" : "?";
  const response = await fetch(`${COUNTER_URL}${separator}v=${Date.now()}`, {
    cache: "no-store",
    headers: {
      Accept: "image/gif,image/*;q=0.9,*/*;q=0.8",
      "User-Agent": "Kuro-Torn-Signature/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Counter12 returned HTTP ${response.status}`);
  }

  const original = Buffer.from(await response.arrayBuffer());

  return sharp(original, { animated: false })
    .resize({
      width: COUNTER_POSITION.width,
      height: COUNTER_POSITION.height,
      fit: "fill",
      kernel: sharp.kernel.nearest,
    })
    .png()
    .toBuffer();
}

function offlineCounterSvg() {
  return Buffer.from(`
    <svg width="${COUNTER_POSITION.width}" height="${COUNTER_POSITION.height}"
         viewBox="0 0 ${COUNTER_POSITION.width} ${COUNTER_POSITION.height}"
         xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#050505"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
            fill="#eeeeee" font-family="monospace" font-size="19"
            letter-spacing="3">----</text>
    </svg>
  `);
}

async function renderSignature() {
  const background = await readFile(BACKGROUND_URL);

  let counter;
  try {
    counter = await getCounterImage();
  } catch (error) {
    console.error("Unable to retrieve Counter12 image:", error);
    counter = offlineCounterSvg();
  }

  return sharp(background)
    .composite([
      {
        input: counter,
        left: COUNTER_POSITION.left,
        top: COUNTER_POSITION.top,
      },
    ])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

export default {
  async fetch() {
    try {
      const image = await renderSignature();
      return new Response(image, {
        status: 200,
        headers: NO_CACHE_HEADERS,
      });
    } catch (error) {
      console.error("Signature generation failed:", error);
      return new Response("Unable to generate signature image.", {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }
  },
};

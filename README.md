# Kuro Torn Profile Signature

A ready-to-deploy Vercel project that serves a **780 × 150 PNG** containing:

- Kuro / JFK Misfits artwork
- “Welcome! You're Visitor”
- “Just Fer Killin”
- your existing Counter12 visitor counter

The live image endpoint is:

```text
https://YOUR-PROJECT.vercel.app/api/signature
```

## Fastest deployment: upload through GitHub

1. Create a new empty GitHub repository, for example `kuro-torn-signature`.
2. Upload every file and folder from this project, preserving the folder structure.
3. In Vercel, choose **Add New → Project**.
4. Import the GitHub repository.
5. Leave the framework preset as **Other** and deploy.
6. Open your Vercel project URL. The homepage shows the live banner and the exact Torn embed code.

Vercel will automatically redeploy whenever you push changes to the connected repository.

## Alternative: deploy with the Vercel CLI

From this project's folder:

```bash
npm install
npm install -g vercel
vercel --prod
```

Follow the prompts. The default answers are fine for this project.

## Add it to Torn

Open Torn's profile-signature editor, choose the `{}` source-code view, and paste:

```html
<img src="https://YOUR-PROJECT.vercel.app/api/signature" alt="Kuro — JFK Misfits visitor counter" style="width:100%;max-width:780px;height:auto;">
```

Replace `YOUR-PROJECT` with the name Vercel assigns to your deployment.

## Files

```text
kuro-signature-vercel/
├── api/
│   └── signature.js
├── public/
│   ├── signature-bg.png
│   └── signature-preview.png
├── index.html
├── package.json
└── README.md
```

## Change the artwork

Replace `public/signature-bg.png` with another **780 × 150 PNG**. Keep the counter panel in the same position, or edit `COUNTER_POSITION` in `api/signature.js`:

```js
const COUNTER_POSITION = {
  left: 329,
  top: 58,
  width: 118,
  height: 43,
};
```

## Change the Counter12 URL

Edit `COUNTER_URL` near the top of `api/signature.js`.

## How it works

Every request to `/api/signature`:

1. loads the background PNG;
2. requests the Counter12 GIF with caching disabled;
3. scales the counter using nearest-neighbour resizing to keep the pixel style sharp;
4. composites it into the counter panel;
5. returns a fresh PNG with no-cache response headers.

If Counter12 is temporarily unavailable, the image still loads and displays `----` in the number panel.

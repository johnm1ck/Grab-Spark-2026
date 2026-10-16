# GrabMerchant · Learn to Earn

A mobile-first React and TypeScript prototype

## Run

Requires Node.js 22.13 or later.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Select **Learn to Earn** in the Home shortcut grid, or visit `/#learn-to-earn` directly.

```sh
npm run build
npm run preview
```

On this workstation, if the system Node installation reports an OpenSSL configuration error, use the existing `webdev` conda environment:

```sh
conda activate webdev
npm run dev
```

```sh
npx playwright install firefox
npm run build
npm run test:browser
```

The browser check loads the production assets through Playwright request routing, so no development server or network access is required. It verifies phone layouts, activation, fees, review submission, results, persistence, and navigation. Screenshots are written to `artifacts/`.

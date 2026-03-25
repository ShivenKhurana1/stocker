# Stocker

this is a cool cool thing, you can now use AI to help visualize trends with your stocks, and add some to your own portfolio!!

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Neural Engine**: [TensorFlow.js](https://www.tensorflow.org/js) with native Node.js acceleration
- **Language**: TypeScript
- **Market Data**: [Yahoo Finance API](https://github.com/gadicc/node-yahoo-finance2)
- **Styling**: Tailwind CSS with custom Glassmorphism UI
- **State & Persistence**: React Hooks with LocalStorage integration

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

## Key Features

- **Neural Predictions**: Real-time training and inference on historical market data.
- **Portfolio Tracking**: Dynamic tracking of assets with "Held X days" and "Neural Targets".
- **Risk metrics**: Weighted neural forecasts and volatility alerts for diversified holdings.
- **Panoramic Chart**: High-fidelity SVG visualization with up to 180 days of history.
- **Quick-Add**: Instant asset entry via a dedicated market data API.

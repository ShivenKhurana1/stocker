"use client";

import Link from "next/link";

export default function DocsPage() {
  const sections = [
    {
      title: "1. What is a Ticker?",
      content: "A 'Ticker' is a short code used to identify a specific stock. For example, 'AAPL' is Apple, 'NVDA' is Nvidia, and 'TSLA' is Tesla. To start, just type one of these into the box on the main page."
    },
    {
      title: "2. The Forecast Horizon",
      content: "This is just a fancy way of saying: 'How many days into the future should the AI look?' If you set it to 7 days, the model will try to predict the price for next week. Shorter distances (like 3-7 days) are usually more accurate than longer ones."
    },
    {
      title: "3. How the AI Works",
      content: "When you click 'Predict', we train a small 'brain' (a Neural Network) specifically for that stock right in your browser. It looks at hundreds of days of history plus big-picture stuff like how the overall market and oil prices are moving."
    },
    {
      title: "4. Technical Indicators (Optional)",
      content: "If you want more detail, you can turn on EMA and RSI:\n\n• EMA (Exponential Moving Average): A smooth line that shows the general direction of the stock price. If the price is above the line, it's often a good sign.\n\n• RSI (Relative Strength Index): A scale from 0 to 100. If it's over 70, the stock might be 'overbought' (too hot). If it's under 30, it might be 'oversold' (cheaper than usual)."
    },
    {
      title: "5. Portfolio & P/L",
      content: "You can 'Add' stocks to your Portfolio to keep track of them. 'P/L' stands for Profit or Loss. We'll show you if you're up or down since you added it, and what our AI thinks the total value of your holdings will be soon."
    }
  ];

  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto pt-24">
      <header className="text-center mb-16 animate-fade-up">
        <p className="glass-pill mb-4 inline-flex border-white/20">New User Guide</p>
        <h1 className="text-4xl font-bold text-white mb-6 md:text-5xl">Welcome to <span className="text-cyan-400">Stocker</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          We use artificial intelligence to help you understand stock market trends. 
          Here is a simple guide to getting started.
        </p>
      </header>
      
      <div className="grid gap-6 md:gap-10">
        {sections.map((section, idx) => (
          <section key={idx} className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 animate-fade-up shadow-xl" style={{ animationDelay: `${idx * 100}ms` }}>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">{section.title}</h2>
            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">{section.content}</p>
          </section>
        ))}
      </div>

      <div className="mt-16 text-center animate-fade-up pb-10" style={{ animationDelay: '500ms' }}>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          Go Back to Lab
        </Link>
        <p className="mt-6 text-slate-500 text-[10px] uppercase tracking-[0.2em]">Note: Predictions are probabilistic experiments and not financial advice.</p>
      </div>
    </div>
  );
}

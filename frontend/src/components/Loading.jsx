import { useState, useEffect, useRef, useMemo } from 'react';
import { Check, Loader2, Search } from 'lucide-react';

const STAGES = [
  'Initializing',
  'Gathering sources',
  'Processing repositories',
  'Extracting metadata',
  'Building insights',
  'Ranking results',
  'Final verification',
];

function Loading() {
  const [progress, setProgress] = useState(0);
  const targetRef = useRef(5);

  const thresholds = useMemo(() => {
    const span = 90 / STAGES.length;
    return STAGES
      .map((_, i) => {
        const jitter = (Math.random() - 0.5) * span * 0.8;
        return Math.min(94, Math.max(6, Math.round(span * (i + 1) + jitter)));
      })
      .sort((a, b) => a - b);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(94);
      return;
    }

    let raf;
    let timer;

    const bump = () => {
      targetRef.current = Math.min(95, targetRef.current + 4 + Math.random() * 13);
      timer = setTimeout(bump, 320 + Math.random() * 680);
    };
    timer = setTimeout(bump, 250 + Math.random() * 350);

    const tick = () => {
      setProgress((prev) => {
        const next = prev + (targetRef.current - prev) * (0.04 + Math.random() * 0.05);
        return Math.abs(targetRef.current - next) < 0.1 ? targetRef.current : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, []);

  const pct = Math.round(progress);
  const completed = thresholds.filter((t) => pct >= t).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-morphism rounded-xl p-8 reveal">
        <div className="flex items-center gap-3 mb-7">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/15 text-primary">
            <Search size={18} className="animate-pulse" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-white leading-tight">Analyzing profile</h2>
            <p className="text-xs text-gray-500">Crawling repositories and building insights</p>
          </div>
        </div>

        <div className="flex items-end justify-between mb-2">
          <span className="text-sm text-gray-400">
            {STAGES[Math.min(completed, STAGES.length - 1)]}…
          </span>
          <span className="text-2xl font-semibold text-white tabular-nums">{pct}%</span>
        </div>

        <div className="progress-track h-2 mb-7">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <ul className="space-y-2.5">
          {STAGES.map((label, i) => {
            const done = pct >= thresholds[i];
            const active = !done && i === completed;
            return (
              <li
                key={label}
                className={`flex items-center gap-3 text-sm transition-colors duration-300 ${
                  done ? 'text-gray-300' : active ? 'text-white' : 'text-gray-600'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md shrink-0 transition-all duration-300 ${
                  done ? 'bg-accent/15 text-accent'
                    : active ? 'bg-primary/15 text-primary'
                    : 'bg-white/[0.04] text-gray-600'
                }`}>
                  {done ? <Check size={13} /> : active ? <Loader2 size={13} className="animate-spin" /> : <span className="w-1 h-1 rounded-full bg-current" />}
                </span>
                {label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Loading;

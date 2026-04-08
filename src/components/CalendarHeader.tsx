import { ChevronLeft, ChevronRight, Sun, Moon, CalendarCheck } from "lucide-react";
import { MonthTheme } from "@/data/monthThemes";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  currentMonth: number;
  currentYear: number;
  theme: MonthTheme;
  darkMode: boolean;
  onToggleDark: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export function CalendarHeader({
  currentMonth,
  currentYear,
  theme,
  darkMode,
  onToggleDark,
  onPrev,
  onNext,
  onToday,
}: Props) {
  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden rounded-t-2xl" style={{ height: "220px" }}>
        <img
          src={theme.imageUrl}
          alt={`${theme.name} scenery`}
          className="w-full h-full object-cover transition-all duration-700"
          style={{ filter: darkMode ? "brightness(0.65) saturate(0.8)" : "brightness(0.9) saturate(1.1)" }}
          data-testid="hero-image"
        />

        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 30%, ${darkMode ? "rgba(30,20,15,0.85)" : "rgba(255,250,240,0.85)"} 100%)`
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 flex items-end justify-between">
          <div>
            <p
              className="text-xs font-sans font-medium tracking-widest uppercase mb-1"
              style={{ color: theme.palette.accent, opacity: 0.9 }}
            >
              {currentYear}
            </p>
            <h1
              className="font-serif text-4xl font-bold leading-none"
              style={{ color: darkMode ? "#f5efe8" : "#2a1f15" }}
              data-testid="month-title"
            >
              {MONTH_NAMES[currentMonth]}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToday}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                background: theme.palette.accent,
                color: "#fff",
              }}
              data-testid="button-today"
              title="Go to today"
            >
              <CalendarCheck size={12} />
              Today
            </button>

            <button
              onClick={onToggleDark}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{
                background: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                color: darkMode ? "#fff" : "#2a1f15",
              }}
              data-testid="button-dark-mode"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>

        <div className="absolute top-4 left-0 right-0 flex justify-center gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full binding-hole"
              style={{ border: `2px solid rgba(0,0,0,0.25)`, background: "rgba(255,255,255,0.3)" }}
            />
          ))}
        </div>
      </div>

      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: theme.palette.accent,
          color: "#fff",
        }}
      >
        <button
          onClick={onPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-all"
          data-testid="button-prev-month"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="grid grid-cols-7 flex-1 mx-2">
          {DAY_NAMES.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold tracking-wider opacity-90"
            >
              {d}
            </div>
          ))}
        </div>

        <button
          onClick={onNext}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-all"
          data-testid="button-next-month"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

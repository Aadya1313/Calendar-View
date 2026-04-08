import { X, CalendarRange } from "lucide-react";
import { DateRange } from "@/hooks/useCalendarState";
import { MonthTheme } from "@/data/monthThemes";

type Props = {
  dateRange: DateRange;
  selectingEnd: boolean;
  onClear: () => void;
  theme: MonthTheme;
  darkMode: boolean;
};

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(b.getTime() - a.getTime());
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
}

export function RangeInfoBar({ dateRange, selectingEnd, onClear, theme, darkMode }: Props) {
  if (!dateRange.start && !selectingEnd) return null;

  const bg = darkMode ? "hsl(25 15% 18%)" : theme.palette.light;
  const borderColor = theme.palette.medium;

  return (
    <div
      className="mx-3 mb-2 px-4 py-2.5 rounded-xl flex items-center gap-3 transition-all"
      style={{
        background: bg,
        border: `1px dashed ${borderColor}`,
      }}
      data-testid="range-info-bar"
    >
      <CalendarRange size={14} style={{ color: theme.palette.accent, flexShrink: 0 }} />

      <div className="flex-1 min-w-0">
        {selectingEnd && dateRange.start && !dateRange.end ? (
          <p
            className="text-xs font-handwriting truncate"
            style={{
              color: darkMode ? "#c8b8ae" : "#6a5040",
              fontFamily: "'Caveat', cursive",
              fontSize: "14px",
            }}
          >
            From <strong>{formatDate(dateRange.start)}</strong> — click to set end date
          </p>
        ) : dateRange.start && dateRange.end ? (
          <p
            className="text-xs font-handwriting truncate"
            style={{
              color: darkMode ? "#c8b8ae" : "#6a5040",
              fontFamily: "'Caveat', cursive",
              fontSize: "14px",
            }}
          >
            <strong>{formatDate(dateRange.start)}</strong>
            {" → "}
            <strong>{formatDate(dateRange.end)}</strong>
            {" "}
            <span style={{ color: theme.palette.accent }}>
              ({daysBetween(dateRange.start, dateRange.end)} days)
            </span>
          </p>
        ) : dateRange.start ? (
          <p
            className="text-xs font-handwriting truncate"
            style={{
              color: darkMode ? "#c8b8ae" : "#6a5040",
              fontFamily: "'Caveat', cursive",
              fontSize: "14px",
            }}
          >
            <strong>{formatDate(dateRange.start)}</strong> selected
          </p>
        ) : null}
      </div>

      <button
        onClick={onClear}
        className="w-5 h-5 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all flex-shrink-0"
        style={{ background: theme.palette.medium, color: "#fff" }}
        data-testid="button-clear-range"
        aria-label="Clear date range"
      >
        <X size={10} />
      </button>
    </div>
  );
}

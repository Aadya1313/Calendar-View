import { useState, useEffect } from "react";
import { useCalendarState } from "@/hooks/useCalendarState";
import { MONTH_THEMES } from "@/data/monthThemes";
import { CalendarHeader } from "@/components/CalendarHeader";
import { CalendarGrid } from "@/components/CalendarGrid";
import { NotesPanel } from "@/components/NotesPanel";
import { RangeInfoBar } from "@/components/RangeInfoBar";
import { HolidayLegend } from "@/components/HolidayLegend";

export default function Calendar() {
  const state = useCalendarState();
  const theme = MONTH_THEMES[state.currentMonth];

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("wall-calendar-dark") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem("wall-calendar-dark", String(darkMode));
    } catch {
      // ignore
    }
  }, [darkMode]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{ background: darkMode ? "hsl(25 10% 8%)" : "hsl(36 20% 90%)" }}
      data-testid="calendar-page"
    >
      <div
        className="w-full max-w-4xl calendar-shadow rounded-2xl overflow-hidden"
        style={{
          background: darkMode ? "hsl(25 15% 14%)" : "hsl(36 30% 98%)",
        }}
      >
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          <div
            className="flex-1 flex flex-col"
            style={{
              borderRight: `1px solid ${darkMode ? "hsl(25 10% 20%)" : "hsl(30 15% 88%)"}`,
            }}
          >
            <CalendarHeader
              currentMonth={state.currentMonth}
              currentYear={state.currentYear}
              theme={theme}
              darkMode={darkMode}
              onToggleDark={() => setDarkMode(d => !d)}
              onPrev={() => state.navigateMonth(-1)}
              onNext={() => state.navigateMonth(1)}
              onToday={state.goToToday}
            />

            <CalendarGrid
              state={state}
              theme={theme}
              darkMode={darkMode}
            />

            <RangeInfoBar
              dateRange={state.dateRange}
              selectingEnd={state.selectingEnd}
              onClear={state.clearRange}
              theme={theme}
              darkMode={darkMode}
            />

            <HolidayLegend
              currentMonth={state.currentMonth}
              holidays={state.holidays}
              theme={theme}
              darkMode={darkMode}
            />
          </div>

          <div
            className="w-full lg:w-80 flex flex-col"
            style={{ minHeight: "400px" }}
          >
            <NotesPanel
              state={state}
              theme={theme}
              darkMode={darkMode}
            />
          </div>
        </div>

        <div
          className="px-6 py-3 flex flex-wrap items-center gap-4 text-xs"
          style={{
            borderTop: `1px solid ${darkMode ? "hsl(25 10% 20%)" : "hsl(30 15% 88%)"}`,
            color: darkMode ? "#7a6a60" : "#b0a098",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-3.5 h-3.5 rounded-full border-2"
              style={{ borderColor: theme.palette.accent }}
            />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-3.5 h-3.5 rounded-full"
              style={{ background: theme.palette.accent }}
            />
            <span>Start / End</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-8 h-3.5 rounded-sm"
              style={{ background: theme.palette.light }}
            />
            <span>In range</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: theme.palette.accent }}
            />
            <span>Holiday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: theme.palette.medium }}
            />
            <span>Has note</span>
          </div>
          <span className="ml-auto opacity-60">Click a date to start range · Click again to end</span>
        </div>
      </div>
    </div>
  );
}

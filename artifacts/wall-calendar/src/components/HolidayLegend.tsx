import { Holiday } from "@/hooks/useCalendarState";
import { MonthTheme } from "@/data/monthThemes";

type Props = {
  currentMonth: number;
  holidays: Holiday[];
  theme: MonthTheme;
  darkMode: boolean;
};

export function HolidayLegend({ currentMonth, holidays, theme, darkMode }: Props) {
  const monthHolidays = holidays.filter(h => h.month === currentMonth);
  if (monthHolidays.length === 0) return null;

  return (
    <div
      className="mx-3 mb-3 px-3 py-2.5 rounded-xl"
      style={{
        background: darkMode ? "hsl(25 12% 17%)" : `${theme.palette.accent}0d`,
        border: `1px solid ${theme.palette.accent}25`,
      }}
      data-testid="holiday-legend"
    >
      <p
        className="text-xs font-medium mb-1.5 tracking-wide uppercase"
        style={{ color: theme.palette.accent, opacity: 0.8 }}
      >
        This month
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {monthHolidays.map(h => (
          <div key={`${h.month}-${h.day}`} className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: theme.palette.accent }}
            />
            <span
              className="text-xs"
              style={{ color: darkMode ? "#9d8e85" : "#7a6050" }}
            >
              {h.day} – {h.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useCallback } from "react";
import { CalendarState } from "@/hooks/useCalendarState";
import { MonthTheme } from "@/data/monthThemes";

type Props = {
  state: CalendarState;
  theme: MonthTheme;
  darkMode: boolean;
};

export function CalendarGrid({ state, theme, darkMode }: Props) {
  const {
    currentYear,
    currentMonth,
    handleDayClick,
    setHoverDate,
    isInRange,
    isRangeStart,
    isRangeEnd,
    isToday,
    getHoliday,
    getDaysInMonth,
    getNotesForDate,
    selectingEnd,
  } = state;

  const days = getDaysInMonth(currentYear, currentMonth);

  const isCurrentMonth = useCallback(
    (date: Date) => date.getMonth() === currentMonth,
    [currentMonth]
  );

  const getDayStyle = useCallback(
    (date: Date) => {
      const inCurrent = isCurrentMonth(date);
      const isStart = isRangeStart(date);
      const isEnd = isRangeEnd(date);
      const inRange = isInRange(date);
      const today = isToday(date);

      if (isStart || isEnd) {
        return {
          background: theme.palette.accent,
          color: "#fff",
          fontWeight: 700,
          borderRadius: isStart && isEnd ? "50%" : isStart ? "50% 0 0 50%" : "0 50% 50% 0",
          zIndex: 2,
        };
      }

      if (inRange) {
        return {
          background: theme.palette.light,
          color: inCurrent ? darkMode ? "#e8ddd5" : "#2a1f15" : darkMode ? "#9d8e85" : "#c0a898",
          borderRadius: "0",
        };
      }

      if (today) {
        return {
          border: `2px solid ${theme.palette.accent}`,
          borderRadius: "50%",
          color: theme.palette.accent,
          fontWeight: 700,
        };
      }

      return {
        color: inCurrent
          ? darkMode ? "#e8ddd5" : "#2a1f15"
          : darkMode ? "#7a6a60" : "#c0a898",
      };
    },
    [currentMonth, isRangeStart, isRangeEnd, isInRange, isToday, theme, darkMode, isCurrentMonth]
  );

  return (
    <div
      className="grid grid-cols-7 px-3 py-2"
      data-testid="calendar-grid"
    >
      {days.map((date, idx) => {
        const holiday = isCurrentMonth(date) ? getHoliday(date) : undefined;
        const hasNotes = isCurrentMonth(date) && getNotesForDate(date).length > 0;
        const isStart = isRangeStart(date);
        const isEnd = isRangeEnd(date);
        const inRange = isInRange(date);

        return (
          <div
            key={idx}
            className="relative flex items-center justify-center"
            style={{ height: "44px" }}
          >
            {inRange && !isStart && !isEnd && (
              <div
                className="absolute inset-y-1 left-0 right-0"
                style={{ background: theme.palette.light, opacity: 0.8 }}
              />
            )}
            {isStart && !isEnd && (
              <div
                className="absolute inset-y-1 right-0"
                style={{ background: theme.palette.light, opacity: 0.8, left: "50%" }}
              />
            )}
            {isEnd && !isStart && (
              <div
                className="absolute inset-y-1 left-0"
                style={{ background: theme.palette.light, opacity: 0.8, right: "50%" }}
              />
            )}

            <button
              onClick={() => isCurrentMonth(date) ? handleDayClick(date) : undefined}
              onMouseEnter={() => selectingEnd && isCurrentMonth(date) ? setHoverDate(date) : undefined}
              onMouseLeave={() => setHoverDate(null)}
              className={`
                relative z-10 w-9 h-9 flex flex-col items-center justify-center text-sm
                transition-all duration-150
                ${isCurrentMonth(date) ? "cursor-pointer hover:scale-110" : "cursor-default"}
                ${!isCurrentMonth(date) ? "opacity-30" : ""}
              `}
              style={{
                ...getDayStyle(date),
                borderRadius: isStart && isEnd ? "50%" : isStart ? "50%" : isEnd ? "50%" : inRange ? "0" : "50%",
              }}
              data-testid={`day-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`}
              aria-label={`${date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}${holiday ? ` - ${holiday.name}` : ""}`}
              disabled={!isCurrentMonth(date)}
            >
              <span className="leading-none">{date.getDate()}</span>
              <div className="flex gap-0.5 mt-0.5">
                {holiday && (
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: isStart || isEnd ? "#fff" : theme.palette.accent }}
                    title={holiday.name}
                  />
                )}
                {hasNotes && (
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: isStart || isEnd ? "#fff" : theme.palette.medium }}
                    title="Has notes"
                  />
                )}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

import { useState, useCallback, useEffect } from "react";

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type Note = {
  id: string;
  text: string;
  dateKey?: string;
  createdAt: number;
};

export type Holiday = {
  month: number;
  day: number;
  name: string;
};

const US_HOLIDAYS: Holiday[] = [
  { month: 0, day: 1, name: "New Year's Day" },
  { month: 0, day: 15, name: "MLK Jr. Day" },
  { month: 1, day: 14, name: "Valentine's Day" },
  { month: 2, day: 17, name: "St. Patrick's Day" },
  { month: 3, day: 22, name: "Earth Day" },
  { month: 4, day: 27, name: "Memorial Day" },
  { month: 5, day: 19, name: "Juneteenth" },
  { month: 6, day: 4, name: "Independence Day" },
  { month: 8, day: 1, name: "Labor Day" },
  { month: 9, day: 31, name: "Halloween" },
  { month: 10, day: 11, name: "Veterans Day" },
  { month: 10, day: 28, name: "Thanksgiving" },
  { month: 11, day: 25, name: "Christmas Day" },
  { month: 11, day: 31, name: "New Year's Eve" },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function dateToKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function keyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function useCalendarState() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const [notes, setNotes] = useState<Note[]>(() => {
    const stored = loadFromStorage<Array<{ id: string; text: string; dateKey?: string; createdAt: number }>>("wall-calendar-notes", []);
    return stored;
  });

  const [monthNotes, setMonthNotes] = useState<string>(() => {
    const stored = loadFromStorage<Record<string, string>>("wall-calendar-month-notes", {});
    const key = `${today.getFullYear()}-${today.getMonth()}`;
    return stored[key] || "";
  });

  useEffect(() => {
    saveToStorage("wall-calendar-notes", notes);
  }, [notes]);

  const getMonthNote = useCallback((year: number, month: number): string => {
    const stored = loadFromStorage<Record<string, string>>("wall-calendar-month-notes", {});
    return stored[`${year}-${month}`] || "";
  }, []);

  const saveMonthNote = useCallback((year: number, month: number, text: string) => {
    const stored = loadFromStorage<Record<string, string>>("wall-calendar-month-notes", {});
    stored[`${year}-${month}`] = text;
    saveToStorage("wall-calendar-month-notes", stored);
  }, []);

  const navigateMonth = useCallback((dir: -1 | 1) => {
    setCurrentMonth((prev) => {
      const next = prev + dir;
      if (next < 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      if (next > 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return next;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  }, [today.getFullYear(), today.getMonth()]);

  const handleDayClick = useCallback((date: Date) => {
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: date, end: null });
      setSelectingEnd(true);
    } else if (selectingEnd) {
      if (date < dateRange.start) {
        setDateRange({ start: date, end: dateRange.start });
      } else {
        setDateRange({ start: dateRange.start, end: date });
      }
      setSelectingEnd(false);
    }
  }, [dateRange, selectingEnd]);

  const clearRange = useCallback(() => {
    setDateRange({ start: null, end: null });
    setSelectingEnd(false);
    setHoverDate(null);
  }, []);

  const isInRange = useCallback((date: Date): boolean => {
    const { start, end } = dateRange;
    if (!start) return false;
    const checkEnd = end || (selectingEnd && hoverDate) || null;
    if (!checkEnd) return false;
    const lo = start < checkEnd ? start : checkEnd;
    const hi = start < checkEnd ? checkEnd : start;
    return date > lo && date < hi;
  }, [dateRange, selectingEnd, hoverDate]);

  const isRangeStart = useCallback((date: Date): boolean => {
    return dateRange.start !== null && dateToKey(date) === dateToKey(dateRange.start);
  }, [dateRange.start]);

  const isRangeEnd = useCallback((date: Date): boolean => {
    return dateRange.end !== null && dateToKey(date) === dateToKey(dateRange.end);
  }, [dateRange.end]);

  const isToday = useCallback((date: Date): boolean => {
    return dateToKey(date) === dateToKey(today);
  }, []);

  const getHoliday = useCallback((date: Date): Holiday | undefined => {
    return US_HOLIDAYS.find(h => h.month === date.getMonth() && h.day === date.getDate());
  }, []);

  const addNote = useCallback((text: string, dateKey?: string) => {
    const note: Note = {
      id: crypto.randomUUID(),
      text: text.trim(),
      dateKey,
      createdAt: Date.now(),
    };
    setNotes((prev) => [...prev, note]);
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter(n => n.id !== id));
  }, []);

  const getNotesForDate = useCallback((date: Date): Note[] => {
    const key = dateToKey(date);
    return notes.filter(n => n.dateKey === key);
  }, [notes]);

  const getNotesForRange = useCallback((): Note[] => {
    if (!dateRange.start) return notes;
    if (!dateRange.end) {
      const key = dateToKey(dateRange.start);
      return notes.filter(n => !n.dateKey || n.dateKey === key);
    }
    const start = dateToKey(dateRange.start);
    const end = dateToKey(dateRange.end);
    return notes.filter(n => {
      if (!n.dateKey) return true;
      return n.dateKey >= start && n.dateKey <= end;
    });
  }, [notes, dateRange]);

  const getDaysInMonth = useCallback((year: number, month: number): Date[] => {
    const days: Date[] = [];
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDow = first.getDay();
    for (let i = 0; i < startDow; i++) {
      days.push(new Date(year, month, -startDow + i + 1));
    }
    for (let d = 1; d <= last.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push(new Date(year, month + 1, d));
    }
    return days;
  }, []);

  return {
    currentYear,
    currentMonth,
    dateRange,
    selectingEnd,
    hoverDate,
    notes,
    today,
    setHoverDate,
    navigateMonth,
    goToToday,
    handleDayClick,
    clearRange,
    isInRange,
    isRangeStart,
    isRangeEnd,
    isToday,
    getHoliday,
    addNote,
    deleteNote,
    getNotesForDate,
    getNotesForRange,
    getDaysInMonth,
    getMonthNote,
    saveMonthNote,
    holidays: US_HOLIDAYS,
  };
}

export type CalendarState = ReturnType<typeof useCalendarState>;

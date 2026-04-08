import { useState, useEffect, useRef } from "react";
import { Trash2, Plus, StickyNote, Calendar } from "lucide-react";
import { CalendarState } from "@/hooks/useCalendarState";
import { MonthTheme } from "@/data/monthThemes";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

type Props = {
  state: CalendarState;
  theme: MonthTheme;
  darkMode: boolean;
};

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateKey(key: string): string {
  const [, m, d] = key.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}`;
}

export function NotesPanel({ state, theme, darkMode }: Props) {
  const {
    dateRange,
    currentMonth,
    currentYear,
    notes,
    addNote,
    deleteNote,
    getMonthNote,
    saveMonthNote,
  } = state;

  const [newNote, setNewNote] = useState("");
  const [monthNote, setMonthNote] = useState(() => getMonthNote(currentYear, currentMonth));
  const [attachToRange, setAttachToRange] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const monthNoteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMonthNote(getMonthNote(currentYear, currentMonth));
  }, [currentYear, currentMonth, getMonthNote]);

  const handleMonthNoteChange = (val: string) => {
    setMonthNote(val);
    saveMonthNote(currentYear, currentMonth, val);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    let dateKey: string | undefined;
    if (attachToRange && dateRange.start) {
      const year = dateRange.start.getFullYear();
      const m = String(dateRange.start.getMonth() + 1).padStart(2, "0");
      const d = String(dateRange.start.getDate()).padStart(2, "0");
      dateKey = `${year}-${m}-${d}`;
    }
    addNote(newNote.trim(), dateKey);
    setNewNote("");
    textareaRef.current?.focus();
  };

  const getDateRangeLabel = () => {
    if (!dateRange.start) return null;
    if (!dateRange.end) return formatDate(dateRange.start);
    return `${formatDate(dateRange.start)} – ${formatDate(dateRange.end)}`;
  };

  const rangeLabel = getDateRangeLabel();

  const displayedNotes = notes.filter(n => {
    if (!dateRange.start) return true;
    if (!n.dateKey) return true;
    const start = `${dateRange.start.getFullYear()}-${String(dateRange.start.getMonth() + 1).padStart(2, "0")}-${String(dateRange.start.getDate()).padStart(2, "0")}`;
    const end = dateRange.end
      ? `${dateRange.end.getFullYear()}-${String(dateRange.end.getMonth() + 1).padStart(2, "0")}-${String(dateRange.end.getDate()).padStart(2, "0")}`
      : start;
    return n.dateKey >= start && n.dateKey <= end;
  });

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: darkMode ? "hsl(25 15% 14%)" : "hsl(36 30% 97%)" }}
    >
      <div
        className="px-5 py-4 border-b"
        style={{
          borderColor: darkMode ? "hsl(25 10% 22%)" : "hsl(30 15% 85%)",
          background: `${theme.palette.accent}18`,
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <StickyNote size={14} style={{ color: theme.palette.accent }} />
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: theme.palette.accent }}
          >
            Notes & Memos
          </span>
        </div>
        {rangeLabel && (
          <div className="flex items-center gap-1.5">
            <Calendar size={12} style={{ color: darkMode ? "#9d8e85" : "#8a7060" }} />
            <span
              className="text-xs font-handwriting"
              style={{ color: darkMode ? "#9d8e85" : "#8a7060" }}
            >
              Showing notes for: {rangeLabel}
            </span>
          </div>
        )}
      </div>

      <div
        className="px-5 pt-4 pb-3"
        style={{ borderBottom: `1px solid ${darkMode ? "hsl(25 10% 20%)" : "hsl(30 15% 88%)"}` }}
      >
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: darkMode ? "#9d8e85" : "#8a7060" }}
        >
          Month memo — {MONTH_NAMES[currentMonth]} {currentYear}
        </label>
        <div className="relative calendar-paper rounded-lg overflow-hidden">
          <textarea
            ref={monthNoteRef}
            value={monthNote}
            onChange={(e) => handleMonthNoteChange(e.target.value)}
            placeholder="Jot down goals, reminders, or anything for this month..."
            rows={3}
            className="w-full bg-transparent px-3 py-2 text-sm font-handwriting resize-none outline-none placeholder:opacity-50 leading-7"
            style={{
              color: darkMode ? "#e8ddd5" : "#2a1f15",
              fontFamily: "'Caveat', cursive",
              fontSize: "15px",
              lineHeight: "28px",
            }}
            data-testid="textarea-month-note"
          />
        </div>
      </div>

      <div className="px-5 py-3" style={{ borderBottom: `1px solid ${darkMode ? "hsl(25 10% 20%)" : "hsl(30 15% 88%)"}` }}>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: darkMode ? "#9d8e85" : "#8a7060" }}
        >
          Add a note
        </label>
        <div className="relative calendar-paper rounded-lg overflow-hidden mb-2">
          <textarea
            ref={textareaRef}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleAddNote();
              }
            }}
            placeholder="Write a note... (Cmd+Enter to save)"
            rows={2}
            className="w-full bg-transparent px-3 py-2 text-sm font-handwriting resize-none outline-none placeholder:opacity-50 leading-7"
            style={{
              color: darkMode ? "#e8ddd5" : "#2a1f15",
              fontFamily: "'Caveat', cursive",
              fontSize: "15px",
              lineHeight: "28px",
            }}
            data-testid="textarea-new-note"
          />
        </div>

        <div className="flex items-center gap-2">
          {dateRange.start && (
            <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none" style={{ color: darkMode ? "#9d8e85" : "#8a7060" }}>
              <input
                type="checkbox"
                checked={attachToRange}
                onChange={(e) => setAttachToRange(e.target.checked)}
                className="w-3 h-3 rounded"
                data-testid="checkbox-attach-range"
              />
              Attach to {rangeLabel || "date"}
            </label>
          )}
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            style={{
              background: theme.palette.accent,
              color: "#fff",
            }}
            data-testid="button-add-note"
          >
            <Plus size={12} />
            Add Note
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3">
        {displayedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <StickyNote size={28} style={{ color: theme.palette.medium, opacity: 0.5 }} />
            <p
              className="mt-2 text-sm font-handwriting"
              style={{
                color: darkMode ? "#7a6a60" : "#b0a098",
                fontFamily: "'Caveat', cursive",
                fontSize: "15px",
              }}
            >
              {dateRange.start ? "No notes for this range" : "No notes yet"}
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: darkMode ? "#7a6a60" : "#c0b0a8" }}
            >
              {dateRange.start
                ? "Add a note and attach it to your selected range"
                : "Select dates and start jotting down memos"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {displayedNotes.map((note, idx) => (
              <div
                key={note.id}
                className="group relative rounded-lg px-3 py-2.5 transition-all hover:-translate-y-0.5"
                style={{
                  background: darkMode ? "hsl(25 12% 20%)" : "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
                  borderLeft: `3px solid ${theme.palette.accent}`,
                }}
                data-testid={`note-${note.id}`}
              >
                {note.dateKey && (
                  <span
                    className="block text-xs mb-1 font-medium"
                    style={{ color: theme.palette.accent, opacity: 0.8 }}
                  >
                    {formatDateKey(note.dateKey)}
                  </span>
                )}
                <p
                  className="text-sm leading-snug pr-6"
                  style={{
                    color: darkMode ? "#e8ddd5" : "#2a1f15",
                    fontFamily: "'Caveat', cursive",
                    fontSize: "15px",
                  }}
                >
                  {note.text}
                </p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: darkMode ? "hsl(0 65% 45%)" : "hsl(0 72% 51%)",
                    color: "#fff",
                  }}
                  data-testid={`button-delete-note-${note.id}`}
                  aria-label="Delete note"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="px-5 py-3 text-center border-t"
        style={{
          borderColor: darkMode ? "hsl(25 10% 20%)" : "hsl(30 15% 88%)",
        }}
      >
        <p
          className="text-xs italic"
          style={{
            color: darkMode ? "#7a6a60" : "#b0a098",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          "{theme.quote}"
        </p>
      </div>
    </div>
  );
}

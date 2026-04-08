export type MonthTheme = {
  name: string;
  imageUrl: string;
  palette: {
    accent: string;
    light: string;
    medium: string;
  };
  quote: string;
};

export const MONTH_THEMES: MonthTheme[] = [
  {
    name: "January",
    imageUrl: "https://images.unsplash.com/photo-1478660671346-c3c28e2748fe?w=800&q=80",
    palette: { accent: "#4a6fa5", light: "#dce8f5", medium: "#a8c4e0" },
    quote: "Every new year is the direct descendant of a long line of failures.",
  },
  {
    name: "February",
    imageUrl: "https://images.unsplash.com/photo-1494789862433-2c4b7f8c95e5?w=800&q=80",
    palette: { accent: "#c06080", light: "#fce4ec", medium: "#f48fb1" },
    quote: "Love is the flower you've got to let grow.",
  },
  {
    name: "March",
    imageUrl: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80",
    palette: { accent: "#4caf6d", light: "#e8f5e9", medium: "#a5d6a7" },
    quote: "Spring is nature's way of saying, 'Let's party!'",
  },
  {
    name: "April",
    imageUrl: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80",
    palette: { accent: "#7b9e50", light: "#f1f8e9", medium: "#c5e1a5" },
    quote: "April hath put a spirit of youth in everything.",
  },
  {
    name: "May",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88df5691cc8b?w=800&q=80",
    palette: { accent: "#e67e22", light: "#fff3e0", medium: "#ffcc80" },
    quote: "May your choices reflect your hopes, not your fears.",
  },
  {
    name: "June",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    palette: { accent: "#f5a623", light: "#fff8e1", medium: "#ffe082" },
    quote: "In early June the world of leaf and blade and flowers explodes.",
  },
  {
    name: "July",
    imageUrl: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&q=80",
    palette: { accent: "#e53935", light: "#ffebee", medium: "#ef9a9a" },
    quote: "July is the month when the earth is closest to the sun.",
  },
  {
    name: "August",
    imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    palette: { accent: "#ff6f00", light: "#fff8e1", medium: "#ffcc02" },
    quote: "August rain: the best of the summer gone.",
  },
  {
    name: "September",
    imageUrl: "https://images.unsplash.com/photo-1507090960745-b32f65d3113a?w=800&q=80",
    palette: { accent: "#bf6a3d", light: "#fbe9e7", medium: "#ffab91" },
    quote: "Autumn is a second spring when every leaf is a flower.",
  },
  {
    name: "October",
    imageUrl: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80",
    palette: { accent: "#d84315", light: "#fbe9e7", medium: "#ff8a65" },
    quote: "October is the fallen leaf, but it is also a wider horizon.",
  },
  {
    name: "November",
    imageUrl: "https://images.unsplash.com/photo-1477936821694-ec4233a9a1a0?w=800&q=80",
    palette: { accent: "#5d4037", light: "#efebe9", medium: "#bcaaa4" },
    quote: "November always seems to me the Norway of the year.",
  },
  {
    name: "December",
    imageUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80",
    palette: { accent: "#1565c0", light: "#e3f2fd", medium: "#90caf9" },
    quote: "December is the month of joyful nights and peaceful days.",
  },
];

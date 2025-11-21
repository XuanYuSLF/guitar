import { memo } from "react";
import { Box, Typography, Paper } from "@mui/material";
import type { Note } from "@/types";

interface FretboardProps {
  notes: Note[];
  title?: string;
}

const Fretboard = memo(({ notes, title }: FretboardProps) => {
  // 核心特征：这里有 filter 方法，也是导致你刚才报错的原因
  const frettedNotes = notes.filter((n) => n.fret > 0);
  const minFret =
    frettedNotes.length > 0 ? Math.min(...frettedNotes.map((n) => n.fret)) : 0;

  const startFret = minFret <= 1 ? 1 : minFret;
  const TOTAL_FRETS_TO_SHOW = 5;
  const CANVAS_WIDTH = 320;
  const START_X = 40;
  const FRET_SPACING = 60;

  const getFretX = (fretNumber: number) => {
    if (fretNumber === 0) return 20;
    const relativeIndex = fretNumber - startFret + 1;
    return START_X + relativeIndex * FRET_SPACING - FRET_SPACING / 2;
  };

  const stringY = [30, 60, 90, 120, 150, 180];

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, mb: 3, bgcolor: "#232028", borderRadius: 2 }}
    >
      {title && (
        <Typography variant="h6" color="primary.main" gutterBottom>
          {title}
        </Typography>
      )}
      <Box
        sx={{ overflowX: "auto", display: "flex", justifyContent: "center" }}
      >
        <svg
          width={CANVAS_WIDTH}
          height="220"
          viewBox={`0 0 ${CANVAS_WIDTH} 220`}
        >
          {stringY.map((y, i) => (
            <line
              key={`str-${i}`}
              x1={START_X}
              y1={y}
              x2={CANVAS_WIDTH - 20}
              y2={y}
              stroke="#555"
              strokeWidth={i + 1}
            />
          ))}

          <rect
            x={START_X}
            y={30}
            width={startFret === 1 ? 6 : 2}
            height={150}
            fill={startFret === 1 ? "#888" : "#555"}
          />

          {Array.from({ length: TOTAL_FRETS_TO_SHOW }).map((_, i) => {
            const x = START_X + (i + 1) * FRET_SPACING;
            return (
              <g key={`line-${i}`}>
                <line
                  x1={x}
                  y1={30}
                  x2={x}
                  y2={180}
                  stroke="#444"
                  strokeWidth="2"
                />
                {startFret > 1 && i === 0 && (
                  <text
                    x={x - FRET_SPACING / 2}
                    y={210}
                    fill="#888"
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {startFret}fr
                  </text>
                )}
              </g>
            );
          })}

          {notes.map((note, i) => {
            const y = stringY[note.string - 1];
            const x = getFretX(note.fret);
            const isVisible =
              note.fret === 0 ||
              (note.fret >= startFret &&
                note.fret < startFret + TOTAL_FRETS_TO_SHOW);
            if (!isVisible) return null;

            return (
              <g key={`note-${i}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={12}
                  fill={note.root ? "#D0BCFF" : "#FFF"}
                  stroke={note.root ? "#D0BCFF" : "#FFF"}
                />
                <text
                  x={x}
                  y={y + 4}
                  fontSize="11"
                  textAnchor="middle"
                  fill="#000"
                  fontWeight="bold"
                >
                  {note.fret === 0 ? "0" : note.fret}
                </text>
                {note.label && (
                  <text
                    x={x}
                    y={y - 16}
                    fontSize="10"
                    textAnchor="middle"
                    fill="#AAA"
                  >
                    {note.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </Box>
    </Paper>
  );
});

Fretboard.displayName = "Fretboard";
export default Fretboard;

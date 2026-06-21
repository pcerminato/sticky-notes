import type { Note } from "../types";

export function createNote(note?: Partial<Note>): Note {
  return {
    x: note?.x || 200,
    y: note?.y || 200,
    color: note?.color || "#FFF",
    content: note?.content || "",
    width: note?.width || 200,
    height: note?.height || 200,
  };
}

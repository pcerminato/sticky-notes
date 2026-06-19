export type Note = {
  x: number;
  y: number;
  color: string;
  content?: string;
  width: number;
  height: number;
};

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

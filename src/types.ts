import { createNote } from "./app/note";

export interface IStore {
  addNote: (note: Note) => void;
  notes: Note[];
  state: State;
  saveState: (state: State) => void;
  readonly config: Config;
}

export interface IDrawer {
  draw: (note: Note) => void;
  drawAll: () => void;
}

export type State = {
  selected?: {
    note: Note;
    x: number;
    y: number;
  };
  isResizing?: boolean;
  /* keeps the initial cursor point before start resizing */
  initCursor?: {
    x: number;
    y: number;
  };
};

export type Config = {
  defaultWidth: number;
  defaultHeight: number;
  defaultColor: string;
  defaultBorderColor: string;
  resizeHandleSize: number;
};

export type Note = {
  x: number;
  y: number;
  color: string;
  content?: string;
  width: number;
  height: number;
};

export type CreateNote = typeof createNote;

export type RectShape = {
  x: number;
  y: number;
  width: number;
  height: number;
};

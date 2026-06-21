import { createNote } from "./app/note";

export interface IStore {
  addNote: (note: Note) => void;
  notes: Note[];
  state: State;
  saveState: (state: State) => void;
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

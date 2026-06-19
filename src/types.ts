import { type Note } from "./note";

export interface IEvents {
  dispatchAddNote: (note: Note) => void;
}

export interface IStore {
  addNote: (note: Note) => void;
  notes: Note[];
}

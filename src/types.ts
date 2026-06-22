import { createNote } from "./app/note";

export interface IStore {
  addNote: (note: Note) => void;
  deleteNote: (note: Note) => void;
  notes: Note[];
  state: State;
  saveState: (state: State) => void;
  readonly config: Config;
}

export interface IDrawer {
  draw: (note: Note) => void;
  drawAll: () => void;
}

export type Coordinates = {
  x: number;
  y: number;
};

type DragAction = {
  type: "dragging";
  note: Note;
  /* the point in the note where the cursor clicks  */
  cursorOffset: Coordinates;
};

type ResizeAction = {
  type: "resizing";
  note: Note;
  startWidth: number;
  startHeight: number;
  initCursor: Coordinates;
};

type NoneAction = {
  type: "none";
};

export type State = {
  action: DragAction | ResizeAction | NoneAction;
};

export type Config = {
  defaultWidth: number;
  defaultHeight: number;
  colors: string[];
  defaultBorderColor: string;
  resizeHandleSize: number;
  deleteZoneSize: number;
};

export type CreateNote = typeof createNote;

export type RectShape = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Note = {
  x: number;
  y: number;
  color: string;
  content?: string;
  width: number;
  height: number;
};

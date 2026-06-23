import type { State, Config, Note, IStore } from "../types";
import {
  RESIZE_HANDLE_SIZE,
  NOTE_WIDTH,
  NOTE_HEIGHT,
  BORDER_COLOR,
  DELETE_ZONE_SIZE,
  COLORS,
} from "./constants";

/* 
The store manages the global state.
`notes` stores the model of the notes pictured in the canvas.
`state` holds application state, like the selected note and its last position.
`config` holds the global default configuration (Read-only).
  (having config in the store, helps avoiding imports of constants.ts along the code base.
  Also helps config overrides and testing).
*/
export function createStore(initialNotes?: Note[]): IStore {
  let _notes = initialNotes || [];
  let _state: State = {
    action: { type: "none" },
  };
  const config: Config = {
    colors: COLORS,
    resizeHandleSize: RESIZE_HANDLE_SIZE,
    defaultWidth: NOTE_WIDTH,
    defaultHeight: NOTE_HEIGHT,
    defaultBorderColor: BORDER_COLOR,
    deleteZoneSize: DELETE_ZONE_SIZE,
  };

  function addNote(note: Note) {
    _notes = [..._notes, note];
  }

  function deleteNote(note: Note) {
    _notes = _notes.filter((n) => n !== note);
  }

  function saveState(newState: State) {
    _state = newState;
  }

  function bringToFront(note: Note) {
    const remaining = _notes.filter((n) => n !== note);
    _notes = [...remaining, note];
  }

  return Object.freeze({
    addNote,
    deleteNote,
    saveState,
    bringToFront,
    config,
    /* using a getter to prevent direct mutations of the state (only allowed through saveState()) */
    get state() {
      return _state;
    },
    get notes() {
      return _notes;
    },
  });
}

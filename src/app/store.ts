import type { State, Config, Note, IStore } from "../types";
import {
  RESIZE_HANDLE_SIZE,
  NOTE_WIDTH,
  NOTE_HEIGHT,
  NOTE_COLOR,
  BORDER_COLOR,
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
  const notes = initialNotes || [];
  let _state: State = {
    action: { type: "none" },
  };
  const config: Config = {
    resizeHandleSize: RESIZE_HANDLE_SIZE,
    defaultWidth: NOTE_WIDTH,
    defaultHeight: NOTE_HEIGHT,
    defaultColor: NOTE_COLOR,
    defaultBorderColor: BORDER_COLOR,
  };

  function addNote(note: Note) {
    notes.push(note);
  }

  function saveState(newState: State) {
    _state = newState;
  }

  return Object.freeze({
    addNote,
    saveState,
    notes,
    config,
    /* using a getter to prevent direct mutations of the state (only allowed through saveState()) */
    get state() {
      return _state;
    },
  });
}

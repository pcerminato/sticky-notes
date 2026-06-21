import type { State, Note } from "../types";

/* 
The store manages the global state.
`notes` stores the model of the notes pictured in the canvas.
`state` holds application state, like the selected note and its last position.
*/
export function createStore(initialNotes?: Note[]) {
  const notes = initialNotes || [];
  const state: State = {};

  function addNote(note: Note) {
    notes.push(note);
  }

  function saveState(newState: State) {
    state.selected = newState.selected;
  }

  return Object.freeze({ addNote, notes, state, saveState });
}

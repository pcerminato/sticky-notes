import type { Note } from "./note";
import type { IEvents } from "./types";

export function createStore(eventsHub: IEvents, initialNotes?: Note[]) {
  const notes = initialNotes || [];

  function addNote(note: Note) {
    notes.push(note);
    eventsHub.dispatchAddNote(note);
  }

  return Object.freeze({ addNote, notes });
}

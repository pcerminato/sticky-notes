import type { IEvents, Note } from "../types";

declare global {
  interface WindowEventMap {
    notesChange: CustomEvent<Note[]>;
  }
}
export function createEvents(): IEvents {
  return {
    dispatchNotesChange: function (notes: Note[]) {
      const sotreAddEv = new CustomEvent<Note[]>("notesChange", {
        detail: notes,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(sotreAddEv);
    },
  };
}

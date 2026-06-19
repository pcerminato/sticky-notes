import type { Note } from "./note";
import type { IEvents } from "./types";

const STORE_ADD = "store:add";

declare global {
  interface DocumentEventMap {
    STORE_ADD: CustomEvent<Note>;
  }
}

export { STORE_ADD };

export function createEvents(): IEvents {
  return {
    dispatchAddNote: function (note: Note) {
      const sotreAddEv = new CustomEvent<Note>(STORE_ADD, {
        detail: note,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(sotreAddEv);
    },
  };
}

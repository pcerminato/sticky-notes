import type { Note } from "../../types";

const STORAGE_KEY = "notes-storage";

export function saveNotesToStorage(notes: Note[]) {
  if (window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error(error);
    }
  }
}

export function readNotesFromStorage(): Note[] | undefined {
  if (window.localStorage) {
    try {
      const data = localStorage.getItem(STORAGE_KEY);

      if (data && data.length) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

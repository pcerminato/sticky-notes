import type { CreateNote, IDrawer, IStore } from "../types";
import {
  clickIsOverArea,
  clickIsOverResizeHandle,
  getClickCoordinates,
} from "./utils/cursor";

export function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", "sticky-notes");
  document.getElementsByTagName("body")[0].append(canvas);
  return canvas;
}

/* Prevents canvas misalignments by keeping the canvas size in synch with the window's */
export function resizeCanvas(canvas: HTMLCanvasElement, drawer: IDrawer) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawer.drawAll();
}

/* Mousedown over the canvas controls two operations:
  - creating a new note, if the click is over the canvas (not over a note)
  - selecting the note, if the click is over a note (not over the canvas) 
*/
export function createCanvasMouseDownHandler(
  canvas: HTMLCanvasElement,
  notesStore: IStore,
  drawer: IDrawer,
  createNote: CreateNote,
) {
  return function canvasMouseDownHandler(e: MouseEvent) {
    const cursor = getClickCoordinates(canvas, e);
    let noteClicked = false;

    /* 
      Goes throught all previous notes backwards, so when they render, 
      the last one goes on top (with higher z-index).
    */
    for (let i = notesStore.notes.length - 1; i >= 0; i--) {
      const note = notesStore.notes[i];

      /* 
        Case when the click is over the resize handle.
      */
      if (
        clickIsOverResizeHandle(
          cursor,
          note,
          notesStore.config.resizeHandleSize,
        )
      ) {
        notesStore.saveState({
          selected: {
            note,
            // The current position (starting position at the right-bottom edge of the note)
            x: note.width,
            y: note.height,
          },
          isResizing: true, // <-
          initCursor: {
            x: cursor.x,
            y: cursor.y,
          },
        });

        /* !!! Moves the note being resized to the front */
        notesStore.notes.splice(i, 1);
        notesStore.notes.push(note);

        noteClicked = true;

        break;
      }

      /* 
        Case when the click is over a note's area.
        Checks if the coordinates of the mouse click is over a note 
      */
      if (clickIsOverArea(cursor, note)) {
        notesStore.saveState({
          selected: {
            note,
            x: cursor.x - note.x,
            y: cursor.y - note.y,
          },
          isResizing: false,
          initCursor: undefined,
        });

        /* !!! To have the selected note up front, puts it at the end of the list, so it is rendered last */
        notesStore.notes.splice(i, 1);
        notesStore.notes.push(note);

        noteClicked = true;

        break;
      }
    }

    /* 
      Case when the click is over the canvas.
      Creates the note on by the coordinates of the click.
    */
    if (!noteClicked) {
      const note = createNote({ x: cursor.x, y: cursor.y });

      notesStore.addNote(note);

      notesStore.saveState({
        selected: {
          note,
          x: cursor.x - note.x,
          y: cursor.y - note.y,
        },
        isResizing: false,
        initCursor: undefined,
      });
    }

    // Finally renders the new state.
    drawer.drawAll();
  };
}

/* 
Reads the cursor movements when dragging a selected note
and updates its position over the canvas.
*/
export function createCanvasMouseMoveHandler(
  canvas: HTMLCanvasElement,
  notesStore: IStore,
  drawer: IDrawer,
) {
  return function canvasMouseMoveHandler(e: MouseEvent) {
    if (!notesStore.state.selected) {
      return;
    }

    const cursor = getClickCoordinates(canvas, e);
    const { note, x: startX, y: startY } = notesStore.state.selected;

    if (notesStore.state.isResizing && notesStore.state?.initCursor) {
      // ranges of how much the cursor moved to the new position from the initial mousedown.
      const rangeX = cursor.x - notesStore.state.initCursor.x;
      const rangeY = cursor.y - notesStore.state.initCursor.y;

      note.width = Math.max(50, startX + rangeX);
      note.height = Math.max(50, startY + rangeY);

      notesStore.saveState({
        selected: {
          note,
          x: startX,
          y: startY,
        },
      });
    } else {
      note.x = cursor.x - startX;
      note.y = cursor.y - startY;

      notesStore.saveState({
        selected: {
          note,
          x: cursor.x - note.x /* TODO: here there might be a bug! */,
          y: cursor.y - note.y,
        },
        isResizing: false,
        initCursor: undefined,
      });
    }

    drawer.drawAll();
  };
}

export function createCanvasMouseUpHandler(
  notesStore: IStore,
  drawer: IDrawer,
) {
  return function canvasMouseUpHandler() {
    notesStore.saveState({
      selected: undefined,
      isResizing: false,
      initCursor: undefined,
    });
    drawer.drawAll();
  };
}

import type { CreateNote, IDrawer, IEvents, IStore } from "../types";
import {
  clickIsOverArea,
  clickIsOverResizeHandle,
  getClickCoordinates,
  isOverDeleteZone,
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
          action: {
            type: "resizing",
            note,
            startWidth: note.width,
            startHeight: note.height,
            initCursor: {
              x: cursor.x,
              y: cursor.y,
            },
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
          action: {
            type: "dragging",
            note,
            cursorOffset: {
              x: cursor.x - note.x,
              y: cursor.y - note.y,
            },
          },
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
      Creates the note by the coordinates of the click.
    */
    if (!noteClicked) {
      const note = createNote({ x: cursor.x, y: cursor.y });

      notesStore.addNote(note);
      notesStore.saveState({
        action: {
          type: "none",
        },
      });
      /* Alternative: 
        setting the state as "dragging" right after the creation of the new note
        would enable dragging the note on the same mousedown stroke as for creating 
        (no need to click the canvas to create and then click the note to select it).
        That would save one render roundtrip.
      */
      /* notesStore.saveState({
        action: {
          type: "dragging",
          note,
          cursorOffset: {
            x: cursor.x - note.x,
            y: cursor.y - note.y,
          },
        },
      }); */
    }
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
    const { action } = notesStore.state;

    if (action.type === "none") {
      return;
    }

    const cursor = getClickCoordinates(canvas, e);

    if (action.type === "resizing") {
      const { note, startWidth, startHeight, initCursor } = action;
      // ranges of how much the cursor moved to the new position from the initial mousedown.
      const rangeX = cursor.x - initCursor.x;
      const rangeY = cursor.y - initCursor.y;

      note.width = Math.max(50, startWidth + rangeX);
      note.height = Math.max(50, startHeight + rangeY);
    } else if (action.type === "dragging") {
      action.note.x = cursor.x - action.cursorOffset.x;
      action.note.y = cursor.y - action.cursorOffset.y;
    }

    drawer.drawAll();
  };
}

export function createCanvasMouseUpHandler(
  canvas: HTMLCanvasElement,
  notesStore: IStore,
  drawer: IDrawer,
  eventsHub?: IEvents,
) {
  return function canvasMouseUpHandler() {
    const { action } = notesStore.state;

    if (action.type === "dragging") {
      const { note } = action;
      const noteIsInDeleteZone = isOverDeleteZone(
        { x: note.x, y: note.y },
        canvas,
        notesStore.config.deleteZoneSize,
      );

      if (noteIsInDeleteZone) {
        notesStore.deleteNote(note);
      }
    }

    notesStore.saveState({ action: { type: "none" } });
    drawer.drawAll();

    eventsHub?.dispatchNotesChange([...notesStore.notes]);
  };
}

import type { CreateNote, IDrawer, IStore } from "../types";

export function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", "sticky-notes");
  document.getElementsByTagName("body")[0].append(canvas);
  return canvas;
}

/* Returns the coordinates x and y where the cursor clicks relative to the canvas */
export function getClickCoordinates(canvas: HTMLCanvasElement, e: MouseEvent) {
  const canvasViewportInfo = canvas.getBoundingClientRect();
  const { clientX, clientY } = e;
  const { left, top, width, height } = canvasViewportInfo;
  // calc mouse position relative to the canvas element
  const canvasX = clientX - left;
  const canvasY = clientY - top;

  // map coords to the internal pixel dimention
  const x = canvasX * (canvas.width / width);
  const y = canvasY * (canvas.height / height);

  return { x, y };
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

    // goes throught all previous notes
    for (let i = notesStore.notes.length - 1; i >= 0; i--) {
      const note = notesStore.notes[i];

      /* Checks if the position of the mouse is over a note */
      if (
        cursor.x >= note.x &&
        cursor.x <= note.x + note.width &&
        cursor.y >= note.y &&
        cursor.y <= note.y + note.height
      ) {
        notesStore.saveState({
          selected: {
            note,
            x: cursor.x - note.x,
            y: cursor.y - note.y,
          },
        });

        /* To have the selected note up front, puts it at the end of the list, so it is rendered last */
        notesStore.notes.splice(i, 1);
        notesStore.notes.push(note);

        break;
      }
    }

    if (notesStore.state.selected === undefined) {
      // creates the note on by the coordinates of the click
      const note = createNote({ x: cursor.x, y: cursor.y });

      notesStore.addNote(note);

      notesStore.saveState({
        selected: {
          note,
          x: cursor.x - note.x,
          y: cursor.y - note.y,
        },
      });
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
    if (!notesStore.state.selected) {
      return;
    }

    const cursor = getClickCoordinates(canvas, e);
    const { note, x: startX, y: startY } = notesStore.state.selected;

    note.x = cursor.x - startX;
    note.y = cursor.y - startY;

    notesStore.saveState({
      selected: {
        note,
        x: cursor.x - note.x,
        y: cursor.y - note.y,
      },
    });

    drawer.drawAll();
  };
}

export function createCanvasMouseUpHandler(
  notesStore: IStore,
  drawer: IDrawer,
) {
  return function canvasMouseUpHandler() {
    notesStore.state.selected = undefined;
    drawer.drawAll();
  };
}

import type { IStore, IDrawer, Note } from "../types";

/* 
Creates a drawer object that exposes an API to control the rendering of the notes (CanvasRect)
*/
export function createDrawer(
  store: IStore,
  canvas: HTMLCanvasElement,
): IDrawer {
  const context = canvas.getContext("2d");

  function draw(note: Note) {
    if (context) {
      context.fillStyle = note.color;
      context?.fillRect(note.x, note.y, note.width, note.height);

      drawResizeHandle(note);

      const { action } = store.state;
      const isSelected =
        (action.type === "dragging" || action.type === "resizing") &&
        action.note === note;

      if (isSelected) {
        /* Heighlight the note if it is mark as selected */
        const { defaultBorderColor } = store.config;

        context.strokeStyle = defaultBorderColor;
        context.lineWidth = 1;
        context.strokeRect(note.x, note.y, note.width, note.height);
      }
    }
  }

  function drawAll() {
    // reset the canvas
    context?.clearRect(0, 0, canvas.width, canvas.height);

    // draw all notes
    store.notes.forEach((n) => {
      draw(n);
    });
  }

  /* Helper function to draw the zone over the note to enable resize functionality */
  function drawResizeHandle(note: Note) {
    if (context) {
      const { defaultBorderColor, resizeHandleSize } = store.config;

      context.fillStyle = defaultBorderColor;
      context.fillRect(
        note.x + note.width - resizeHandleSize,
        note.y + note.height - resizeHandleSize,
        resizeHandleSize,
        resizeHandleSize,
      );
    }
  }

  return Object.freeze({
    draw,
    drawAll,
  });
}

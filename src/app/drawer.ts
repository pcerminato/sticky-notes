import type { IStore, IDrawer, Note } from "../types";

/* 
Creates a drawer object that exposes an API to control the rendering of the notes (CanvasRect)
*/
export function createDrawer(
  store: IStore,
  canvas: HTMLCanvasElement,
): IDrawer {
  const context = canvas.getContext("2d");
  let renderPending = false;

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

    drawDeleteZone();
  }

  /* Optimizes rendering by avoiding redundant paints  */
  function requestDraw() {
    if (renderPending) return; // Skip if a frame layout pass is already queued
    renderPending = true;

    requestAnimationFrame(() => {
      drawAll();
      renderPending = false; // Reset the flag once the screen finishes rendering
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

  function drawDeleteZone() {
    if (context) {
      const { action } = store.state;

      if (action.type === "dragging") {
        const { deleteZoneSize } = store.config;
        const zoneX = canvas.width - deleteZoneSize;
        const zoneY = canvas.height - deleteZoneSize;

        context.fillStyle = "rgba(216, 20, 59, .5)";
        context.fillRect(zoneX, zoneY, deleteZoneSize, deleteZoneSize);
      }
    }
  }

  return Object.freeze({
    draw,
    drawAll: requestDraw,
  });
}

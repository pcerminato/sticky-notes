import type { IStore, Note } from "../types";

/* 
Creates a drawer object that exposes an API to control the rendering of the notes (CanvasRect)
*/
export function createDrawer(store: IStore, canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");

  function draw(note: Note) {
    if (context) {
      context.fillStyle = note.color;
      context?.fillRect(note.x, note.y, note.width, note.height);

      if (store.state.selected && store.state.selected?.note === note) {
        /* Heighlight the note if it is mark as selected */
        const { x, y, width, height } = store.state.selected.note;

        context.strokeStyle = "#000";
        context.lineWidth = 1;
        context.strokeRect(x, y, width, height);
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

  return Object.freeze({
    draw,
    drawAll,
  });
}

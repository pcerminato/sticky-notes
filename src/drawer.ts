import type { IStore } from "./types";

export function createDrawer(store: IStore, canvas: HTMLCanvasElement) {
  return {
    draw: function draw() {
      const context = canvas.getContext("2d");
      const len = store.notes.length;

      if (len) {
        const { x, y } = store.notes[len - 1];
        context?.fillRect(x, y, 50, 50);
      }
    },
  };
}

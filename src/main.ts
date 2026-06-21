import "./style.css";
import { createDrawer } from "./app/drawer";
import { createNote } from "./app/note";
import { createStore } from "./app/store";
import {
  createCanvas,
  resizeCanvas,
  createCanvasMouseDownHandler,
  createCanvasMouseMoveHandler,
  createCanvasMouseUpHandler,
} from "./app/canvas";

(function startApp() {
  const canvas = createCanvas();
  const notesStore = createStore();
  const drawer = createDrawer(notesStore, canvas);

  canvas.addEventListener(
    "mousedown",
    createCanvasMouseDownHandler(canvas, notesStore, drawer, createNote),
  );
  canvas.addEventListener(
    "mousemove",
    createCanvasMouseMoveHandler(canvas, notesStore, drawer),
  );
  window.addEventListener(
    "mouseup",
    createCanvasMouseUpHandler(notesStore, drawer),
  );
  window.addEventListener("resize", () => resizeCanvas(canvas, drawer));

  resizeCanvas(canvas, drawer);
})();

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
import { saveNotesToStorage, readNotesFromStorage } from "./app/storage";
import type { Note } from "./types";
import { createEvents } from "./app/events";

/* IFEE to start the app */
(function () {
  let locaStorageNotes;

  try {
    locaStorageNotes = readNotesFromStorage();
  } catch (error) {
    console.error("Error. Cannot read notes from local storage");
  }

  startApp(locaStorageNotes);
})();

/* Composition and events binding to start the app */
function startApp(initialData?: Note[]) {
  const canvas = createCanvas();
  const eventsHub = createEvents();
  const notesStore = createStore(initialData);
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
    createCanvasMouseUpHandler(canvas, notesStore, drawer, eventsHub),
  );
  window.addEventListener("resize", () => resizeCanvas(canvas, drawer));

  resizeCanvas(canvas, drawer);

  window.addEventListener("notesChange", function (e) {
    /* 
    - Note on "performance vs consistency" -
      
    This implementation favors data consistency, because it persists the latest state on every mouseup.
    But as localStorage writes are synch (aka blocking), I am using requestIdleCallback() to do the writes 
    when the browser is idle (this idea is inspired by this tool https://github.com/GoogleChromeLabs/quicklink).
      
    A different approach that would favor performance is using a setInterval() to periodically and asynch save the records.
    But the data consistency would be compromised for example in the case that the user closes the browser after changing 
    the state and _before_ the interval ticks to save to localStorage; the latest state wouldn't be persisted.
      - Fix for that can be using window.onclose to trigger that last state save.
    */
    if (window.requestIdleCallback && e.detail) {
      window.requestIdleCallback(() => saveNotesToStorage(e.detail));
    }
  });
}

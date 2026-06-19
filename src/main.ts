import "./style.css";
import { createDrawer } from "./drawer";
import { createEvents, STORE_ADD } from "./events";
import { createNote } from "./note";
import { createStore } from "./store";
import { createCanvas, getClickCoordinates } from "./canvas";

(function startApp() {
  const canvas = createCanvas();
  const eventsHub = createEvents();
  const notesStore = createStore(eventsHub);
  const drawer = createDrawer(notesStore, canvas);

  canvas.onclick = function onCanvasClick(e) {
    const { x, y } = getClickCoordinates(canvas, e);

    notesStore.addNote(createNote({ x, y }));
  };
  console.log("hi");
  document.addEventListener(STORE_ADD, function () {
    drawer.draw();
  });
})();

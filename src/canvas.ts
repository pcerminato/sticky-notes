export function createCanvas() {
  const canvas = document.createElement("canvas");

  canvas.setAttribute("id", "sticky-notes");

  document.getElementsByTagName("body")[0].append(canvas);

  return canvas;
}
/* Returns the coordinates x and y where the cursor clicks relative to the canvas */
export function getClickCoordinates(
  canvas: HTMLCanvasElement,
  e: PointerEvent,
) {
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

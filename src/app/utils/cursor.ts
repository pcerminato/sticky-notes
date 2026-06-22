import type { Coordinates, Note, RectShape } from "../../types";

/* 
This files holds utility functions to work with cursor/mouse events
and pixels position calculations.
*/

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

/* Returns true when the cursor click happens over the area of the Rect */
export function clickIsOverArea(cursor: Coordinates, rect: RectShape) {
  return (
    cursor.x >= rect.x &&
    cursor.x <= rect.x + rect.width &&
    cursor.y >= rect.y &&
    cursor.y <= rect.y + rect.height
  );
}

/* Returns true when the cursor click happens over the area of the resize handle */
export function clickIsOverResizeHandle(
  cursor: Coordinates,
  note: Note,
  resizeHandleSize: number,
) {
  // shaping the resize handler rect as a
  const resizeHandleRect: RectShape = {
    x: note.x + note.width - resizeHandleSize,
    y: note.y + note.height - resizeHandleSize,
    width: resizeHandleSize,
    height: resizeHandleSize,
  };

  return clickIsOverArea(cursor, resizeHandleRect);
}

export function isOverDeleteZone(
  cursor: Coordinates,
  canvas: HTMLCanvasElement,
  deleteZoneSize: number,
) {
  const deleteZoneX = canvas.width - deleteZoneSize;
  const deleteZoneY = canvas.height - deleteZoneSize;

  return cursor.x >= deleteZoneX && cursor.y >= deleteZoneY;
}

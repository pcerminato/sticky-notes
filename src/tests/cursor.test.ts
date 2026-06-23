import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  RESIZE_HANDLE_SIZE,
  NOTE_WIDTH,
  NOTE_HEIGHT,
  DELETE_ZONE_SIZE,
  COLORS,
} from "../app/constants";
import type { Note, RectShape } from "../types";
import {
  clickIsOverArea,
  clickIsOverResizeHandle,
  getClickCoordinates,
  isOverDeleteZone,
} from "../app/utils/cursor";

describe("Cursor Mapping & Collision Math Helpers", () => {
  let mockCanvas: HTMLCanvasElement;
  let mockBounds: DOMRect;

  beforeEach(() => {
    mockCanvas = {
      width: 2000,
      height: 1000,
    } as unknown as HTMLCanvasElement;

    mockBounds = {
      left: 10,
      top: 20,
      width: 1000,
      height: 500,
      toJSON: () => {},
    } as DOMRect;

    vi.stubGlobal("document", {
      body: { append: vi.fn() },
    });
  });
  it("should transform layout box click points to high-resolution internal grid parameters", () => {
    const mockMouseEvent = { clientX: 510, clientY: 270 } as MouseEvent;
    const coords = getClickCoordinates(mockCanvas, mockMouseEvent, mockBounds);

    // (510 - 10) * (2000 / 1000) = 500 * 2 = 1000
    // (270 - 20) * (1000 / 500) = 250 * 2 = 500
    expect(coords.x).toBe(1000);
    expect(coords.y).toBe(500);
  });

  it("should verify when coordinates pass over a basic bounding box region", () => {
    const targetRect: RectShape = { x: 50, y: 50, width: 100, height: 100 };
    expect(clickIsOverArea({ x: 100, y: 100 }, targetRect)).toBe(true);
    expect(clickIsOverArea({ x: 40, y: 100 }, targetRect)).toBe(false);
  });

  it("should precisely match coordinates touching only the active corner handle area", () => {
    const note: Note = {
      x: 100,
      y: 100,
      width: NOTE_WIDTH,
      height: NOTE_HEIGHT,
      color: COLORS[0],
    };
    // Note dimensions are x:[100 to 300], y:[100 to 300]
    // With RESIZE_HANDLE_SIZE = 10, the handle zone sits exactly at x:[290 to 300], y:[290 to 300]

    expect(
      clickIsOverResizeHandle({ x: 295, y: 295 }, note, RESIZE_HANDLE_SIZE),
    ).toBe(true);
    expect(
      clickIsOverResizeHandle({ x: 200, y: 200 }, note, RESIZE_HANDLE_SIZE),
    ).toBe(false);
  });

  it("should compute absolute limits for the bottom-right corner delete zone", () => {
    const canvasConfig = { width: 1000, height: 1000 } as HTMLCanvasElement;
    // With DELETE_ZONE_SIZE = 200, the threshold line boundaries start at 800, 800

    expect(
      isOverDeleteZone({ x: 850, y: 850 }, canvasConfig, DELETE_ZONE_SIZE),
    ).toBe(true);
    expect(
      isOverDeleteZone({ x: 750, y: 850 }, canvasConfig, DELETE_ZONE_SIZE),
    ).toBe(false);
  });
});

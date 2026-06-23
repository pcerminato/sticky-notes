import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createCanvasMouseDownHandler,
  createCanvasMouseMoveHandler,
  createCanvasMouseUpHandler,
} from "../app/canvas";
import {
  RESIZE_HANDLE_SIZE,
  NOTE_WIDTH,
  NOTE_HEIGHT,
  DELETE_ZONE_SIZE,
  COLORS,
  BORDER_COLOR,
} from "../app/constants";
import type { IStore, IDrawer, IEvents, Note, State } from "../types";

describe("Sticky Notes Complete Integration & Unit Suite", () => {
  // Common shared execution variables
  let mockCanvas: HTMLCanvasElement;
  let mockBounds: DOMRect;
  let mockStore: IStore;
  let mockDrawer: IDrawer;
  let mockCreateNote: any;
  let mockEventsHub: IEvents;

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

    const initialNotesList: Note[] = [
      {
        x: 100,
        y: 100,
        width: NOTE_WIDTH,
        height: NOTE_HEIGHT,
        color: COLORS[0],
      },
    ];

    let internalNotes = [...initialNotesList];
    let internalState: State = { action: { type: "none" } };

    mockStore = {
      get notes() {
        return internalNotes;
      },
      config: {
        defaultWidth: NOTE_WIDTH,
        defaultHeight: NOTE_HEIGHT,
        colors: COLORS,
        defaultBorderColor: BORDER_COLOR,
        resizeHandleSize: RESIZE_HANDLE_SIZE,
        deleteZoneSize: DELETE_ZONE_SIZE,
      },
      addNote: (note: Note) => {
        internalNotes.push(note);
      },
      deleteNote: (note: Note) => {
        const idx = internalNotes.indexOf(note);
        if (idx !== -1) internalNotes.splice(idx, 1);
      },
      bringToFront: (note: Note) => {
        const idx = internalNotes.indexOf(note);
        if (idx !== -1) {
          internalNotes.splice(idx, 1);
          internalNotes.push(note);
        }
      },
      saveState: (newState: State) => {
        internalState = newState;
      },
      get state() {
        return internalState;
      },
    };

    mockDrawer = {
      draw: vi.fn(),
      drawAll: vi.fn(),
    };
    mockCreateNote = vi.fn().mockImplementation(({ x, y }) => ({
      x,
      y,
      width: NOTE_WIDTH,
      height: NOTE_HEIGHT,
      color: COLORS[0],
    }));
    mockEventsHub = { dispatchNotesChange: vi.fn() };
  });

  describe("Canvas Input Interaction Actions Loops", () => {
    it("should trigger note creation on an empty canvas click and execute standard drawing updates", () => {
      mockCanvas.getBoundingClientRect = vi.fn().mockReturnValue(mockBounds);

      const mousedownHandler = createCanvasMouseDownHandler(
        mockCanvas,
        mockStore,
        mockDrawer,
        mockCreateNote,
      );
      const mockEvent = { clientX: 600, clientY: 300 } as MouseEvent;

      mousedownHandler(mockEvent);

      expect(mockCreateNote).toHaveBeenCalled();
      expect(mockStore.notes).toHaveLength(2); // Base note + Spawned note
      expect(mockStore.state.action.type).toBe("none");
      expect(mockDrawer.drawAll).toHaveBeenCalled();
    });

    it("should update action properties to resizing and pull note forward when click matches handle", () => {
      mockCanvas.getBoundingClientRect = vi.fn().mockReturnValue(mockBounds);

      // Target handle box boundary hit coordinates match calculations:
      // Note width 200, height 200. Handle zone boundary triggers at x >= 290, y >= 290.
      // (155 - 10) * 2 = 290 and (165 - 20) * 2 = 290
      const mockEvent = { clientX: 155, clientY: 165 } as MouseEvent;

      const mousedownHandler = createCanvasMouseDownHandler(
        mockCanvas,
        mockStore,
        mockDrawer,
        mockCreateNote,
      );
      mousedownHandler(mockEvent);

      expect(mockStore.state.action.type).toBe("resizing");
      if (mockStore.state.action.type === "resizing") {
        expect(mockStore.state.action.note).toEqual(mockStore.notes[0]);
      }
    });

    it("should dynamically scale note height and width measurements on mousemove resizing strokes", () => {
      const activeNote = mockStore.notes[0];
      mockStore.saveState({
        action: {
          type: "resizing",
          note: activeNote,
          startWidth: NOTE_WIDTH,
          startHeight: NOTE_HEIGHT,
          initCursor: { x: 290, y: 290 },
        },
      });

      mockCanvas.getBoundingClientRect = vi.fn().mockReturnValue(mockBounds);
      const mousemoveHandler = createCanvasMouseMoveHandler(
        mockCanvas,
        mockStore,
        mockDrawer,
      );

      // Simulate moving dragging mouse down-right
      const mockMoveEvent = { clientX: 180, clientY: 190 } as MouseEvent;
      // cursor.x tracks to 340 (delta +50 from 290) -> width becomes 200 + 50 = 250
      // cursor.y tracks to 340 (delta +50 from 290) -> height becomes 200 + 50 = 250

      mousemoveHandler(mockMoveEvent);

      expect(activeNote.width).toBe(250);
      expect(activeNote.height).toBe(250);
      expect(mockDrawer.drawAll).toHaveBeenCalled();
    });

    it("should successfully trigger store deletion cycles if an object is released inside the trash coordinates", () => {
      const activeNote = mockStore.notes[0];

      // 1. Position note anchor origin parameters right past the 800,800 trigger line layout configuration
      activeNote.x = 850;
      activeNote.y = 850;

      // 2. Set active store state action structure
      mockStore.saveState({
        action: {
          type: "dragging",
          note: activeNote,
          cursorOffset: { x: 0, y: 0 },
        },
      });

      // 3. Explicitly calibrate canvas dimensions for runtime boundary math updates
      mockCanvas.width = 1000;
      mockCanvas.height = 1000;

      const mouseupHandler = createCanvasMouseUpHandler(
        mockCanvas,
        mockStore,
        mockDrawer,
        mockEventsHub,
      );
      mouseupHandler();

      // 4. Verification assertions
      expect(mockStore.notes).toHaveLength(0);
      expect(mockStore.state.action.type).toBe("none");
      expect(mockEventsHub.dispatchNotesChange).toHaveBeenCalledWith([]);
    });
  });
});

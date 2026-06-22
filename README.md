# Sticky Notes

## Features

1. Create a new note of the specified size at the specified position.

- The _specified position_ is where the click (`mousedown`) happens.
- The _size and color_ are specified as defaults `constants`.
- The app APIs allow parametrization of those values (size, color, position) so they can comes as external inputs to extend the functionality for inserting them from, for example, UI inputs or programatically (using `createNote()`).

2. Change note size by dragging.

- Each note has a _handle_ on the right-bottom corner to change its size by mousemove.
- There is a minimal size for the boxes, to avoid phantom behaviour in the UI.

3. Move a note by dragging.

- The dragging area is over the entire note, except for the area of the _handle_ for resizing, which would activate "resize" instead.

4. Remove a note by dragging it over a predefined "trash" zone.

- The _trash zone_ is at the bottom-right corner of the canvas.
- It is not visible by default, but it activates when the app is in "dragging" state.
- The approach to deletion is that the note has to fully enter in the _trash zone_:
  - Notes are not deleted if:
    - they are not fully in the _trash zone_
    - they are not in "selected" when "dragging" state, even if they are in the _trash zone_.

_Note selection_: by clicking over a note is it marked as selected (visually it has a highlighted border)

- To activate the "dragging" or "resize" a note has to be selected.
- As a note is selected, it comes to the the front, if it had other overlaping notes on top of it.

### Other features

- Moving a note to the front by selecting it (in case it has other notes overlaping it).
- Different note colors (a random color is set on note creation).

## Demos

### Main features

<video width="640" height="360" controls>
  <source src="https://github.com/user-attachments/assets/0c8ae071-0300-4bb2-a13c-566acda5811c" type="video/mp4">
  Demo video of sticky notes features
</video>

### Local storage

> video here.

## Approach

- Technologies
  - JavaScript/Typescript (language).
  - Canvas JS browser API.
  - JS browser Events.
  - Node.js.
  - Vite (`version 8`).
- Architecture
  - Dependency injection and inversion of control,
    - for composing the building blocks
    - and to have cleans API definition.
    - (mostly) pure function for standalone components and single responsibility (easier to test and debug or to add feature flags).
  - Event driven communication between components.
  - A centralized store to keep application state seamless and clean.

### Components

- `main.ts`. Entry point for dependency injection, composition and events binding.
  - `canvas.ts`. Defines the event handlers for the canvas.
  - `store.ts`. A centralized global _single-source-of-truth_ store to keep application state, data (the notes) and app config (default size, colors, etc.).
  - `drawer.ts`. It holds public (`draw()`, `drawAll()`) and private (`drawResizeHandle()`, `drawDeleteZone()`) functions relative to drawing elements over the canvas.
  - `note.ts`. It holds a single function to create a new note.
  - `utils/cursor.ts`. It holds utility functions to work with cursor/mouse events and pixels position calculations.

## Run locally

- Use Node.js version _20.10.+_, _22.12.+_, _23_ or higher, because it is required for the vite version installed ([+ info](https://vite.dev/blog/announcing-vite8#node-js-support)) to support ESM (modules).
  - You can `nvm use` to use `v24.14.1` defined for these project in .nvmrc.
- Install dependencies with `npm install`
- Run on dev mode with `npm run dev`

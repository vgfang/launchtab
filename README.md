# launchtab

CURRENTLY IN TESTING PHASE, RELEASE SOON

New tab replacement for quick link navigation using VIM-style keychords.
For Chromium-based browsers. ![Chrome Web Store](https://chromewebstore.google.com/)

<insert gif of general layout and keychording here>

## Features: 

- Highly personalizable new tab page
- Custom styling and font settings
- Import and export Data

## Guide:

- __Edit Mode__: press the edit button on the top right to enable edit mode
  - create/edit nodes
  - create/edit links
  - drag and drop links within or to other nodes
  - enables settings modal
    - adjust grid dimensions and css styling
    - import/export settings and node data

<insert gif of node and link editing with drag drop here and settings modal>

- __Keychord Navigation__: when creating a new tab, the address bar is focused
  - press ESC, and launchtab can listen to user input to match to keychords
  - once user input matches node keychord + link keychord:
    - the selected link will be previewed
    - pressing enter will redirect to that selected link
    - pressing enter with no selected link, clears user input

<insert gif of keychording feature but slower> 

## About: 
- Built using React + TS

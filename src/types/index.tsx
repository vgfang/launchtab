export interface Data {
  settings: Settings;
  nodes: Node[];
}

export interface Settings {
  grid: {
    sizeX: number,
    sizeY: number,
    width: number,
    padding: number,
    gap: number,
    radius: number,
  },
  colors: {
    fg: string,
    bg: string,
    accent: string,
    text: string
  }
}

export interface Link {
  uuid?: string;
  label: string;
  url: string;
  keychord: string;
}

export interface Node {
  uuid: string;
  label: string;
  posX: number;
  posY: number;
  height: number;
  width: number;
  emoji: string;
  keychord: string;
  links: Link[];
}

export enum LinkModalMode {
  ADD = 'ADD',
  EDIT = 'EDIT'
}

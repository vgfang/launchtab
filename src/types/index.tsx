export interface Data {
  settings: Settings;
  nodes: Node[];
}

export interface Settings {
  gridX: number;
  gridY: number;
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

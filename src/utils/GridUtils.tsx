import * as T from "../types";

export interface GridUtilsInterface {
  getEmptyGridLocations: (
    node: T.Node[],
    gridX: number,
    gridY: number,
  ) => { x: number; y: number }[];
  validateGrid: (
    node: T.Node[],
    gridX: number,
    gridY: number,
  ) => { valid: boolean; error?: string };
}

export const GridUtils: GridUtilsInterface = {
  getEmptyGridLocations: (
    nodes: T.Node[],
    gridX: number,
    gridY: number,
  ): { x: number; y: number }[] => {
    const x: number = gridX;
    const y: number = gridY;

    // grid indices start at 0, positions we are given start at 1
    const grid = Array(y)
      .fill(null)
      .map(() => Array(x).fill(false));
    for (const node of nodes) {
      for (let i = 0; i < node.width; i++) {
        for (let j = 0; j < node.height; j++) {
          grid[node.posX + i - 1][node.posY + j - 1] = true;
        }
      }
    }

    const emptyLocations: { x: number; y: number }[] = [];
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        if (!grid[i][j]) {
          emptyLocations.push({ x: i + 1, y: j + 1 });
        }
      }
    }
    return emptyLocations;
  },

  validateGrid: (
    nodes: T.Node[],
    gridX: number,
    gridY: number,
  ): T.Validation => {
    const x = gridX;
    const y = gridY;

    if (x <= 0 || y <= 0)
      return { valid: false, error: "settings grid size is invalid." };

    const grid = Array(y)
      .fill(null)
      .map(() => Array(x).fill(false));

    for (const node of nodes) {
      for (let i = 0; i < node.width; i++) {
        for (let j = 0; j < node.height; j++) {
          if (grid[node.posX + i - 1][node.posY + j - 1])
            return { valid: false, error: "nodes are overlapping." };
          if (
            node.posX + i - 1 > x ||
            node.posX + i - 1 < 0 ||
            node.posY + j - 1 < 0 ||
            node.posY + j - 1 > y
          ) {
            return {
              valid: false,
              error: "node positions are out of grid size bounds.",
            };
          }

          grid[node.posX + i - 1][node.posY + j - 1] = true;
        }
      }
    }

    return { valid: true };
  },
};

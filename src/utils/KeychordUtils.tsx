import * as T from "../types";

export interface KeychordUtilsInterface {
  getLinkMatchingKeychord: (
    nodes: T.Node[],
    keychord: string,
  ) => T.Link | undefined;
  getMatchingPrefix: (
    nodeKeychord: string,
    linkKeychord: string,
    keychord: string,
  ) => string;
}

export const KeychordUtils: KeychordUtilsInterface = {
  // get the matching link for the keychord
  getLinkMatchingKeychord: (
    nodes: T.Node[],
    keychord: string,
  ): T.Link | undefined => {
    let matchingLink: T.Link | undefined = undefined;
    if (keychord.length == 0) return undefined;
    for (const node of nodes) {
      for (const link of node.links) {
        if (node.keychord + link.keychord === keychord) {
          matchingLink = link;
        }
      }
    }
    return matchingLink;
  },

  // return the prefix substring of the keychord that matches keychord
  getMatchingPrefix: (nodeKeychord, linkKeychord, keychord): string => {
    const prefix = [];
    const fullKeychord = nodeKeychord + linkKeychord;
    for (let i = 0; i < fullKeychord.length; i++) {
      if (fullKeychord[i] == keychord[i]) prefix.push(fullKeychord[i]);
      else {
        break;
      }
    }

    return prefix.join("");
  },
};

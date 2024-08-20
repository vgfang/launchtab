import * as T from '../types'

export const getEmptyGridLocations = (data: T.Data): { x: number, y: number }[] => {
  const sizeX: number = data.settings.grid.sizeX
  const sizeY: number = data.settings.grid.sizeY


  return [{ 'x': 1, 'y': 2 }]
}

export const validateGrid = (data: T.Data): string => {
  console.log(data)
  return "valid"
}

// get the matching link for the keychord
export const getLinkMatchingKeychord = (nodes: T.Node[], keychord: string): T.Link | undefined => {
  let matchingLink: T.Link | undefined = undefined;
  if (keychord.length == 0)
    return undefined
  for (const node of nodes) {
    for (const link of node.links) {
      if (node.keychord + link.keychord === keychord) {
        matchingLink = link
      }
    }
  }
  return matchingLink
}


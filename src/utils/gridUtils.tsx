import * as T from '../types'

export const getEmptyGridLocations = (data: T.Data): { x: number, y: number }[] => {
  console.log(data)
  return [{ 'x': 1, 'y': 2 }]
}

export const validateGrid = (data: T.Data): string => {
  console.log(data)
  return "valid"
}

export const numMatchingChars = (str1: string, str2: string): number => {


}

// get the closest link for the keychord (longest prefix)
export const getLinkMatchingKeychord = (nodes: T.Node[], keychord: string) => {


  const matchingLink: T.Link | undefined = undefined;
  for (const node of nodes) {

    for (const link of node.links) {
      if (node.keychord + link.keychord == keychord) {
        return link
      } elif(node.keychord)
    }
  }
}

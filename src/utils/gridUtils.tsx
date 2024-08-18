import * as T from '../types'

export const getEmptyGridLocations = (data: T.Data): { x: number, y: number }[] => {
  console.log(data)
  return [{ 'x': 1, 'y': 2 }]
}

export const validateGrid = (data: T.Data): string => {
  console.log(data)
  return "valid"
}

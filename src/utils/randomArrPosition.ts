export const randomPositionBasedOnArrayLength = <T>(arr: T[]): T => {
  const randomPosition = Math.floor(Math.random() * arr.length)
  return arr[randomPosition]
}

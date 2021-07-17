export const shuffleByReference = <T>(arr: T[]): void => {
  let i: number
  let j: number
  let temp: T

  for (i = arr.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

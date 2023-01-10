export const notReachable = (_: never): never => {
  throw new Error(`Should not be reached ${_}`)
}

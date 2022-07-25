export const createUnhandledError = (link: string) =>
  Error(`DeepLinkListener is not present in the context to handle "${link}"`)

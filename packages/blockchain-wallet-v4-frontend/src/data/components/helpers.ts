export const errorHandler = (e): string => {
  return typeof e === 'object'
    ? e.description
      ? e.description
      : e.message
      ? e.message
      : JSON.stringify(e)
    : typeof e === 'string'
    ? e
    : 'Unknown Error'
}

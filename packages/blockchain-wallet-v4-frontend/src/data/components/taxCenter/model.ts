export const FIRST_YEAR = 2014

export const getLimits = (option) => {
  if (option === 0) {
    return {
      from: new Date(Date.UTC(FIRST_YEAR, 0, 1)).toISOString(),
      to: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
    }
  }

  return {
    from: new Date(Date.UTC(option, 0, 1)).toISOString(),
    to: new Date(Date.UTC(option, 11, 31)).toISOString()
  }
}

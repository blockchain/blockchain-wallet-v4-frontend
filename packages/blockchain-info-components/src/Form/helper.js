export const selectBorderColor = (state) => {
  switch (state) {
    case 'invalid':
      return 'error'
    case 'valid':
      return 'success'
    case 'initial':
    default:
      return 'grey100'
  }
}

export const selectFocusBorderColor = (state) => {
  switch (state) {
    case 'invalid':
      return 'error'
    case 'valid':
      return 'success'
    case 'initial':
    default:
      return 'blue600'
  }
}

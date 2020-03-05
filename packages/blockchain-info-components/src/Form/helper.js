export const selectBorderColor = state => {
  switch (state) {
    case 'initial':
      return 'grey100'
    case 'invalid':
      return 'error'
    case 'valid':
      return 'success'
    default:
      return 'grey100'
  }
}

export const selectFocusBorderColor = state => {
  switch (state) {
    case 'initial':
      return 'blue600'
    case 'invalid':
      return 'error'
    case 'valid':
      return 'success'
    default:
      return 'blue600'
  }
}

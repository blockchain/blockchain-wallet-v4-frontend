import { equals, length } from 'ramda'

export const isValid = state => !equals(state, 'invalid')

export const hasValue = value => !equals(length(value), 0)

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

export const selectBackgroundColor = state => {
  switch (state) {
    case 'initial':
      return 'grey000'
    case 'invalid':
      return 'red000'
    case 'valid':
      return 'success'
    default:
      return 'grey000'
  }
}

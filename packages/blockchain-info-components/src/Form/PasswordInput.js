import React from 'react'
import { BaseInput } from './'

const BasePasswordInput = BaseInput.extend.attrs({
  type: 'password'
})``

const selectBorderColor = (state) => {
  switch (state) {
    case 'initial': return 'midgrey'
    case 'invalid': return 'error'
    case 'valid': return 'success'
    default: return 'midgrey'
  }
}

const PasswordInput = props => {
  const { errorState, ...rest } = props
  const borderColor = selectBorderColor(errorState)

  return <BasePasswordInput borderColor={borderColor} {...rest} />
}

export default PasswordInput

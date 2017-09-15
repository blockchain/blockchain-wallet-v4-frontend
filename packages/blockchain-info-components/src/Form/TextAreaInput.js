import React from 'react'
import { BaseInput } from './'

const BaseTextAreaInput = BaseInput.withComponent('textarea').extend``

const selectBorderColor = (state) => {
  switch (state) {
    case 'initial': return 'midgrey'
    case 'invalid': return 'error'
    case 'valid': return 'success'
    default: return 'midgrey'
  }
}

const TextAreaInput = props => {
  const { errorState, ...rest } = props
  const borderColor = selectBorderColor(errorState)

  return <BaseTextAreaInput borderColor={borderColor} {...rest} />
}

export default TextAreaInput

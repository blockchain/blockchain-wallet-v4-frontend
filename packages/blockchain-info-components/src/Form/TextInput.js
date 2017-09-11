import React from 'react'
import styled from 'styled-components'

const BaseTextInput = styled.input.attrs({
  type: 'text'
})``

const selectBorderColor = (state) => {
  switch (state) {
    case 'initial': return 'midgrey'
    case 'invalid': return 'error'
    case 'valid': return 'success'
    default: return 'midgrey'
  }
}

const TextInput = props => {
  const { errorState, ...rest } = props
  const borderColor = selectBorderColor(errorState)

  return <BaseTextInput borderColor={borderColor} {...rest} />
}

export default TextInput

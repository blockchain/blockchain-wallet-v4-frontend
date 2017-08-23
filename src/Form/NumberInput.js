import React from 'react'
import styled from 'styled-components'
import { DefaultColor } from '../Colors'

const BaseNumberInput = styled.input.attrs({
  type: 'number'
})`
  display: block;
  width: 100%;
  height: 40px;
  min-height: 40px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.42;
  color: ${DefaultColor.text};
  background-color: ${DefaultColor.white};
  background-image: none;
  outline-width: 0;
  user-select: text;
  border: 1px solid ${props => props.borderColor};

  &::-webkit-input-placeholder { color: ${DefaultColor.text}; }
`

const selectBorderColor = (state) => {
  switch (state) {
    case 'initial': return DefaultColor.midgrey
    case 'invalid': return DefaultColor.invalidred
    case 'valid': return DefaultColor.green
    default: return DefaultColor.midgrey
  }
}

const NumberInput = props => {
  const { errorState, ...rest } = props
  const borderColor = selectBorderColor(errorState)

  return <BaseNumberInput borderColor={borderColor} {...rest} />
}

export default NumberInput

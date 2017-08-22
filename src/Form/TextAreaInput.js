import React from 'react'
import styled from 'styled-components'
import { DefaultColor } from '../Colors'

const BaseTextAreaInput = styled.textarea`
  display: block;
  width: 100%;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.42;
  color: ${DefaultColor.text};
  background-color: ${DefaultColor.white};
  background-image: none;
  outline-width: 0;
  user-select: text;
  resize: none;
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

const TextAreaInput = props => {
  const { errorState, ...rest } = props
  const borderColor = selectBorderColor(errorState)

  return <BaseTextAreaInput borderColor={borderColor} {...rest} />
}

export default TextAreaInput

import React from 'react'
import styled from 'styled-components'

const BaseTextInput = styled.input.attrs({
  type: 'text'
})`
  display: block;
  width: 100%;
  height: ${props => props.height};
  min-height: ${props => props.minHeight ? props.minHeight : '40px'};
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.42;
  color: ${props => props.theme['gray-5']};
  background-color: ${props => props.theme['white']};
  background-image: none;
  outline-width: 0;
  user-select: text;
  border: 1px solid  ${props => props.theme[props.borderColor]};

  &::-webkit-input-placeholder {
    color: ${props => props.theme['gray-2']};
  }
`

const selectBorderColor = (state) => {
  switch (state) {
    case 'initial': return 'gray-2'
    case 'invalid': return 'error'
    case 'valid': return 'success'
    default: return 'gray-2'
  }
}

const TextInput = props => {
  const { errorState, ...rest } = props
  const borderColor = selectBorderColor(errorState)

  return <BaseTextInput borderColor={borderColor} {...rest} />
}

Text.defaultProps = {
  height: '40px',
  minHeight: '40px'
}

export default TextInput

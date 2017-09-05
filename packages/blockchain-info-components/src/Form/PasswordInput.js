import React from 'react'
import styled from 'styled-components'

const BasePasswordInput = styled.input.attrs({
  type: 'password'
})`
  display: block;
  width: 100%;
  height: 40px;
  min-height: 40px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.42;
  color:  ${props => props.theme['gray-2']};
  background-color:  ${props => props.theme['white']};
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

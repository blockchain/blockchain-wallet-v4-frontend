import React from 'react'
import styled from 'styled-components'

const BaseDateInput = styled.input.attrs({
  type: 'date'
})`
  display: block;
  width: 100%;
  height: 40px;
  min-height: 40px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 300;
  color: ${props => props.theme['gray-5']};
  background-color: ${props => props.theme['white']};
  font-family: 'Montserrat', Helvetica, sans-serif;
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

const DateInput = props => {
  const { errorState, ...rest } = props
  const borderColor = selectBorderColor(errorState)

  return <BaseDateInput borderColor={borderColor} {...rest} />
}

export default DateInput

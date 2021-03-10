import React from 'react'
import styled from 'styled-components'

import selectArrow from '../Images/img/select-arrow.png'

const BaseSelectInput = styled.select`
  height: 30px;
  width: 160px;
  font-size: 13px;
  font-weight: 400;
  padding: 2px 6px;
  outline: none;
  appearance: none;
  border-radius: 3px;
  background-image: url(${selectArrow});
  background-size: 12px;
  background-repeat: no-repeat;
  background-position: center right 10px;
  color: ${props => props.theme['grey800']};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: ${props => props.theme.white};
  border: 1px solid ${props => props.theme.grey200};
  margin-left: ${props => (props.inline ? '5px' : '0px')};
  &:active,
  &:focus {
    border: 1px solid ${props => props.theme.blue600};
  }
`

const selectBorderColor = state => {
  switch (state) {
    case 'initial':
      return 'grey200'
    case 'invalid':
      return 'error'
    case 'valid':
      return 'success'
    default:
      return 'grey200'
  }
}

const SelectInput = props => {
  const { disabled, errorState, input, ...rest } = props
  const borderColor = selectBorderColor(errorState)

  return (
    <BaseSelectInput
      inline
      borderColor={borderColor}
      disabled={disabled}
      onChange={input.onChange}
      {...rest}
    />
  )
}

export default SelectInput

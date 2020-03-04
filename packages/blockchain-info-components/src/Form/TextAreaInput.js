import React from 'react'
import styled from 'styled-components'

import {
  hasValue,
  isValid,
  selectBackgroundColor,
  selectBorderColor,
  selectFocusBorderColor
} from './helper'

const BaseTextAreaInput = styled.textarea`
  display: block;
  width: 100%;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  color: ${props => props.theme['gray-6']};
  background-color: ${({ bgColor, hasValue, isValid, theme }) =>
    hasValue && isValid ? theme.white : theme[bgColor]};
  background-image: none;
  outline-width: 0;
  user-select: text;
  font-weight: 500;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  resize: ${props => (props.resize ? 'initial' : 'none')};
  border: ${({ borderColor, hasValue, isValid, theme }) =>
    hasValue && isValid
      ? `1px solid ${theme[borderColor]}`
      : '1px solid transparent'};
  border-radius: 8px;

  &:focus {
    padding: 5px 11px;
    background-color: ${({ theme }) => theme.white};
    border: 1px solid
      ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
  }

  &::-webkit-input-placeholder {
    opacity: 0.4;
    color: ${props => props.theme['gray-3']};
    font-size: 14px;
    font-weight: 500;
  }
`

const TextAreaInput = ({ errorState, value, ...rest }) => (
  <BaseTextAreaInput
    bgColor={selectBackgroundColor(errorState)}
    borderColor={selectBorderColor(errorState)}
    focusedBorderColor={selectFocusBorderColor(errorState)}
    hasValue={hasValue(value)}
    isValid={isValid(errorState)}
    value={value}
    {...rest}
  />
)

TextAreaInput.defaultProps = {
  resize: true
}

export default TextAreaInput

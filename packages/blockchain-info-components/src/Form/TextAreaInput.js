import React from 'react'
import styled from 'styled-components'

import { selectBorderColor, selectFocusBorderColor } from './helper'

const BaseTextAreaInput = styled.textarea`
  display: block;
  width: 100%;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  color: ${props => props.theme['grey800']};
  background-color: ${({ theme }) => theme.white};
  background-image: none;
  outline-width: 0;
  user-select: text;
  font-weight: 500;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  resize: ${props => (props.resize ? 'initial' : 'none')};
  border: ${({ borderColor, theme }) => `1px solid ${theme[borderColor]}`};
  border-radius: 8px;

  &:focus {
    border: 1px solid
      ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
  }
  &:focus::placeholder {
    opacity: 0.25;
  }
  &::placeholder {
    color: ${props => props.theme.grey400};
    font-size: 14px;
    font-weight: 500;
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${props => props.theme.grey100};
    border: '1px solid transparent';
  }
`

const TextAreaInput = ({ errorState, value, ...rest }) => (
  <BaseTextAreaInput
    borderColor={selectBorderColor(errorState)}
    focusedBorderColor={selectFocusBorderColor(errorState)}
    value={value}
    {...rest}
  />
)

TextAreaInput.defaultProps = {
  resize: true
}

export default TextAreaInput

import React from 'react'
import styled from 'styled-components'

import {
  hasValue,
  isValid,
  selectBackgroundColor,
  selectBorderColor,
  selectFocusBorderColor
} from './helper'

const BasePasswordInput = styled.input.attrs({
  type: 'password',
  spellCheck: 'false',
  disabled: props => props.disabled,
  'data-lpignore': props => props.noLastPass
})`
  position: relative;
  display: block;
  width: 100%;
  height: 48px;
  min-height: 48px;
  padding: 6px 12px;
  box-sizing: border-box;
  letter-spacing: 4px;
  font-size: 20px;
  font-weight: 500;
  color: ${props => props.theme['gray-6']};
  background-color: ${({ bgColor, hasValue, isValid, theme }) =>
    hasValue && isValid ? theme.white : theme[bgColor]};
  background-image: none;
  outline-width: 0;
  user-select: text;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  border-radius: 8px;
  border: ${({ borderColor, hasValue, isValid, theme }) =>
    hasValue ? (isValid ? `1px solid ${theme[borderColor]}` : 'none') : 'none'};

  &:focus {
    background-color: ${({ theme }) => theme.white};
    border: 1px solid
      ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
  }
  &::-webkit-input-placeholder {
    color: ${props => props.theme.grey100};
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${props => props.theme['gray-1']};
  }
`

class PasswordInput extends React.Component {
  componentDidUpdate (prevProps) {
    if (this.props.active && !prevProps.active && this.input) {
      this.input.focus()
    }
  }

  refInput = input => {
    this.input = input
  }

  render () {
    const { active, errorState, value, ...rest } = this.props

    return (
      <BasePasswordInput
        ref={this.refInput}
        bgColor={selectBackgroundColor(errorState)}
        borderColor={selectBorderColor(errorState)}
        data-e2e={this.props['data-e2e']}
        focusedBorderColor={selectFocusBorderColor(errorState)}
        hasValue={hasValue(value)}
        isValid={isValid(errorState)}
        value={value}
        {...rest}
      />
    )
  }
}

export default PasswordInput

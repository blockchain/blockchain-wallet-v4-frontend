import React from 'react'
import styled from 'styled-components'

import { selectBorderColor, selectFocusBorderColor } from './helper'

const BasePasswordInput = styled.input.attrs((props) => ({
  'data-lpignore': props.noLastPass,
  disabled: props.disabled,
  spellCheck: 'false',
  type: 'password'
}))`
  position: relative;
  display: block;
  width: 100%;
  height: 48px;
  min-height: 48px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.grey800};
  background-color: ${({ theme }) => theme.white};
  background-image: none;
  outline-width: 0;
  user-select: text;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  border-radius: 8px;
  border: ${({ borderColor, theme }) => `1px solid ${theme[borderColor]}`};

  &:focus {
    border: 1px solid ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
  }
  &:focus::placeholder {
    opacity: 0.25;
  }
  &::placeholder {
    color: ${(props) => props.theme.grey400};
    font-size: 14px;
    font-weight: 500;
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${(props) => props.theme.grey100};
    border: 1px solid transparent;
  }
`

class PasswordInput extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.active && !prevProps.active && this.input) {
      this.input.focus()
    }
  }

  refInput = (input) => {
    this.input = input
  }

  render() {
    const { active, errorState, noLastPass, value, ...rest } = this.props

    return (
      <BasePasswordInput
        ref={this.refInput}
        borderColor={selectBorderColor(errorState)}
        data-e2e={this.props['data-e2e']}
        focusedBorderColor={selectFocusBorderColor(errorState)}
        value={value}
        {...rest}
      />
    )
  }
}

export default PasswordInput

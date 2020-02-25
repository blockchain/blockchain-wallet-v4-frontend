import { equals, length } from 'ramda'
import React from 'react'
import styled from 'styled-components'

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

const selectBorderColor = state => {
  switch (state) {
    case 'initial':
      return 'grey100'
    case 'invalid':
      return 'error'
    case 'valid':
      return 'success'
    default:
      return 'grey100'
  }
}

const selectFocusBorderColor = state => {
  switch (state) {
    case 'initial':
      return 'blue600'
    case 'invalid':
      return 'error'
    case 'valid':
      return 'success'
    default:
      return 'blue600'
  }
}

const selectBackgroundColor = state => {
  switch (state) {
    case 'initial':
      return 'grey000'
    case 'invalid':
      return 'red000'
    case 'valid':
      return 'success'
    default:
      return 'grey000'
  }
}

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
    const hasValue = !equals(length(value), 0)
    const isValid = !equals(errorState, 'invalid')
    const bgColor = selectBackgroundColor(errorState)
    const borderColor = selectBorderColor(errorState)
    const focusedBorderColor = selectFocusBorderColor(errorState)

    return (
      <BasePasswordInput
        ref={this.refInput}
        bgColor={bgColor}
        borderColor={borderColor}
        data-e2e={this.props['data-e2e']}
        focusedBorderColor={focusedBorderColor}
        hasValue={hasValue}
        isValid={isValid}
        {...rest}
      />
    )
  }
}

export default PasswordInput

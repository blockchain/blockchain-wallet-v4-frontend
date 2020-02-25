import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import {
  hasValue,
  isValid,
  selectBackgroundColor,
  selectBorderColor,
  selectFocusBorderColor
} from './helper'
import { Icon } from '../Icons'

const BaseTextInput = styled.input.attrs({
  type: 'text',
  'data-lpignore': props => props.noLastPass,
  disabled: props => props.disabled,
  maxLength: props => props.maxLength,
  spellCheck: props => (props.disableSpellcheck ? 'false' : 'true')
})`
  display: block;
  width: 100%;
  height: ${props => props.height};
  min-height: ${props => props.height};
  padding: ${props => (props.icon ? '6px 12px 6px 38px' : '6px 12px')};
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme['gray400']};
  background-color: ${({ bgColor, hasValue, isValid, theme }) =>
    hasValue && isValid ? theme.white : theme[bgColor]};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-image: none;
  outline-width: 0;
  user-select: text;
  border: ${({ borderColor, hasValue, isValid, theme }) =>
    hasValue ? (isValid ? `1px solid ${theme[borderColor]}` : 'none') : 'none'};
  border-right: ${props => (props.borderRightNone ? 'none' : '')};
  border-radius: 8px;

  &:focus {
    background-color: ${({ theme }) => theme.white};
    border: 1px solid
      ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
  }
  &::placeholder {
    color: ${props => props.theme['gray-3']};
    opacity: 0.4;
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${props => props.theme['gray-1']};
  }
`
const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
`
const InputIcon = styled(Icon)`
  position: absolute;
  top: 12px;
  left: 12px;
  color: ${props => props.theme['grey400']};
`

class TextInput extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    height: PropTypes.string,
    minHeight: PropTypes.string
  }

  static defaultProps = {
    disabled: false,
    height: '48px',
    minHeight: '48px'
  }

  componentDidUpdate (prevProps) {
    if (this.props.active && !prevProps.active && this.input) {
      this.input.focus()
    }
  }

  refInput = input => {
    this.input = input
  }

  onKeyPressed = evt => {
    const event = evt || window.event
    if (event.keyCode === 27) {
      event.stopPropagation()
      this.input.blur()
    }
  }

  render () {
    const { disabled, errorState, icon, iconSize, value, ...rest } = this.props

    return (
      <Container>
        {icon && <InputIcon name={icon} size={iconSize} />}
        <BaseTextInput
          bgColor={selectBackgroundColor(errorState)}
          borderColor={selectBorderColor(errorState)}
          disabled={disabled}
          data-e2e={this.props['data-e2e']}
          focusedBorderColor={selectFocusBorderColor(errorState)}
          hasValue={hasValue(value)}
          isValid={isValid(errorState)}
          icon={icon}
          onKeyDown={this.onKeyPressed}
          ref={this.refInput}
          value={value}
          {...rest}
        />
      </Container>
    )
  }
}

export default TextInput

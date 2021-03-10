import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from '../Icons'
import { selectBorderColor, selectFocusBorderColor } from './helper'

const BaseTextInput = styled.input.attrs(props => ({
  type: 'text',
  'data-lpignore': props.noLastPass,
  disabled: props.disabled,
  maxLength: props.maxLength,
  spellCheck: props.disableSpellcheck ? 'false' : 'true'
}))`
  display: block;
  width: 100%;
  height: ${props => props.height};
  min-height: ${props => props.height};
  padding: ${props => (props.icon ? '6px 12px 6px 38px' : '6px 12px')};
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme['grey800']};
  background-color: ${({ theme }) => theme.white};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-image: none;
  outline-width: 0;
  user-select: text;
  border: ${({ borderColor, theme }) => `1px solid ${theme[borderColor]}`};
  border-right: ${props => (props.borderRightNone ? 'none' : '')};
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

  componentDidUpdate(prevProps) {
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

  render() {
    const {
      active,
      borderColor,
      borderRightNone,
      disabled,
      errorState,
      focusedBorderColor,
      icon,
      iconSize,
      minHeight,
      value,
      ...rest
    } = this.props

    return (
      <Container>
        {icon && <InputIcon name={icon} size={iconSize} />}
        <BaseTextInput
          borderColor={selectBorderColor(errorState)}
          disabled={disabled}
          data-e2e={this.props['data-e2e']}
          focusedBorderColor={selectFocusBorderColor(errorState)}
          icon={icon}
          onKeyDown={this.onKeyPressed}
          ref={this.refInput}
          value={value}
          minHeight={minHeight}
          {...rest}
        />
      </Container>
    )
  }
}

export default TextInput

import React from 'react'
import AutosizeInput from 'react-input-autosize'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { selectBorderColor, selectFocusBorderColor } from './helper'

const BaseTextInput = styled(AutosizeInput).attrs(props => ({
  type: 'text',
  'data-lpignore': props.noLastPass,
  disabled: props.disabled,
  maxLength: props.maxLength
}))`
  display: block;
  width: 100%;
  height: ${props => props.height};
  min-height: ${props => (props.minHeight ? props.minHeight : '40px')};
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme['grey800']};
  background-color: ${props => props.theme.white};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-image: none;
  outline-width: 0;
  user-select: text;
  border: 1px solid ${props => props.theme[props.borderColor]};
  border-right: ${props => (props.borderRightNone ? 'none' : '')};

  &:focus {
    border: 1px solid
      ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
  }
  &:focus::placeholder {
    opacity: 0.25;
  }
  &::placeholder {
    color: ${props => props.theme.grey600};
    font-size: 14px;
    font-weight: 500;
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${props => props.theme.grey100};
    border: '1px solid transparent';
  }
`

class TextInput extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    height: PropTypes.string,
    minHeight: PropTypes.string
  }

  static defaultProps = {
    disabled: false,
    height: '40px',
    minHeight: '40px'
  }

  componentDidUpdate(prevProps) {
    if (this.props.active && !prevProps.active && this.input) {
      this.input.focus()
    }
  }

  refInput = input => {
    this.input = input
  }

  render() {
    const {
      active,
      borderColor,
      borderRightNone,
      disabled,
      errorState,
      focusedBorderColor,
      minHeight,
      noLastPass,
      ...rest
    } = this.props
    return (
      <BaseTextInput
        ref={this.refInput}
        borderColor={selectBorderColor(errorState)}
        focusedBorderColor={selectFocusBorderColor(errorState)}
        disabled={disabled}
        data-e2e={this.props['data-e2e']}
        {...rest}
      />
    )
  }
}

export default TextInput

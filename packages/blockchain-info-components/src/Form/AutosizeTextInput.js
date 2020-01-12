import AutosizeInput from 'react-input-autosize'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const BaseTextInput = styled(AutosizeInput).attrs({
  type: 'text',
  'data-lpignore': props => props.noLastPass,
  disabled: props => props.disabled,
  maxLength: props => props.maxLength
})`
  display: block;
  width: 100%;
  height: ${props => props.height};
  min-height: ${props => (props.minHeight ? props.minHeight : '40px')};
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme['gray-6']};
  background-color: ${props => props.theme.white};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-image: none;
  outline-width: 0;
  user-select: text;
  border: 1px solid ${props => props.theme[props.borderColor]};
  border-right: ${props => (props.borderRightNone ? 'none' : '')};

  &::placeholder {
    color: ${props => props.theme['gray-3']};
    opacity: 0.4;
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

  componentDidUpdate (prevProps) {
    if (this.props.active && !prevProps.active && this.input) {
      this.input.focus()
    }
  }

  refInput = input => {
    this.input = input
  }

  render () {
    const { errorState, disabled, ...rest } = this.props
    const borderColor = selectBorderColor(errorState)
    return (
      <BaseTextInput
        ref={this.refInput}
        borderColor={borderColor}
        disabled={disabled}
        data-e2e={this.props['data-e2e']}
        {...rest}
      />
    )
  }
}

export default TextInput

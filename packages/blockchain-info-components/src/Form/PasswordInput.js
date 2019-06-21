import React from 'react'
import styled from 'styled-components'

const BasePasswordInput = styled.input.attrs({
  type: 'password',
  spellCheck: 'false',
  disabled: props => props.disabled,
  'data-lpignore': props => props.noLastPass
})`
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
  background-color: ${props => props.theme['white']};
  background-image: none;
  outline-width: 0;
  user-select: text;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  border: 1px solid ${props => props.theme[props.borderColor]};
  border-radius: 4px;
  &::-webkit-input-placeholder {
    color: ${props => props.theme['grey100']};
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
    const { errorState, ...rest } = this.props
    const borderColor = selectBorderColor(
      this.props.controlledBorderColor || errorState
    )

    return (
      <BasePasswordInput
        ref={this.refInput}
        borderColor={borderColor}
        data-e2e={this.props['data-e2e']}
        {...rest}
      />
    )
  }
}

export default PasswordInput

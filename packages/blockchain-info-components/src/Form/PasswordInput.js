import React from 'react'
import styled from 'styled-components'

const BasePasswordInput = styled.input.attrs({
  type: 'password',
  disabled: props => props.disabled,
  'data-lpignore': props => props.noLastPass
})`
  display: block;
  width: 100%;
  height: 40px;
  min-height: 40px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 300;
  color: ${props => props.theme['gray-5']};
  background-color: ${props => props.theme['white']};
  background-image: none;
  outline-width: 0;
  user-select: text;
  font-family: 'Montserrat', Helvetica, sans-serif;
  border: 1px solid ${props => props.theme[props.borderColor]};
  &::-webkit-input-placeholder {
    color: ${props => props.theme['gray-2']};
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${props => props.theme['gray-1']};
  }
`

const selectBorderColor = state => {
  switch (state) {
    case 'initial':
      return 'gray-2'
    case 'invalid':
      return 'error'
    case 'valid':
      return 'success'
    default:
      return 'gray-2'
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

import React from 'react'
import styled from 'styled-components'

const BaseTextAreaInput = styled.textarea`
  display: block;
  width: 100%;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  color: ${props => props.theme['gray-6']};
  background-color: ${props => props.theme.white};
  background-image: none;
  outline-width: 0;
  user-select: text;
  font-weight: 500;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  resize: ${props => (props.resize ? 'initial' : 'none')};
  border: 1px solid ${props => props.theme.grey100};
  border-radius: 4px;

  &::-webkit-input-placeholder {
    opacity: 0.4;
    color: ${props => props.theme['gray-3']};
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

const TextAreaInput = props => {
  const { errorState, ...rest } = props
  const borderColor = selectBorderColor(errorState)
  return <BaseTextAreaInput borderColor={borderColor} {...rest} />
}

TextAreaInput.defaultProps = {
  resize: true
}

export default TextAreaInput

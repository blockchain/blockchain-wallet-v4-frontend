import React, { InputHTMLAttributes } from 'react'
import { CommonFieldInputProps } from 'redux-form'
import styled from 'styled-components'

const StyledInput = styled.input`
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.grey100};
  &::placeholder {
    color: ${(props) => props.theme.grey400};
    font-weight: 500;
    font-size: 16px;
  }
`

const TextWithQRScanner: React.FC<Props> = (props) => {
  return (
    <StyledInput {...props} {...props.input}>
      {props.children}
    </StyledInput>
  )
}

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  input: CommonFieldInputProps
  placeholder: string
}

export default TextWithQRScanner

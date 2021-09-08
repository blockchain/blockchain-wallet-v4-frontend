import React, { InputHTMLAttributes } from 'react'
import { CommonFieldInputProps } from 'redux-form'
import styled from 'styled-components'

import QRCodeCapture from 'components/QRCode/Capture'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`
const QRWrapper = styled.div`
  position: absolute;
  top: 3px;
  right: 3px;
`
const StyledInput = styled.input`
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey100};
  &::placeholder {
    color: ${(props) => props.theme.grey400};
    font-weight: 500;
    font-size: 16px;
  }
`

const TextWithQRScanner: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      <StyledInput {...props} {...props.input}>
        {props.children}
      </StyledInput>
      <QRWrapper>
        <QRCodeCapture onScan={props.onScan} border={[]} />
      </QRWrapper>
    </Wrapper>
  )
}

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  input: CommonFieldInputProps
  onScan: (data: string) => void
  placeholder: string
}

export default TextWithQRScanner

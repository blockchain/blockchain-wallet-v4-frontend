import React from 'react'
import { CopyToClipboard } from '@blockchain-com/constellation'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`
const StyledInput = styled.input`
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.grey100};
  &::placeholder {
    color: ${({ theme }) => theme.grey400};
    font-weight: 500;
    font-size: 16px;
  }
`

const IconWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 4px;
`

const TextInputWithCopyToClipboard: React.FC<Props> = ({ value }) => {
  return (
    <Wrapper>
      <StyledInput disabled value={value} />
      <IconWrapper>
        <CopyToClipboard color='blue400' value={value} />
      </IconWrapper>
    </Wrapper>
  )
}

type Props = {
  value: string
}

export default TextInputWithCopyToClipboard

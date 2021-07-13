import React from 'react'
import styled, { css } from 'styled-components'

const StyledBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.grey100};
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 24px;
  cursor: pointer;
  padding: 16px 24px;
  line-height: 21px;
  ${(props) => props.isMobile && `width: 100%;`}
  ${(props) =>
    props.disabled &&
    css`
      background-color: ${(props) => props.theme.grey000}
      cursor: not-allowed;
    `}
`

const Box = (props) => {
  const { children } = props
  return (
    <StyledBox
      disabled={props.disabled}
      isMethod={props.isMethod}
      isMobile={props.isMobile}
      {...props}
    >
      {children}
    </StyledBox>
  )
}

export default Box

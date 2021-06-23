import React from 'react'
import styled, { css } from 'styled-components'

const StyledBox = styled.div`
  border: 1px solid ${(props) => props.theme.grey100};
  box-sizing: border-box;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding: ${(props) => (props.isMethod ? `12px 28px` : `23px 28px`)};
  justify-content: space-between;
  ${(props) => props.isMobile && `width: 100%;`}
  ${(props) => !props.isMethod && `line-height: 32px;`}
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

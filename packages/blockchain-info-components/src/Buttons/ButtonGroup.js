import React from 'react'
import styled from 'styled-components'

const BaseButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 5px;

  & > * {
    display: inline-flex !important;
  }
  & > :first-child {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
  & > :last-child {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
  & > :not(:first-child):not(:last-child) {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-right: none;
  }
`
const ButtonGroup = props => {
  const { children, ...rest } = props

  return <BaseButtonGroup {...rest}>{children}</BaseButtonGroup>
}

export default ButtonGroup

import React from 'react'
import styled from 'styled-components'

const Footer = styled.div<{ collapsed?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  padding: 40px;
  ${({ collapsed }) => (!collapsed && 'height: 50%;') || ''}

  @media (max-width: 767px) {
    padding: 20px;
  }
`

const FlyoutFooter = (props: Props) => {
  return <Footer collapsed={props.collapsed}>{props.children}</Footer>
}

export type Props = {
  children?: React.ReactNode
  collapsed?: boolean
}

export default React.memo(FlyoutFooter)

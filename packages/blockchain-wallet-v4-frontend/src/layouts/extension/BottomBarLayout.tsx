import React from 'react'
import styled from 'styled-components'

import { extensionHeight, extensionWidth } from '../../routes/extensionRoutes'

const Wrapper = styled.div`
  position: relative;
  background: ${(props) => props.theme.exchangeLogin};
  width: ${() => `${extensionWidth}px`};
  height: ${() => `${extensionHeight}px`};
`

const Content = styled.div`
  padding: 20px 20px 70px 20px;
  box-sizing: border-box;
  overflow-y: scroll;
  height: 100%;
`

const Footer = styled.div`
  position: absolute;
  height: 67px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.exchangeLogin};
  bottom: 0;
  width: 100%;
`

type Props = {
  children: JSX.Element
  footer: JSX.Element
}

const BottomBarLayout = ({ children, footer }: Props): JSX.Element => {
  return (
    <Wrapper>
      <Content>{children}</Content>
      <Footer>{footer}</Footer>
    </Wrapper>
  )
}

export default BottomBarLayout

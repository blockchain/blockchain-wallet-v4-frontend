import React from 'react';
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
  overflow-y: scroll;
  height: 100%;
`

const Footer = styled.div`
  position: absolute;
  height: 67px;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  width: 100%;
`

type Props = {
  footer: JSX.Element
  children: JSX.Element
}

const BottomBarLayout = ({ footer, children }: Props): JSX.Element => {
  return (
    <Wrapper>
      <Content>{children}</Content>
      <Footer>{footer}</Footer>
    </Wrapper>
  )
}

export default BottomBarLayout

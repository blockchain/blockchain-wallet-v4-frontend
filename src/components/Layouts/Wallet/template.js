import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'
import Alerts from 'components/shared/Alerts'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-grow: 1;
  display: flex;
  min-height: 0;
`
const Nav = styled.div`
  flex: 0 0 60px;
  background-color: #004A7C;
`
const Left = styled.div`
  flex: 0 0 270px;
  padding: 15px;
  background: #F5F7F9;
  border-right: 1px solid #DDD;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: calc(100% - 270px);
`
const Top = styled.div`
  flex: 0 0 115px;
  width: 100%;
`
const Page = styled.div`
  height: calc(100% - 115px);
  width: 100%;
  overflow-y: auto;
`

const WalletLayout = (props) => (
  <Wrapper>
    <Alerts />
    <Nav>
      <Header />
    </Nav>
    <Container>
      <Left>
        <MenuLeft location={props.location} />
      </Left>
      <Content>
        <Top>
          <MenuTop />
        </Top>
        <Page>
          {props.children}
        </Page>
      </Content>
    </Container>
  </Wrapper>
)

export default WalletLayout

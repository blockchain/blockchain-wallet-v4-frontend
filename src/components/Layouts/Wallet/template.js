import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'
import Alerts from 'components/shared/Alerts'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`
const Nav = styled.div`
  flex: 0 0 60px;
  background-color: #004A7C;
`
const Left = styled.div`
  flex: 0 0 270px;
  padding: 15px;
  box-sizing: border-box;
  background: #F5F7F9;
  border-right: 1px solid #DDDDDD;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
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

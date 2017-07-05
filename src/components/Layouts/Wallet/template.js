import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'
import Alerts from 'components/shared/Alerts'

const WalletLayoutWrapper = styled.div`
  flex-grow: 1;
  height: 100%;
`
const WalletLayoutContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100% - 55px);
`
const WalletLayoutLeft = styled.div`
  display: flex;
  width: 270px;
  height: 100%;
`
const WalletLayoutContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`
const WalletLayoutTop = styled.div`
  display: flex;
  width: 100%;
  height: 115px;
`
const WalletLayoutPage = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 115px);
  overflow-y: scroll;
`

const WalletLayout = (props) => (
  <WalletLayoutWrapper>
    <Alerts />
    <Header />
    <WalletLayoutContainer>
      <WalletLayoutLeft>
        <MenuLeft location={props.location} />
      </WalletLayoutLeft>
      <WalletLayoutContent>
        <WalletLayoutTop>
          <MenuTop />
        </WalletLayoutTop>
        <WalletLayoutPage>
          {props.children}
        </WalletLayoutPage>
      </WalletLayoutContent>
    </WalletLayoutContainer>
  </WalletLayoutWrapper>
)

export default WalletLayout

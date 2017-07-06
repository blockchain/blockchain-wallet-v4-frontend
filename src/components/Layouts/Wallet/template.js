import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'
import Alerts from 'components/Shared/Alerts'

const WalletLayoutWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const WalletLayoutContainer = styled.div`
  width: 100%;
  height: 100%;
  flex-grow: 1;
  display: flex;
  min-height: 0;
`

const WalletLayoutLeft = styled.div`
  flex: 0 0 270px;
  padding: 15px;
  background: #F5F7F9;
  border-right: 1px solid #DDD;
`

const WalletLayoutContent = styled.div`
`

const WalletLayoutTop = styled.div`
`

const WalletLayoutPage = styled.div`
`

const WalletLayout = (props) => (
  <WalletLayoutWrapper>
    <Alerts />
    <Header />
    <WalletLayoutContainer>
      <WalletLayoutLeft className='layout-left'>
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

import React from 'react'
import styled from 'styled-components'

import MobileNumber from './MobileNumber'
import WalletLanguage from './WalletLanguage'
import LocalCurrency from './LocalCurrency'
import Notifications from './Notifications'
import BitcoinLinkHandling from './BtcLinkHandling'
import AutoLogout from './AutoLogout'
import Themes from './Themes'

const Wrapper = styled.section`
  width: 100%;
  padding: 30px;
  margin-bottom: 80px;
  box-sizing: border-box;
`

const Preferences = () => {
  return (
    <Wrapper>
      <MobileNumber />
      <WalletLanguage />
      <LocalCurrency />
      <Notifications />
      <BitcoinLinkHandling />
      <AutoLogout />
      <Themes />
    </Wrapper>
  )
}

export default Preferences

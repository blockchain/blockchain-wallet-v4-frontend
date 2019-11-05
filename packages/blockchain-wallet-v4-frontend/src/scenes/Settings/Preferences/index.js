import AutoLogout from './AutoLogout'
import BtcLinkHandling from './BtcLinkHandling'
import LocalCurrency from './LocalCurrency'
import MobileNumber from './MobileNumber'
import Notifications from './Notifications'
import React from 'react'
import styled from 'styled-components'
import Themes from './Themes'
import WalletLanguage from './WalletLanguage'

const Wrapper = styled.section`
  width: 100%;
  padding: 10px 30px 30px;
  box-sizing: border-box;
`

const Preferences = () => {
  return (
    <Wrapper>
      <MobileNumber />
      <WalletLanguage />
      <LocalCurrency />
      <Notifications />
      <BtcLinkHandling />
      <AutoLogout />
      <Themes />
    </Wrapper>
  )
}

export default Preferences

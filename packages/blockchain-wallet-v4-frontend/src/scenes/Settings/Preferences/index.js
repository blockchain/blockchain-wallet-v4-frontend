import AutoLogout from './AutoLogout'
import CryptoLinkHandling from './CryptoLinkHandling'
import LocalCurrency from './LocalCurrency'
import media from 'services/ResponsiveService'
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

  ${media.mobile`
    padding: 0;
  `}
`

const Preferences = () => {
  return (
    <Wrapper>
      <MobileNumber />
      <WalletLanguage />
      <LocalCurrency />
      <Notifications />
      <CryptoLinkHandling />
      <AutoLogout />
      <Themes />
    </Wrapper>
  )
}

export default Preferences

import React from 'react'
import styled from 'styled-components'

import { Text } from 'components/generic/Text'
import InfoWell from 'components/shared/InfoWell'
import EmailAddress from './EmailAddress'
import MobileNumber from './MobileNumber'
import WalletLanguage from './WalletLanguage'
import LocalCurrency from './LocalCurrency'
import BitcoinUnit from './BitcoinUnit'
import Notifications from './Notifications'
import BitcoinLinkHandling from './BitcoinLinkHandling'
import AutoLogout from './AutoLogout'
import Themes from './Themes'

const Wrapper = styled.section`
  padding: 30px;
  box-sizing: border-box;
`

const Preferences = () => {
  return (
    <Wrapper>
      <InfoWell>
        <Text id='scenes.preferences.explain' text='Customize your wallet experience.' small />
      </InfoWell>
      <EmailAddress />
      <MobileNumber />
      <WalletLanguage />
      <LocalCurrency />
      <BitcoinUnit />
      <Notifications />
      <BitcoinLinkHandling />
      <AutoLogout />
      <Themes />
    </Wrapper>
  )
}

export default Preferences

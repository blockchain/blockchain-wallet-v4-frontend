import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import InfoWell from 'components/InfoWell'
import MobileNumber from './MobileNumber'
import WalletLanguage from './WalletLanguage'
import LocalCurrency from './LocalCurrency'
import Notifications from './Notifications'
import BitcoinLinkHandling from './BitcoinLinkHandling'
import AutoLogout from './AutoLogout'
import Themes from './Themes'

const Wrapper = styled.section`
  padding: 30px;
  margin-bottom: 80px;
  box-sizing: border-box;
`

const Preferences = () => {
  return (
    <Wrapper>
      <InfoWell>
        <FormattedMessage id='scenes.preferences.explain' defaultMessage='Customize your wallet experience.' />
      </InfoWell>
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

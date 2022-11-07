import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import MenuHeader from 'components/MenuHeader'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { media } from 'services/styles'

import AutoLogout from './AutoLogout'
import CryptoLinkHandling from './CryptoLinkHandling'
import LocalCurrency from './LocalCurrency'
import MobileNumber from './MobileNumber'
import Notifications from './Notifications'
import Themes from './Themes'
import TradingCurrency from './TradingCurrency'
import WalletLanguage from './WalletLanguage'

const Wrapper = styled.section`
  width: 100%;
  box-sizing: border-box;

  ${media.mobile`
    padding: 0;
  `}
`

const Title = styled(Text)`
  margin: 4px 0;
`

const Preferences = () => {
  const themeEnabled: boolean = useSelector(
    (state: RootState) =>
      selectors.core.walletOptions.getThemeEnabled(state).getOrElse(false) as boolean
  )

  return (
    <Wrapper>
      <MenuHeader>
        <Title size='26px' weight={600} color='black'>
          <FormattedMessage
            id='scenes.preferences.menu.title'
            defaultMessage='Account Preferences'
          />
        </Title>
        <Text size='14px' weight={500} color='grey700'>
          <FormattedMessage
            id='scenes.settings.menu.subtitle'
            defaultMessage='Manage your contact info, languages, notifications, themes and more.'
          />
        </Text>
      </MenuHeader>
      <MobileNumber />
      <WalletLanguage />
      <TradingCurrency />
      <LocalCurrency />
      <Notifications />
      <CryptoLinkHandling />
      <AutoLogout />
      {themeEnabled && <Themes />}
    </Wrapper>
  )
}

export default Preferences

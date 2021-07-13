import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { media } from 'services/styles'

import AutoLogout from './AutoLogout'
import CryptoLinkHandling from './CryptoLinkHandling'
import LocalCurrency from './LocalCurrency'
import MobileNumber from './MobileNumber'
import Notifications from './Notifications'
import Themes from './Themes'
import WalletLanguage from './WalletLanguage'

const Wrapper = styled.section`
  width: 100%;
  box-sizing: border-box;

  ${media.mobile`
    padding: 0;
  `}
`
const MenuHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`
const Title = styled(Text)`
  margin: 4px 0;
`

const Preferences = () => {
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
      <LocalCurrency />
      <Notifications />
      <CryptoLinkHandling />
      <AutoLogout />
      <Themes />
    </Wrapper>
  )
}

export default Preferences

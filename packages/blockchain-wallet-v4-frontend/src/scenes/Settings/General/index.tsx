import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getPairingCodeFlag } from '@core/redux/walletOptions/selectors'
import { Text } from 'blockchain-info-components'
import MenuHeader from 'components/MenuHeader'

import About from './About'
import LinkedBanks from './LinkedBanks'
import LinkedCards from './LinkedCards'
import LinkedWireBanks from './LinkedWireBanks'
import PairingCode from './PairingCode'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'
import WalletId from './WalletId'
import WalletVersion from './WalletVersion'

const Title = styled(Text)`
  margin: 4px 0;
`

const General = () => {
  const showPairingCode = useSelector(
    getPairingCodeFlag,
    (prev, next) => prev.data === next.data
  ).getOrElse(false)

  return (
    <section>
      <MenuHeader>
        <Title size='26px' weight={600} color='black'>
          <FormattedMessage
            id='scenes.settings.general.title'
            defaultMessage='General Information'
          />
        </Title>
        <Text size='14px' weight={500} color='grey700'>
          <FormattedMessage
            id='scenes.settings.general.subtitle'
            defaultMessage='View your wallet ID and other helpful links.'
          />
        </Text>
      </MenuHeader>
      <WalletId />
      {/* We are hiding the pairing code on production as
      for wallet security */}
      {showPairingCode && <PairingCode />}
      <LinkedBanks />
      <LinkedWireBanks />
      <LinkedCards />
      <PrivacyPolicy />
      <TermsOfService />
      <About />
      <WalletVersion />
    </section>
  )
}

export default General

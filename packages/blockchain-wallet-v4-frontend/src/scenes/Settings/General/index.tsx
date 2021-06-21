import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { selectors } from 'data'

import About from './About'
import LinkedBanks from './LinkedBanks'
import LinkedCards from './LinkedCards'
import LinkedWireBanks from './LinkedWireBanks'
import PairingCode from './PairingCode'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'
import WalletId from './WalletId'
import WalletVersion from './WalletVersion'

const MenuHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`
const Title = styled(Text)`
  margin: 4px 0;
`

const General = (props: Props) => {
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
      {props.showPairingCode && <PairingCode />}
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

const mapStateToProps = (state) => ({
  showPairingCode: selectors.core.walletOptions.getPairingCodeFlag(state).getOrElse(false)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(General)

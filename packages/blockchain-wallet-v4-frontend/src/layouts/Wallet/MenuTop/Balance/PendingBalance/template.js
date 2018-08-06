import React from 'react'

import SfoxPendingBalance from './SfoxPendingBalance'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import { Wrapper, Header } from 'components/Balances'

const Template = props => (
  <Wrapper>
    <Header>
      <Text size='14px'>
        <FormattedMessage
          id='layouts.wallet.menutop.balance.walletbalance.pending'
          defaultMessage='Pending'
        />
      </Text>
    </Header>
    <SfoxPendingBalance />
  </Wrapper>
)

export default Template

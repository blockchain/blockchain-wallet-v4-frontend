import React from 'react'

import BtcWatchOnlyBalance from './BtcWatchOnlyBalance'
import BchWatchOnlyBalance from './BchWatchOnlyBalance'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import { Wrapper, Header } from 'components/Balances'

const Template = props => (
  <Wrapper>
    <Header>
      <Text size='14px'>
        <FormattedMessage
          id='layouts.wallet.menutop.balance.walletbalance.nonspendable'
          defaultMessage='Non-Spendable'
        />
      </Text>
    </Header>
    <BtcWatchOnlyBalance />
    <BchWatchOnlyBalance />
  </Wrapper>
)

export default Template

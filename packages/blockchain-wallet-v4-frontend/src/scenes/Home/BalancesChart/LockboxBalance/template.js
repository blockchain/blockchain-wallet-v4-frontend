import React from 'react'

import BtcLockboxBalance from './BtcLockboxBalance'
import EthLockboxBalance from './EthLockboxBalance'
import BchLockboxBalance from './BchLockboxBalance'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import { Wrapper, Header } from 'components/Balances'

const Template = props => (
  <Wrapper>
    <Header>
      <Text size='14px'>
        <FormattedMessage
          id='layouts.wallet.menutop.balance.walletbalance.Lockbox'
          defaultMessage='Lockbox'
        />
      </Text>
    </Header>
    <BtcLockboxBalance />
    <EthLockboxBalance />
    <BchLockboxBalance />
  </Wrapper>
)

export default Template

import React from 'react'
import { Wrapper, Header } from 'components/Balances'

import BtcBalance from './BtcBalance'
import EthBalance from './EthBalance'
import BchBalance from './BchBalance'
import { FormattedMessage } from 'react-intl'

const Success = props => (
  <Wrapper>
    <Header>
      <FormattedMessage
        id='layouts.wallet.menutop.balance.walletbalance.wallet'
        defaultMessage='Wallet'
      />
    </Header>
    <BtcBalance />
    <EthBalance />
    <BchBalance />
  </Wrapper>
)

export default Success

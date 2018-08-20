import React from 'react'

import BtcBalance from './BtcBalance'
import EthBalance from './EthBalance'
import BchBalance from './BchBalance'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import { Wrapper, Header } from 'components/Balances'

const Success = props => (
  <Wrapper>
    <Header>
      <Text size='14px'>
        <FormattedMessage
          id='layouts.wallet.menutop.balance.walletbalance.wallet'
          defaultMessage='Wallet'
        />
      </Text>
    </Header>
    {props.totalBalance}
    <BtcBalance />
    <BchBalance />
    <EthBalance />
  </Wrapper>
)
export default Success

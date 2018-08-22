import React from 'react'

import BtcBalance from './BtcBalance'
import EthBalance from './EthBalance'
import BchBalance from './BchBalance'
import { FormattedMessage } from 'react-intl'
import {
  HomeBalanceRow,
  HomeBalanceTable,
  HomeBalanceAmount,
  HomeBalanceHeaderTitle
} from 'components/Balances'

const Success = props => (
  <HomeBalanceTable>
    <HomeBalanceRow>
      <HomeBalanceHeaderTitle>
        <FormattedMessage
          id='layouts.wallet.menutop.balance.walletbalance.totalbalance'
          defaultMessage='Total Balance'
        />
      </HomeBalanceHeaderTitle>
      <HomeBalanceAmount>{props.totalBalance}</HomeBalanceAmount>
    </HomeBalanceRow>
    <HomeBalanceRow>
      <BtcBalance />
    </HomeBalanceRow>
    <HomeBalanceRow>
      <BchBalance />
    </HomeBalanceRow>
    <HomeBalanceRow>
      <EthBalance />
    </HomeBalanceRow>
  </HomeBalanceTable>
)
export default Success

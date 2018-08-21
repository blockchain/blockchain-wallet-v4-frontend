import React from 'react'

import BtcLockboxBalance from './BtcLockboxBalance'
import EthLockboxBalance from './EthLockboxBalance'
import BchLockboxBalance from './BchLockboxBalance'
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
          id='layouts.wallet.menutop.balance.walletbalance.lockboxbalance'
          defaultMessage='Lockbox Balance'
        />
      </HomeBalanceHeaderTitle>
      <HomeBalanceAmount>{props.totalBalance}</HomeBalanceAmount>
    </HomeBalanceRow>
    <HomeBalanceRow>
      <BtcLockboxBalance />
    </HomeBalanceRow>
    <HomeBalanceRow>
      <BchLockboxBalance />
    </HomeBalanceRow>
    <HomeBalanceRow>
      <EthLockboxBalance />
    </HomeBalanceRow>
  </HomeBalanceTable>
)
export default Success

import React from 'react'
import { FormattedMessage } from 'react-intl'

import BtcLockboxBalance from './BtcLockboxBalance/index'
import EthLockboxBalance from './EthLockboxBalance/index'
import BchLockboxBalance from './BchLockboxBalance/index'

import {
  HomeBalanceRow,
  HomeBalanceTable,
  HomeBalanceAmount,
  HomeBalanceHeaderTitle
} from 'components/Balances'

const Success = props => {
  const { viewType } = props
  return (
    <HomeBalanceTable>
      <HomeBalanceRow>
        <HomeBalanceHeaderTitle>
          <FormattedMessage
            id='layouts.wallet.menutop.balance.walletbalance.header'
            defaultMessage='{viewType} Balance'
            values={{ viewType }}
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
}
export default Success

import React from 'react'

import DataError from '../../../../components/DataError'
import Loading from './template.loading'
import Success from './template.success'
import { TransactionType } from '@network/api/btc/types'
import { CoinType, CurrencyType } from 'blockchain-wallet-v4-frontend/src/types'

export type PropTypes = {
  buySellPartner: string
  coin: CoinType
  currency: CurrencyType
  data?: any
  transactions: Array<TransactionType>
  onArchive?: () => void
}

class Pages extends React.PureComponent<PropTypes> {
  render() {
    const { buySellPartner, coin, currency, data } = this.props

    return data.cata({
      Success: (value: Array<TransactionType>) => (
        <Success
          coin={coin}
          currency={currency}
          transactions={value}
          buySellPartner={buySellPartner}
        />
      ),
      Failure: message => (
        <DataError onClick={this.props.onArchive} message={message} />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

export default Pages

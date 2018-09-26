import React from 'react'

import DataError from 'components/DataError'
import Loading from './template.loading'
import Success from './template.success'

class Pages extends React.PureComponent {
  render () {
    const { buySellPartner, coin, currency, data } = this.props

    return data.cata({
      Success: value => (
        <Success
          transactions={value}
          coin={coin}
          currency={currency}
          buySellPartner={buySellPartner}
        />
      ),
      Failure: () => <DataError onClick={() => this.props.onRefresh()} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

export default Pages

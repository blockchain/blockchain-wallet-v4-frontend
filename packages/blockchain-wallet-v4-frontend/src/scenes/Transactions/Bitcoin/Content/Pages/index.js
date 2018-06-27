import React from 'react'

import DataError from 'components/DataError'
import Loading from './template.loading'
import Success from './template.success'

class Pages extends React.PureComponent {
  render () {
    const { data, shiftTrades } = this.props

    return data.cata({
      Success: (value) => <Success transactions={value} shiftTrades={shiftTrades} />,
      Failure: () => <DataError onClick={() => this.props.onRefresh()} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

export default Pages

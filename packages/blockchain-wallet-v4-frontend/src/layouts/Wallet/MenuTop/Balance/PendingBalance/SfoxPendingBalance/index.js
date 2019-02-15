import React from 'react'
import { connect } from 'react-redux'

import { getData } from '../selectors'
import Success from './template.success'
import { LoadingBalance } from 'components/Balances'

class SfoxPendingBalance extends React.PureComponent {
  render () {
    const { data } = this.props

    return data.cata({
      Success: value => <Success balance={value} />,
      Loading: () => <LoadingBalance coin='BTC' />,
      Failure: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(mapStateToProps)(SfoxPendingBalance)

import { connect } from 'react-redux'
import React from 'react'

import { getData } from '../selectors'
import { LoadingBalance } from 'components/Balances'
import Success from './template.success'

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

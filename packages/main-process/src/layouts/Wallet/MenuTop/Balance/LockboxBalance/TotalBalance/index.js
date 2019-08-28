import React from 'react'
import { connect } from 'react-redux'
import { getTotalBalance } from 'components/Balances/lockbox/selectors'

import Error from './template.error'
import Success from './template.success'
import { LoadingBalance } from 'components/Balances'

class TotalBalance extends React.PureComponent {
  render () {
    return this.props.data.cata({
      Success: value => (
        <Success totalBalance={value.totalBalance} large={this.props.large} />
      ),
      Failure: msg => <Error>{msg}</Error>,
      Loading: () => <LoadingBalance large={this.props.large} />,
      NotAsked: () => <LoadingBalance large={this.props.large} />
    })
  }
}

const mapStateToProps = state => ({
  data: getTotalBalance(state)
})

export default connect(mapStateToProps)(TotalBalance)

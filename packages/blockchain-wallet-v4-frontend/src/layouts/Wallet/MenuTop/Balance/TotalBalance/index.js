import React from 'react'
import { connect } from 'react-redux'
import { getTotalBalance } from 'components/Balances/total/selectors'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class TotalBalance extends React.PureComponent {
  render () {
    return this.props.data.cata({
      Success: value => (
        <Success totalBalance={value.totalBalance} large={this.props.large} />
      ),
      Failure: msg => <Error>{msg}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getTotalBalance(state)
})

export default connect(mapStateToProps)(TotalBalance)

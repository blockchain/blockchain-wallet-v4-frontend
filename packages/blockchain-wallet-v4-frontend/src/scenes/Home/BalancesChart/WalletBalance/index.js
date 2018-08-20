import React from 'react'
import { connect } from 'react-redux'
import { getData } from './selectors'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class WalletBalance extends React.PureComponent {
  render () {
    return this.props.data.cata({
      Success: value => <Success totalBalance={value.totalBalance} />,
      Failure: msg => <Error>{msg}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(mapStateToProps)(WalletBalance)

import React from 'react'
import { connect } from 'react-redux'
import { getData } from './selectors'

import Loading from './template.loading'
import Success from './template.success'

class CoinPerformance extends React.PureComponent {
  render () {
    const { data } = this.props

    return data.cata({
      Success: value => <Success {...value} />,
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(mapStateToProps)(CoinPerformance)

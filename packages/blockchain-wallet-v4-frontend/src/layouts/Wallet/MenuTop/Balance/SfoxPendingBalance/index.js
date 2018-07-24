import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class SfoxPendingBalance extends React.PureComponent {
  render () {
    const { data } = this.props

    return data.cata({
      Success: value => <Success balance={value} />,
      Loading: () => <Loading />,
      Failure: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(mapStateToProps)(SfoxPendingBalance)

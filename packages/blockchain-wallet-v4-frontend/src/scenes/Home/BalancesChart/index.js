import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import configure from './chart.config.js'
import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class BalancesChart extends React.Component {
  componentWillMount () {
  }

  componentWillReceiveProps (nextProps) {
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success
        config={configure(value)}
      />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataMiscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BalancesChart)

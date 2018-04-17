import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { getData } from './selectors'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ChartContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized('BTC', 'all')
  }

  render () {
    return this.props.data.cata({
      Success: (value) => <Success
        currency={value.currency}
        coin={value.coin}
        time={value.time}
        data={value.data}
      />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceChart, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer)

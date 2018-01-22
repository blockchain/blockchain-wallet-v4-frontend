import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'

import { getData } from './selectors'
import Success from './template.success.js'
import Loading from './template.loading.js'
import Error from './template.error.js'

class ExchangeHistoryContainer extends React.Component {
  componentWillMount () {
    this.props.exchangeHistoryActions.initExchangeHistory(1)
  }

  render () {
    const { data, ...rest } = this.props
    console.log('Data', data)

    return data.cata({
      Success: (value) => <Success {...rest} tradeHistory={value} />,
      Failure: (message) => <Error message={message} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  // data: getData(state, 1)
})

const mapDispatchToProps = dispatch => ({
  exchangeHistoryActions: bindActionCreators(actions.modules.exchangeHistory, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeHistoryContainer)

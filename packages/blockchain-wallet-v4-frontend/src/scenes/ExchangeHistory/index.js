import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ExchangeHistoryContainer extends React.PureComponent {
  componentDidMount () {
    // this.props.actions.exchangeHistory.initialized()
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success trades={value} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchangeHistory, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeHistoryContainer)

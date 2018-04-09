import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import ui from 'redux-ui'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const threshold = 250

class ExchangeHistoryContainer extends React.Component {
  componentWillMount () {
    this.props.dataShapeshiftActions.refreshShapeshiftTrades()
  }

  componentWillReceiveProps (nextProps) {
    // Appends more transactions depending on the scroll position
    if (!equals(this.props.scroll.yOffset, nextProps.scroll.yOffset)) {
      if (nextProps.scroll.yMax - nextProps.scroll.yOffset < threshold) {
        this.props.updateUI({ total: this.props.ui.total + 10 })
      }
    }
  }

  componentWillUnmount () {
    this.props.dataShapeshiftActions.cancelRefreshShapeshiftTrades()
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
  data: getData(state, ownProps.ui.total),
  scroll: selectors.scroll.selectScroll(state)
})

const mapDispatchToProps = dispatch => ({
  dataShapeshiftActions: bindActionCreators(actions.modules.sendShapeshift, dispatch)
})

const enhance = compose(
  ui({ key: 'EtherTransactions', state: { total: 10 } }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ExchangeHistoryContainer)
